import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si el usuario está logueado al cargar la aplicación
  useEffect(() => {
    const storedUser = localStorage.getItem('aquanet_user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
        localStorage.removeItem('aquanet_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Función de login
  const login = async (username, password) => {
    try {
      // Simulación de autenticación - en producción sería una llamada a API
      if (username === 'admin' && password === 'admin123') {
        const userData = {
          id: 1,
          username: 'admin',
          name: 'Administrador AquaNet',
          email: 'admin@aquanet.com',
          role: 'admin',
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('aquanet_user', JSON.stringify(userData));
        
        return { success: true, message: 'Login exitoso' };
      } else if (username === 'operador' && password === 'op123') {
        const userData = {
          id: 2,
          username: 'operador',
          name: 'Operador de Campo',
          email: 'operador@aquanet.com',
          role: 'operator',
          loginTime: new Date().toISOString()
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('aquanet_user', JSON.stringify(userData));
        
        return { success: true, message: 'Login exitoso' };
      } else {
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: 'Error en el sistema' };
    }
  };

  // Función de logout
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('aquanet_user');
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

