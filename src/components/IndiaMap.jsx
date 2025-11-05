import React, { useRef, useEffect, useState } from 'react';
import indiaSVG from '../assets/in.svg'; // Path to India map SVG

export default function IndiaMap({ onStateClick }) {
  const svgContainerRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    // Load India SVG file
    fetch(indiaSVG)
      .then(res => res.text())
      .then(data => {
        setSvgContent(data);
      })
      .catch(err => console.error('Failed to load India SVG:', err));
  }, []);

  const handleClick = (event) => {
    const id = event.target.id;
    console.log('Clicked SVG ID:', id);
    if (onStateClick) onStateClick(id);
  };

  return (
    <div className="map-wrapper">
      <div
        ref={svgContainerRef}
        className="india-map-container"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      <p className="legend">🕉️ Click on a state to explore its ancient temples.</p>

      <style>{`
        .map-wrapper {
          text-align: center;
          padding: 1.5rem;
          background: linear-gradient(180deg, #fffdf7 0%, #fff5e1 100%);
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          max-width: 900px;
          margin: 2rem auto;
        }

        .india-map-container svg {
          width: 100%;
          height: auto;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .india-map-container path {
          fill: #e8dcb8;
          stroke: #b48b4a;
          stroke-width: 0.8;
          transition: fill 0.3s ease, transform 0.2s ease;
        }

        .india-map-container path:hover {
          fill: #d4a373;
          transform: scale(1.02);
          filter: drop-shadow(0 0 3px rgba(0,0,0,0.2));
        }

        .legend {
          margin-top: 1rem;
          font-size: 0.95rem;
          color: #5b4636;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}
