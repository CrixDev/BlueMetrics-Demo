import React from 'react';


const WaterBackground = () => {
  return (
    <div className="water-background">
      <svg
        className="waves"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 24 150 28"
        preserveAspectRatio="none"
        shapeRendering="auto"
      >
        <defs>
          {/* Definimos la forma de la ola aquí para poder reutilizarla */}
          <path
            id="gentle-wave"
            d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
          />
        </defs>
        {/* Grupo de olas que se animarán */}
        <g className="parallax">
          {/* Reutilizamos la forma de la ola con <use> y le aplicamos clases para diferentes animaciones */}
          <use xlinkHref="#gentle-wave" x="48" y="0" className="wave wave-1" />
          <use xlinkHref="#gentle-wave" x="48" y="3" className="wave wave-2" />
          <use xlinkHref="#gentle-wave" x="48" y="5" className="wave wave-3" />
          <use xlinkHref="#gentle-wave" x="48" y="7" className="wave wave-4" />
        </g>
      </svg>
    </div>
  );
};

export default WaterBackground;