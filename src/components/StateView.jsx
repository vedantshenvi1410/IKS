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
        
        // 2. Handle ViewBox Logic
        // We want to zoom into the specific state
        const statePath = svg.getElementById(stateId);
        if (statePath) {
          const bbox = statePath.getBBox();
          // Add 15% padding
          const padX = bbox.width * 0.15;
          const padY = bbox.height * 0.15;
          const viewBoxStr = `${bbox.x - padX} ${bbox.y - padY} ${bbox.width + padX*2} ${bbox.height + padY*2}`;
          
          // Animate transition (CSS handled in global)
          svg.style.transition = 'viewBox 1s ease';
          svg.setAttribute("viewBox", viewBoxStr);
          
          // Dim other states
          svg.querySelectorAll("path").forEach(p => {
            if (p.id !== stateId) {
              p.style.fill = "#eee";
              p.style.opacity = "0.3";
              p.style.pointerEvents = "none";
            } else {
              p.style.fill = "#fff"; // Highlight selected
              p.style.stroke = "#d35400";
              p.style.strokeWidth = "0.5";
              p.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.1))";
            }
          });
        }

        // 3. Render Markers (The "Real" Location Fix)
        // We grab the ORIGINAL viewBox to calculate absolute coordinates from normalized JSON
        const vbAttr = svg.getAttribute("viewBox") || "0 0 1000 1000";
        const [vx, vy, vw,vh] = vbAttr.split(" ").map(Number);
        
        // Since we changed the viewBox above, we need the ORIGINAL dimensions for mapping 0..1 coordinates
        // Assuming standard India SVG is roughly 0 0 612 695 or similar. 
        // We'll use the initial attributes usually found on the SVG or assume standard bounds.
        // NOTE: For best results, normalized_x/y in JSON should match the SVG's coordinate system.
        // Here we map 0-1 to the full original width/height.
        
        const originalWidth = svg.getAttribute('width') ? parseFloat(svg.getAttribute('width')) : 612; // Fallback
        const originalHeight = svg.getAttribute('height') ? parseFloat(svg.getAttribute('height')) : 695; // Fallback

        // Create a group for markers
        const markerGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
        
        temples.forEach((t) => {
          // Calculate SVG Position
          // Note: If your JSON coords are 0-1, we multiply by original dimensions
          // If the JSON coords are "globally accurate", this puts the pin on the map.
          const x = (t.normalized_x || 0.5) * 1000; // Assuming 1000x1000 coordinate space normalization in JSON
          const y = (t.normalized_y || 0.5) * 1000; 

          // Create Pin Group
          const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
          g.setAttribute("class", "pin-marker");
          g.setAttribute("transform", `translate(${x}, ${y})`);
          g.style.cursor = "pointer";
          
          // Add Click Listener
          g.onclick = (e) => {
            e.stopPropagation();
            setSelectedTemple(t);
          };

          // Pin Icon (Path) - An upside down tear drop
          const pinPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
          // A nice pin shape path centered at 0,0 (bottom tip)
          pinPath.setAttribute("d", "M0,0 C-5,-10 -10,-15 -10,-22 C-10,-28 -5,-32 0,-32 C5,-32 10,-28 10,-22 C10,-15 5,-10 0,0");
          pinPath.setAttribute("class", "pin-body");

          // Inner Dot
          const dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
          dot.setAttribute("cx", "0");
          dot.setAttribute("cy", "-22");
          dot.setAttribute("r", "3");
          dot.setAttribute("class", "pin-dot");

          // Animation Delay
          g.style.opacity = "0";
          g.style.animation = "slideUp 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards";
          g.style.animationDelay = "0.5s"; // Wait for zoom to start

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
          &larr; Back to India
        </button>
      </div>

      <div className="interactive-area" ref={containerRef}>
        {/* SVG injected here */}
      </div>

      {/* Temple Details Modal */}
      {selectedTemple && (
        <div className="modal-overlay" onClick={() => setSelectedTemple(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedTemple(null)}>×</button>
            <h3 className="modal-title">{selectedTemple.name}</h3>
            <p><strong>Deity:</strong> {selectedTemple.deity}</p>
            <p><strong>Location:</strong> {selectedTemple.location}</p>
            {selectedTemple.image_url && (
              <img 
                src={selectedTemple.image_url} 
                alt={selectedTemple.name} 
                className="modal-img"
              />
            )}
            <p style={{ lineHeight: '1.6', color: '#555' }}>{selectedTemple.info}</p>
          </div>
        </div>
      )}
    </div>
  );
}