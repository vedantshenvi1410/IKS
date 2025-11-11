import React, { useRef, useEffect, useState } from 'react';
import indiaSVG from '../assets/in.svg';

export default function IndiaMap({ onStateClick }) {
  const svgContainerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [svgContent, setSvgContent] = useState('');

  useEffect(() => {
    fetch(indiaSVG)
      .then(res => res.text())
      .then(data => setSvgContent(data))
      .catch(err => console.error('Failed to load India SVG:', err));
  }, []);

  useEffect(() => {
    const container = svgContainerRef.current;
    const tooltip = tooltipRef.current;
    if (!container || !tooltip) return;

    const handleMouseOver = (e) => {
      const target = e.target;
      if (target.tagName === 'path' && target.id) {
        const name = target.getAttribute('name') || target.id.replace(/_/g, ' ');
        tooltip.textContent = name.toUpperCase();
        tooltip.style.opacity = '1';
      }
    };

    const handleMouseMove = (e) => {
      tooltip.style.left = e.pageX + 12 + 'px';
      tooltip.style.top = e.pageY - 24 + 'px';
    };

    const handleMouseOut = (e) => {
      if (e.target.tagName === 'path') {
        tooltip.style.opacity = '0';
      }
    };

    container.addEventListener('mouseover', handleMouseOver);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseout', handleMouseOut);

    return () => {
      container.removeEventListener('mouseover', handleMouseOver);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseout', handleMouseOut);
    };
  }, [svgContent]);

  const handleClick = (event) => {
    const id = event.target.id;
    if (onStateClick && id) onStateClick(id);
  };

  return (
    <div className="map-wrapper">
      <div
        ref={svgContainerRef}
        className="india-map-container"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />

      <div ref={tooltipRef} className="state-tooltip" />

      <style>{`
        .map-wrapper {
          perspective: 1200px;
          text-align: center;
          padding: 2rem;
          background: radial-gradient(circle at top left, #fffbe6, #ffe0b2);
          border-radius: 18px;
          box-shadow: 0 12px 30px rgba(0,0,0,0.2);
          max-width: 900px;
          margin: 2rem auto;
          transform-style: preserve-3d;
          overflow: visible;
          position: relative;
        }

        .india-map-container {
          display: inline-block;
          transform: rotateX(8deg) rotateY(-5deg) translateZ(90px) scale(0.95);
          transform-origin: center center;
          transition: transform 0.6s ease, filter 0.4s ease;
          overflow: visible;
        }

        .india-map-container:hover {
          transform: rotateX(0deg) rotateY(0deg) scale(1.06);
          filter: brightness(1.08);
        }

        .india-map-container svg {
          width: 100%;
          height: auto;
          cursor: pointer;
          overflow: visible;
        }

        .india-map-container path {
          fill: #ff7a00;
          stroke: #3b2b19;
          stroke-width: 0.7;
          filter: drop-shadow(0 2px 2px rgba(0,0,0,0.4))
                  drop-shadow(0 6px 10px rgba(0,0,0,0.25));
          transition: all 0.25s ease;
        }

        .india-map-container path:hover {
          fill: #ffa447;
          transform: translateZ(8px);
          filter: drop-shadow(0 10px 8px rgba(0,0,0,0.35)) brightness(1.1);
        }

        .state-tooltip {
          position: absolute;
          pointer-events: none;
          background: rgba(0,0,0,0.75);
          color: #fff;
          padding: 6px 10px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 500;
          opacity: 0;
          transition: opacity 0.15s ease;
          transform: translate(-50%, -50%);
          z-index: 9999;
        }
      `}</style>
    </div>
  );
}
