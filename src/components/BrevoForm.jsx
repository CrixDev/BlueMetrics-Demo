import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Mail, User, Phone, Building, ArrowRight } from 'lucide-react';

const BrevoForm = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // useEffect sigue siendo necesario para cargar la hoja de estilos base de Brevo.
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://sibforms.com/forms/end-form/build/sib-styles.css';
    document.head.appendChild(link);

    // Limpia el <link> cuando el componente se desmonte
    return () => {
      document.head.removeChild(link);
    };
  }, []); // El array vacío asegura que se ejecute solo una vez

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir el envío por defecto
    setIsSubmitting(true);
    
    try {
      // Crear FormData con los datos del formulario
      const formData = new FormData(e.target);
      
      // Enviar datos a Brevo usando fetch
      const response = await fetch('https://e098f742.sibforms.com/serve/MUIFAOkhus2nKJ9I3zdEQPLgWqYSLd6nqUWY12Q2SO-Q8kM9CFbggF-2fm708G9weeKcHv3uv8UGs-64SzWr_B67ipt9L6mxOUR7d_zwJBxgoo0rUK-6h50gmaqlNyeSuzWQ2padLpJE-lnFZdUfEccYFm3nh96Nr7KqqhaTZlK0vMUPIYEj6aFXyNc_3YwvGTl6RCMeDsWpQwe2', {
        method: 'POST',
        body: formData,
        mode: 'no-cors' // Importante para evitar problemas de CORS
      });
      
      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Formulario enviado exitosamente. Redirigiendo a /confirmacion');
      
      // Redirigir a la página de confirmación
      navigate('/confirmacion');
      
    } catch (error) {
      console.error('Error al enviar el formulario:', error);
      setIsSubmitting(false);
      
      // Mostrar mensaje de error (opcional)
      alert('Hubo un problema al enviar el formulario. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <Card className="border-0 shadow-none bg-transparent">
      <CardContent className="p-8">
        <form
          id="sib-form"
          method="POST"
          action="https://e098f742.sibforms.com/serve/MUIFAOkhus2nKJ9I3zdEQPLgWqYSLd6nqUWY12Q2SO-Q8kM9CFbggF-2fm708G9weeKcHv3uv8UGs-64SzWr_B67ipt9L6mxOUR7d_zwJBxgoo0rUK-6h50gmaqlNyeSuzWQ2padLpJE-lnFZdUfEccYFm3nh96Nr7KqqhaTZlK0vMUPIYEj6aFXyNc_3YwvGTl6RCMeDsWpQwe2"
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          {/* Título */}
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-blue-900 mb-3">
              ¡Solicita tu demo ahora!
            </h3>
            <p className="text-blue-700 text-lg leading-relaxed">
              Descubre cómo BlueMetrics puede transformar la gestión hídrica de tu empresa
            </p>
          </div>
          
          {/* Campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo NOMBRE */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900" htmlFor="NOMBRE">
                Nombre *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  type="text" 
                  id="NOMBRE" 
                  name="NOMBRE" 
                  autoComplete="off" 
                  placeholder="Tu nombre completo" 
                  required 
                />
              </div>
            </div>

            {/* Campo APELLIDOS */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900" htmlFor="APELLIDOS">
                Apellidos
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  type="text" 
                  id="APELLIDOS" 
                  name="APELLIDOS" 
                  autoComplete="off" 
                  placeholder="Tus apellidos" 
                />
              </div>
            </div>

            {/* Campo EMAIL */}
            <div className="space-y-2 md:col-span-2">
              <label className="block text-sm font-semibold text-blue-900" htmlFor="EMAIL">
                Correo electrónico *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  type="email" 
                  id="EMAIL" 
                  name="EMAIL" 
                  autoComplete="off" 
                  placeholder="tu@empresa.com" 
                  required 
                />
              </div>
            </div>

            {/* Campo TELEFONO */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900" htmlFor="TELEFONO">
                Teléfono
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  type="tel" 
                  id="TELEFONO" 
                  name="TELEFONO" 
                  autoComplete="off" 
                  placeholder="+52 (844) 123-4567" 
                />
              </div>
            </div>

            {/* Campo EMPRESA */}
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-blue-900" htmlFor="EMPRESA">
                Empresa
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
                  type="text" 
                  id="EMPRESA" 
                  name="EMPRESA" 
                  autoComplete="off" 
                  placeholder="Nombre de tu empresa" 
                />
              </div>
            </div>
          </div>

        
          
          {/* Botón de envío */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 text-lg font-semibold rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Enviando solicitud...
                </>
              ) : (
                <>
                  Solicitar demo gratuito
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>
          </div>

          {/* Campos ocultos */}
          <input type="text" name="email_address_check" value="" className="hidden" />
          <input type="hidden" name="locale" value="es" />
          <input type="hidden" name="html_type" value="simple" />
        </form>
      </CardContent>
    </Card>
  );
};

export default BrevoForm;