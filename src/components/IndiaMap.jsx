// src/components/IndiaMap.jsx
import React, { useRef, useEffect, useState } from 'react';
import indiaSVG from '../assets/in.svg';

export default function IndiaMap({ onStateClick }) {
  const [svgContent, setSvgContent] = useState(null);
  const containerRef = useRef(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // 1. Fetch SVG
  useEffect(() => {
    fetch(indiaSVG)
      .then(res => res.text())
      .then(text => {
        // Simple check to see if it's a valid SVG
        if (text.trim().startsWith('<svg')) {
          setSvgContent(text);
        } else {
          console.error("Invalid SVG file. Please ensure src/assets/in.svg is a valid SVG.");
          setSvgContent("<svg><text x='50%' y='50%'>Error: SVG Missing</text></svg>");
        }
      })
      .catch(err => console.error("SVG Load Error", err));
  }, []);

  // 2. Setup Animation & Interaction
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Responsive attributes
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // --- ANIMATION LOGIC ---
    // 1. Get all path elements
    const paths = Array.from(svg.querySelectorAll('path'));
    
    // 2. Calculate "Latitude" (Y center) for sorting
    const pathsWithY = paths.map(path => {
      try {
        const bbox = path.getBBox();
        return { el: path, y: bbox.y + bbox.height / 2 };
      } catch (e) {
        return { el: path, y: 0 };
      }
    });

    // 3. Sort from North (min Y) to South (max Y)
    pathsWithY.sort((a, b) => a.y - b.y);

    // 4. Apply Animation Stagger
    pathsWithY.forEach((item, index) => {
      item.el.classList.add('state-path');
      // Wave effect: states pop in sequence
      item.el.style.animation = `popInWave 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
      item.el.style.animationDelay = `${index * 0.02}s`; // 20ms delay per state
    });

  }, [svgContent]);

  // 3. Mouse Handlers
  const handleMouseEvent = (e) => {
    const target = e.target;
    // Only interact with paths that have an ID (states)
    if (target.tagName === 'path' && target.id) {
      if (e.type === 'click') {
        onStateClick(target.id);
      } else if (e.type === 'mouseover') {
        const name = target.getAttribute('name') || target.id;
        setHoveredState(name.replace(/_/g, ' '));
      } else if (e.type === 'mousemove') {
        setTooltipPos({ x: e.clientX, y: e.clientY });
      } else if (e.type === 'mouseout') {
        setHoveredState(null);
      }
    } else {
      // Clear tooltip if we moved off a path
      if (e.type === 'mouseout') setHoveredState(null);
    }
  };

  if (!svgContent) return <div style={{padding: '2rem'}}>Loading Map...</div>;

  return (
    <>
      <div 
        ref={containerRef}
        className="india-map-svg-wrapper"
        onClick={handleMouseEvent}
        onMouseOver={handleMouseEvent}
        onMouseMove={handleMouseEvent}
        onMouseOut={handleMouseEvent}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      
      {hoveredState && (
        <div 
          className="tooltip" 
          style={{ left: tooltipPos.x, top: tooltipPos.y }}
        >
          {hoveredState.toUpperCase()}
        </div>
      )}
    </>
  );
}