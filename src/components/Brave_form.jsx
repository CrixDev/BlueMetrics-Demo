import React, { useEffect } from 'react';

const BrevoForm = () => {
  useEffect(() => {
    // La lógica para cargar el script de Brevo no cambia.
    window.REQUIRED_CODE_ERROR_MESSAGE = 'Elija un código de país';
    window.LOCALE = 'es';
    window.EMAIL_INVALID_MESSAGE = window.SMS_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo.";
    window.REQUIRED_ERROR_MESSAGE = "Este campo no puede quedarse vacío. ";
    window.GENERIC_INVALID_MESSAGE = "La información que ha proporcionado no es válida. Compruebe el formato del campo e inténtelo de nuevo.";
    window.translation = {
      common: {
        selectedList: '{quantity} lista seleccionada',
        selectedLists: '{quantity} listas seleccionadas',
      }
    };
    window.AUTOHIDE = Boolean(0);

    const script = document.createElement('script');
    script.src = "https://sibforms.com/forms/end-form/build/main.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    // Contenedor principal del formulario
    <div className="sib-form font-sans text-center">
      <div id="sib-form-container" className="sib-form-container">
        
        {/* Paneles de mensajes de error y éxito */}
        <div id="error-message" className="sib-form-message-panel max-w-lg mx-auto p-4 my-3 text-left text-red-700 bg-red-50 border border-red-200 rounded-xl shadow-sm">
          {/* ... SVG y texto de error ... */}
        </div>
        <div id="success-message" className="sib-form-message-panel max-w-lg mx-auto p-4 my-3 text-left text-blue-700 bg-blue-50 border border-blue-200 rounded-xl shadow-sm">
          {/* ... SVG y texto de éxito ... */}
        </div>

        {/* Contenedor del formulario */}
        <div id="sib-container" className="sib-container--large sib-container--vertical max-w-lg mx-auto bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl shadow-xl border border-blue-100 text-left">
          <form id="sib-form" method="POST" action="https://e098f742.sibforms.com/serve/MUIFAFuko1OfXnSM2OwUlj3YLsEvwI5BXutGRXx6O6Rks2asDWxlOgsg3-yjAHVRa7gfVRnwGCORoSL5vqSNVqyzVKSFTh0-GzwblYtWkR-ZvKy1t9cBOH-zec1MQXKs9MAziYeRKzmOrXNHTcXteDE9J-qKKrsbEzUKiTP4l8KmP1j4M2fpkiwoxHvfHDlh5QD2hhybGRbWzX6_" data-type="subscription">
            
            {/* Encabezado */}
            <div className="mb-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 className="sib-form-block text-3xl font-bold text-blue-900 mb-3">
                ¡Accede a tu demo ahora!
              </h2>
              <p className="sib-text-form-block text-lg text-blue-700">
                Rellena el formulario para poder contactarte y transformar tu negocio.
              </p>
            </div>
            
            {/* Campos del Formulario */}
            <div className="space-y-6">
              {/* CAMPO NOMBRE */}
              <div className="sib-input sib-form-block">
                <div className="form__entry entry_block">
                  <label htmlFor="NOMBRE" className="entry__label block text-base font-semibold text-blue-900 mb-2">Nombre *</label>
                  <input 
                    type="text" 
                    id="NOMBRE" 
                    name="NOMBRE" 
                    className="input w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/80 placeholder-blue-400" 
                    placeholder="Tu nombre completo" 
                    required 
                  />
                  <label className="entry__error entry__error--primary mt-1 text-sm text-red-600"></label>
                </div>
              </div>

              {/* CAMPO APELLIDOS */}
              <div className="sib-input sib-form-block">
                <div className="form__entry entry_block">
                  <label htmlFor="APELLIDOS" className="entry__label block text-base font-semibold text-blue-900 mb-2">Apellidos</label>
                  <input 
                    type="text" 
                    id="APELLIDOS" 
                    name="APELLIDOS" 
                    className="input w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/80 placeholder-blue-400" 
                    placeholder="Tus apellidos" 
                  />
                  <label className="entry__error entry__error--primary mt-1 text-sm text-red-600"></label>
                </div>
              </div>

              {/* CAMPO EMAIL */}
              <div className="sib-input sib-form-block">
                <div className="form__entry entry_block">
                  <label htmlFor="EMAIL" className="entry__label block text-base font-semibold text-blue-900 mb-2">Email *</label>
                  <input 
                    type="email" 
                    id="EMAIL" 
                    name="EMAIL" 
                    className="input w-full px-4 py-3 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white/80 placeholder-blue-400" 
                    placeholder="tu@empresa.com" 
                    required 
                  />
                  <label className="entry__error entry__error--primary mt-1 text-sm text-red-600"></label>
                </div>
              </div>
            </div>
            
            {/* Separador */}
            <div className="my-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-blue-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-gradient-to-br from-blue-50 to-white text-blue-600 font-medium">Envía tu información</span>
                </div>
              </div>
            </div>

            {/* Botón de envío */}
            <div>
              <button 
                form="sib-form" 
                type="submit" 
                className="sib-form-block__button sib-form-block__button-with-loader w-full px-6 py-4 text-lg font-bold text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <span className="flex items-center justify-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Solicitar Demo
                </span>
              </button>
              <p className="text-center text-sm text-blue-600 mt-3">
                ✨ Sin compromiso • Respuesta en 24 horas • Soporte personalizado
              </p>
            </div>

            <input type="text" name="email_address_check" defaultValue="" className="input--hidden" />
            <input type="hidden" name="locale" defaultValue="es" />
          </form>
        </div>
      </div>
    </div>
  );
};

export default BrevoForm;