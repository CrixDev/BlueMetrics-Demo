import React from 'react';
import ErrorBoundary from '../components/errorBoundary'; // Asegúrate de importar el componente

const ContactPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-row justify-around items-center">
    
    <div className="bg-gray-50 h-full rounded shadow-md w-full max-w-md">
       <h1 className="text-3xl font-bold mb-4">Contáctanos</h1>
    </div>

      <div className="bg-gray-100 p-8 rounded shadow-md w-full max-w-md">
        <ErrorBoundary>
        <iframe
  width="500"
  height="805"
  src="https://e098f742.sibforms.com/serve/MUIFAFeKFBwLTmW1WRFwLBPqSQJgy4xMpP1nt-8FiwDOMuvE6FaOoilmzF6Xmf6F-GaR5VMRtY6UFcv6f570snazGax6Z7rZQurKRZpnRjORXibT1MzL6GLZUJrpd13QZxcK6QmVycJ6JoGQvUzmBF3JfZ8wr6UJlSgfeXXhG_al33BBk-i9nA5TdXf7rK1uBvCfsmqX0CxD5v8Y"
  frameBorder="0"
  scrolling="auto"
  allowFullScreen
  style={{
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: '100%'
  }}
></iframe>
        </ErrorBoundary>
      </div>
    </div>
  );
};

export default ContactPage;