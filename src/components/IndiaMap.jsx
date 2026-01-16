// src/components/IndiaMap.jsx
import React, { useRef, useEffect, useState } from 'react';
import indiaSVG from '../assets/in.svg';

export default function IndiaMap({ onStateClick }) {
  const [svgContent, setSvgContent] = useState(null);
  const containerRef = useRef(null);
  const [hoveredState, setHoveredState] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // 1. Load SVG Text
  useEffect(() => {
    fetch(indiaSVG)
      .then(res => res.text())
      .then(text => setSvgContent(text))
      .catch(err => console.error("SVG Load Error", err));
  }, []);

  // 2. Process SVG after injection for Animation
  useEffect(() => {
    if (!svgContent || !containerRef.current) return;

    const svg = containerRef.current.querySelector('svg');
    if (!svg) return;

    // Make SVG responsive
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');

    // Get all paths
    const paths = Array.from(svg.querySelectorAll('path'));
    
    // Calculate centroids to sort by Latitude (Y)
    const pathsWithY = paths.map(path => {
      const bbox = path.getBBox();
      return { el: path, y: bbox.y + bbox.height / 2 };
    });

    // Sort North to South (low Y to high Y)
    pathsWithY.sort((a, b) => a.y - b.y);

    // Apply animation classes and delays
    pathsWithY.forEach((item, index) => {
      item.el.classList.add('state-path');
      // Stagger delay: 0.02s per item
      item.el.style.animation = `popIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards`;
      item.el.style.animationDelay = `${index * 0.03}s`;
    });

  }, [svgContent]);

  // 3. Event Delegation
  const handleInteraction = (e) => {
    const target = e.target;
    if (target.tagName === 'path') {
      if (e.type === 'click') {
        onStateClick(target.id);
      } else if (e.type === 'mouseover') {
        setHoveredState(target.getAttribute('name') || target.id);
      } else if (e.type === 'mousemove') {
        setMousePos({ x: e.clientX, y: e.clientY });
      } else if (e.type === 'mouseout') {
        setHoveredState(null);
      }
    }
  };

  if (!svgContent) return <div>Loading Map...</div>;

  return (
    <>
      <div 
        ref={containerRef}
        onClick={handleInteraction}
        onMouseOver={handleInteraction}
        onMouseMove={handleInteraction}
        onMouseOut={handleInteraction}
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
      
      {hoveredState && (
        <div 
          className="tooltip" 
          style={{ left: mousePos.x, top: mousePos.y }}
        >
          {hoveredState.replace(/_/g, ' ').toUpperCase()}
        </div>
      )}
    </>
  );
}