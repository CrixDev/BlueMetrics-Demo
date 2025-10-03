import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import AquaNetLogo from '../components/svg/AquaNetLogo';
import AquaNetText from '../components/svg/AquaNetText';
import { supabase } from '../supabaseClient';
import { ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [session, setSession] = useState(null);
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [registerData, setRegisterData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
    avatar_url: null
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener la sesión activa al cargar el componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) navigate('/dashboard');
    });

    // Escuchar cambios en el estado de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) navigate('/dashboard');
    });

    // Limpiar la suscripción al desmontar
    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const result = await login(credentials.username, credentials.password);
    
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    
    setIsLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
      
      if (error) {
        setError('Error al iniciar sesión con Google: ' + error.message);
      }
    } catch (error) {
      setError('Error inesperado al iniciar sesión con Google');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Registrar usuario en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
            full_name: registerData.full_name,
          }
        }
      });

      if (authError) throw authError;

      // 2. Insertar datos adicionales en la tabla de usuarios
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: authData.user.id,
            username: registerData.username,
            full_name: registerData.full_name,
            avatar_url: registerData.avatar_url,
            email: registerData.email,
            updated_at: new Date().toISOString()
          }
        ]);

      if (profileError) throw profileError;

      // 3. Éxito - mostrar mensaje y cambiar a modo login
      setError('');
      setIsRegisterMode(false);
      alert('Cuenta creada exitosamente. Por favor, verifica tu correo electrónico.');

    } catch (error) {
      setError(error.message);
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-xl">
        <div className="text-center mb-8">
          <div className="mx-auto w-35 h-20 rounded-full flex items-center justify-center mb-4">
            <AquaNetLogo className="w-20 h-20" />
          </div>
          <div className='flex items-center justify-center'>
            <AquaNetText className="w-44 h-12" />
          </div>
          <p className="text-gray-600">Sistema de Gestión Hídrica</p>
        </div>

        {isRegisterMode ? (
          <form onSubmit={handleRegister} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={registerData.email}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={registerData.username}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre de usuario"
                required
              />
            </div>

            <div>
              <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                Nombre Completo
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={registerData.full_name}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tu nombre completo"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={registerData.password}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Crea una contraseña segura"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Creando cuenta...
                </>
              ) : (
                <>
                  Crear Cuenta
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsRegisterMode(false)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ¿Ya tienes cuenta? Inicia sesión
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Usuario
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={credentials.username}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu usuario"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Ingresa tu contraseña"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                {error}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setIsRegisterMode(true)}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                ¿No tienes cuenta? Regístrate
              </button>
            </div>
          </form>
        )}

        {/* Separador */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 text-gray-500 bg-white">O continúa con</span>
          </div>
        </div>

        {/* Botón de Google */}
        <Button 
          onClick={signInWithGoogle}
          disabled={isLoading}
          variant="outline"
          className="w-full border-2 hover:bg-gray-50 text-lg font-medium h-12"
        >
          <div className="flex items-center justify-center">
            <img 
              src="https://www.google.com/favicon.ico" 
              alt="Google" 
              className="w-5 h-5 mr-3"
            />
            {isLoading ? 'Conectando...' : 'Continuar con Google'}
          </div>
        </Button>

        {/* Usuarios de prueba */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Usuarios de prueba:</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p><strong>Administrador:</strong></p>
              <p>Usuario: admin | Contraseña: admin123</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
              <p><strong>Operador:</strong></p>
              <p>Usuario: operador | Contraseña: op123</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;

