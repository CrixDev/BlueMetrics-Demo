import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import AquaNetLogo from '../components/svg/AquaNetLogo';
import AquaNetText from '../components/svg/AquaNetText';
import { supabase } from '../supabaseClient';
import { ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    email: '',
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
    company: '',
    role: 'user',
    avatar_url: null
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
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
    try {
      setIsLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) throw error;

      if (data?.user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error de inicio de sesión:', error);
      
      // Manejo específico de errores de login
      if (error.message.includes('Invalid login credentials') || error.message.includes('invalid_credentials')) {
        setError('Correo electrónico o contraseña incorrectos. Por favor, verifica tus datos.');
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor, confirma tu correo electrónico antes de iniciar sesión.');
      } else if (error.message.includes('User not found')) {
        setError('No existe una cuenta con este correo electrónico. Por favor, regístrate primero.');
      } else {
        setError(error.message || 'Error al iniciar sesión. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
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
      // El trigger creará automáticamente el perfil en la tabla profiles
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: registerData.email,
        password: registerData.password,
        options: {
          data: {
            username: registerData.username,
            full_name: registerData.full_name,
            company: registerData.company,
            role: registerData.role,
            avatar_url: registerData.avatar_url
          }
        }
      });

      if (authError) throw authError;

      // Verificar si el usuario ya existe (Supabase devuelve success pero con identities vacías)
      if (authData?.user && authData.user.identities?.length === 0) {
        // Cambiar automáticamente al modo login con el email pre-llenado
        setCredentials({ email: registerData.email, password: '' });
        setIsRegisterMode(false);
        setError('Este correo electrónico ya está registrado. Por favor, inicia sesión con tu contraseña.');
        return;
      }

      // 2. Éxito - el perfil se crea automáticamente con el trigger
      setError('');
      setIsRegisterMode(false);
      alert('Cuenta creada exitosamente. Por favor, verifica tu correo electrónico.');

    } catch (error) {
      // Manejo específico de errores comunes
      if (error.message.includes('already registered') || error.message.includes('already exists')) {
        // Cambiar automáticamente al modo login con el email pre-llenado
        setCredentials({ email: registerData.email, password: '' });
        setIsRegisterMode(false);
        setError('Este correo electrónico ya está registrado. Por favor, inicia sesión con tu contraseña.');
      } else if (error.message.includes('password')) {
        setError('La contraseña debe tener al menos 6 caracteres.');
      } else if (error.message.includes('email')) {
        setError('Por favor, ingresa un correo electrónico válido.');
      } else {
        setError(error.message || 'Error al crear la cuenta. Por favor, intenta de nuevo.');
      }
      console.error('Error en registro:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEyePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleEyeRegisterPassword = () => {
    setShowRegisterPassword(!showRegisterPassword);
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
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                Empresa
              </label>
              <input
                type="text"
                id="company"
                name="company"
                value={registerData.company}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Nombre de tu empresa"
                required
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <select
                id="role"
                name="role"
                value={registerData.role}
                onChange={handleRegisterInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                required
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
                <option value="operator">Operador</option>
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className='flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'>
                <input
                  type={showRegisterPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterInputChange}
                  className="flex-1 outline-none"
                  placeholder="Crea una contraseña segura"
                  required
                />
                <div onClick={handleEyeRegisterPassword} className="cursor-pointer hover:text-blue-600 transition-colors">
                  {showRegisterPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </div>
              </div>
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
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="tu@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
            
            <div className='flex justify-between items-center w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent'>
              <input  
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleEmailChange}
                className="flex-1 outline-none"
                placeholder="Ingresa tu contraseña"
                required
              />
              <div onClick={handleEyePassword} className="cursor-pointer hover:text-blue-600 transition-colors">
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  </svg>
                )}
              </div>
            </div>
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
      
      </Card>
    </div>
  );
};

export default LoginPage;

