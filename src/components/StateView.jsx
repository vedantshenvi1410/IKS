// src/components/StateView.jsx
import React, { useEffect, useRef, useState } from "react";
import indiaSVG from "../assets/in.svg";

export default function StateView({ stateId, temples = [], onBack }) {
  const containerRef = useRef(null);
  const [selectedTemple, setSelectedTemple] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function initMap() {
      try {
        const res = await fetch(indiaSVG);
        const text = await res.text();
        if (cancelled || !containerRef.current) return;

        // 1. Inject SVG
        containerRef.current.innerHTML = text;
        const svg = containerRef.current.querySelector("svg");
        
        if(!svg) return;

        // 2. Focus on Selected State (Zoom Logic)
        const statePath = svg.getElementById(stateId);
        if (statePath) {
          const bbox = statePath.getBBox();
          // Add padding around the state (20%)
          const padX = bbox.width * 0.2;
          const padY = bbox.height * 0.2;
          const viewBoxStr = `${bbox.x - padX} ${bbox.y - padY} ${bbox.width + padX * 2} ${bbox.height + padY * 2}`;
          
          svg.style.transition = 'viewBox 1s ease'; // Smooth zoom
          svg.setAttribute("viewBox", viewBoxStr);
          
          // Style: Dim other states, Highlight current
          svg.querySelectorAll("path").forEach(p => {
            if (p.id !== stateId) {
              p.style.fill = "#f0f0f0";
              p.style.stroke = "#ddd";
              p.style.opacity = "0.4";
              p.style.pointerEvents = "none";
            } else {
              p.style.fill = "#fff"; 
              p.style.stroke = "#d35400";
              p.style.strokeWidth = "0.5";
              p.style.filter = "drop-shadow(0 10px 15px rgba(211, 84, 0, 0.2))";
            }
          });
        }

        // 3. Render "Real Feel" Pins
        // We calculate position based on the SVG's 1000x1000 coordinate space
        // This locks the pin to the geography, preventing drift.
        
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        temples.forEach((t, index) => {
          // Fallback coords if missing
          const x = (t.normalized_x !== undefined ? t.normalized_x : 0.5) * 1000;
          const y = (t.normalized_y !== undefined ? t.normalized_y : 0.5) * 1000;

          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          g.setAttribute("class", "pin-marker");
          g.setAttribute("transform", `translate(${x}, ${y})`);
          
          // Click Handler
          g.onclick = (e) => {
            e.stopPropagation();
            setSelectedTemple(t);
          };

          // --- Pin Shape (SVG Path) ---
          // An elegant map pin shape, anchored at (0,0) at the bottom tip
          const pinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          pinPath.setAttribute("d", "M0,0 C-6,-12 -12,-18 -12,-26 C-12,-34 -6,-38 0,-38 C6,-38 12,-34 12,-26 C12,-18 6,-12 0,0");
          pinPath.setAttribute("class", "pin-body");

          // --- Inner White Dot ---
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", "0");
          dot.setAttribute("cy", "-26");
          dot.setAttribute("r", "3.5");
          dot.setAttribute("class", "pin-dot");

          // --- Drop Animation ---
          // Pins drop from the sky after the map finishes zooming
          g.style.opacity = "0"; 
          g.style.animation = "pinDrop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
          g.style.animationDelay = `${0.6 + (index * 0.1)}s`; // Staggered drop

          g.appendChild(pinPath);
          g.appendChild(dot);
          markerGroup.appendChild(g);
        });

        svg.appendChild(markerGroup);

      } catch (err) {
        console.error("State View Error:", err);
      }
    }

    initMap();

    return () => { cancelled = true; };
  }, [stateId, temples]);

  return (
    <div className="state-view-container">
      <div className="state-header">
        <h2 className="state-name">{stateId.replace(/_/g, " ")}</h2>
        <button className="back-btn" onClick={onBack}>
          &larr; Return to Map
        </button>
      </div>

      <div className="interactive-area" ref={containerRef}>
        {/* SVG is injected here by the effect */}
      </div>
      
      {/* Helper text if no temples */}
      {temples.length === 0 && (
        <p style={{textAlign: 'center', color: '#888', fontStyle: 'italic'}}>
          No temple data available for this region yet.
        </p>
      )}

      {/* Detail Modal */}
      {selectedTemple && (
        <div className="modal-overlay" onClick={() => setSelectedTemple(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTemple(null)}>&times;</button>
            
            <h3 className="modal-title">{selectedTemple.name}</h3>
            
            <div className="modal-details">
              <strong>Location:</strong> {selectedTemple.location}<br/>
              <strong>Deity:</strong> {selectedTemple.deity}
            </div>

            {selectedTemple.image_url && (
              <img 
                src={selectedTemple.image_url} 
                alt={selectedTemple.name} 
                className="modal-img"
              />
            )}
            
            <p style={{ lineHeight: '1.6', color: '#444' }}>
              {selectedTemple.info}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}