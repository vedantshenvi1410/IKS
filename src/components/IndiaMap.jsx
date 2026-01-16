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
        tooltip.innerHTML = `
          <span class="label">SECURE_NODE</span>
          <span class="value">${name.toUpperCase()}</span>
        `;
        tooltip.style.opacity = '1';
        
        // Add HUD crosshair effect class
        target.classList.add('hud-active');
      }
    };

    const handleMouseMove = (e) => {
      // Offset slightly for HUD feel
      tooltip.style.left = e.pageX + 20 + 'px';
      tooltip.style.top = e.pageY - 20 + 'px';
    };

    const handleMouseOut = (e) => {
      if (e.target.tagName === 'path') {
        tooltip.style.opacity = '0';
        e.target.classList.remove('hud-active');
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
      <div className="grid-overlay"></div>
      <div
        ref={svgContainerRef}
        className="india-map-container"
        onClick={handleClick}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      <div ref={tooltipRef} className="hud-tooltip" />

      <style>{`
        .map-wrapper {
          position: relative;
          width: min(1000px, 95vw);
          aspect-ratio: 1/1;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Sci-Fi Grid Background */
        .grid-overlay {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(rgba(34, 211, 238, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 211, 238, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          border-radius: 50%;
          mask-image: radial-gradient(circle, black 40%, transparent 70%);
          pointer-events: none;
          z-index: 0;
        }

        .india-map-container svg {
          width: 100%;
          height: auto;
          filter: drop-shadow(0 0 20px rgba(34, 211, 238, 0.1));
          z-index: 1;
          overflow: visible;
        }

        .india-map-container path {
          fill: #1F2933;         /* Dark Tech Base */
          stroke: #374151;       /* Subtle Stroke */
          stroke-width: 0.5;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          cursor: crosshair;     /* Tech cursor */
          vector-effect: non-scaling-stroke;
        }

        .india-map-container path:hover, 
        .india-map-container path.hud-active {
          fill: #111827;
          stroke: #FF9F1C;       /* Neon Saffron Stroke */
          stroke-width: 1.5;
          filter: drop-shadow(0 0 8px rgba(255, 159, 28, 0.6));
          z-index: 10;
        }

        /* HUD Tooltip Styling */
        .hud-tooltip {
          position: absolute;
          pointer-events: none;
          background: rgba(11, 15, 20, 0.9);
          border: 1px solid var(--secondary);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.2);
          padding: 8px 12px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          z-index: 9999;
          backdrop-filter: blur(4px);
          transition: opacity 0.1s;
        }

        .hud-tooltip .label {
          font-family: var(--font-mono);
          font-size: 9px;
          color: var(--secondary);
          opacity: 0.8;
        }

        .hud-tooltip .value {
          font-family: var(--font-head);
          font-size: 14px;
          color: #fff;
          font-weight: 600;
          letter-spacing: 0.5px;
        }

        /* Corner accents for the tooltip */
        .hud-tooltip::after {
          content: '';
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 6px;
          height: 6px;
          background: var(--secondary);
          box-shadow: 0 0 5px var(--secondary);
        }
      `}</style>
    </div>
  );
}