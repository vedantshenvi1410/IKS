import React, { useEffect, useRef, useState } from "react";
import indiaSVG from "../assets/in.svg";
import "./StateView.css";

export default function StateView({ stateKey, svgId, temples = [], onBack }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [selectedTemple, setSelectedTemple] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(indiaSVG);
        const text = await res.text();
        if (!cancelled) setSvgContent(text);
      } catch (err) {
        console.error("Failed to load SVG:", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!svgContent) return;
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = svgContent;

    requestAnimationFrame(() => {
      const svg = container.querySelector("svg");
      if (!svg) return;

      // Reset ViewBox Logic
      let origViewBox = { minX: 0, minY: 0, width: 1000, height: 1000 };
      const vb = svg.getAttribute("viewBox");
      if (vb) {
        const parts = vb.split(/\s+|,/).map(Number);
        origViewBox = { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
      }

      const statePath = svg.getElementById(svgId);
      if (statePath) {
        const bbox = statePath.getBBox();
        const pad = bbox.width * 0.15; // Tighter zoom for HUD feel
        
        svg.setAttribute("viewBox", 
          `${bbox.x - pad} ${bbox.y - pad} ${bbox.width + pad*2} ${bbox.height + pad*2}`
        );

        // Styling the focused state
        const allPaths = svg.querySelectorAll("path");
        allPaths.forEach(p => {
          if (p === statePath) {
            p.style.opacity = "1";
            p.style.fill = "#111827"; // Dark slate
            p.style.stroke = "#22D3EE"; // Electric Cyan
            p.style.strokeWidth = "2px";
            p.style.filter = "drop-shadow(0 0 10px rgba(34, 211, 238, 0.4))";
          } else {
            p.style.opacity = "0.1"; // Fade out others heavily
            p.style.fill = "#000";
          }
        });
      }
    });
  }, [svgContent, svgId]);

  return (
    <div className="state-view">
      <div className="state-header">
        <button className="back-btn" onClick={onBack}>
          <span className="icon">‹</span> SYSTEM_RETURN
        </button>
        <h2 className="state-title">{stateKey.replaceAll("_", " ")}</h2>
        <div className="decor-line"></div>
      </div>

      <div className="content-grid">
        <div className="state-svg-wrap">
          <div ref={containerRef} className="india-map" />
        </div>

        <div className="temple-list-panel">
          <h3 className="panel-label">DETECTED NODES [{temples.length}]</h3>
          <ul>
            {temples.map((t, i) => (
              <li key={i}>
                <button className="list-item-btn" onClick={() => setSelectedTemple(t)}>
                  <span className="code-index">0{i+1}</span>
                  <span className="name">{t.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {selectedTemple && (
        <div className="modal-overlay" onClick={() => setSelectedTemple(null)}>
          <div className="modal-cyber" onClick={e => e.stopPropagation()}>
            <div className="scanline"></div>
            <button className="close-btn" onClick={() => setSelectedTemple(null)}>ABORT</button>
            
            <div className="modal-grid">
              {selectedTemple.image_url && (
                <div className="modal-img-container">
                  <img src={selectedTemple.image_url} alt={selectedTemple.name} />
                  <div className="img-overlay"></div>
                </div>
              )}
              <div className="modal-info">
                <h2 className="glitch-text">{selectedTemple.name}</h2>
                <div className="meta-row">
                  <span className="meta-tag">LOC: {selectedTemple.location}</span>
                  <span className="meta-tag">DEITY: {selectedTemple.deity}</span>
                </div>
                <p className="desc">{selectedTemple.info}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Dynamic SVG Container */
        .state-svg-wrap { 
          position: relative; 
          width: 100%; 
          height: 500px;
          background: radial-gradient(circle at center, #111827 0%, #0B0F14 100%);
          border: 1px solid #1F2933;
          border-radius: 8px;
          overflow: hidden;
        }
        .india-map svg { width: 100%; height: 100%; }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.85);
          backdrop-filter: blur(5px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10000;
        }
        .modal-cyber {
          background: #0f131a;
          border: 1px solid #333;
          border-left: 2px solid var(--accent);
          width: 800px;
          max-width: 90%;
          padding: 30px;
          position: relative;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          overflow: hidden;
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: rgba(34, 211, 238, 0.3);
          animation: scan 3s linear infinite;
          pointer-events: none;
        }
        @keyframes scan { 0% {top:0} 100% {top:100%} }

        .modal-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; }
        .modal-img-container { position: relative; overflow: hidden; border-radius: 4px; }
        .modal-img-container img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(80%) contrast(1.2); }
        .modal-info h2 { font-family: var(--font-head); font-size: 28px; margin: 0 0 16px; color: #fff; text-transform: uppercase; }
        .meta-row { display: flex; gap: 12px; margin-bottom: 20px; }
        .meta-tag { background: rgba(34, 211, 238, 0.1); color: var(--secondary); font-family: var(--font-mono); font-size: 11px; padding: 4px 8px; border: 1px solid rgba(34, 211, 238, 0.2); }
        .desc { line-height: 1.6; color: #aaa; }
        
        .close-btn { 
          position: absolute; top: 16px; right: 16px; 
          background: transparent; border: 1px solid #333; 
          color: #666; font-family: var(--font-mono); font-size: 10px;
          padding: 4px 8px;
        }
        .close-btn:hover { color: var(--accent); border-color: var(--accent); }

        @media (max-width: 700px) {
          .modal-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}