import React, { useEffect, useRef, useState } from "react";
import indiaSVG from "../assets/in.svg";
import "./StateView.css";

export default function StateView({ stateKey, svgId, temples = [], onBack }) {
  const containerRef = useRef(null);
  const [svgContent, setSvgContent] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [selectedTemple, setSelectedTemple] = useState(null);

  // load raw svg text
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

  // After svg html is injected, do DOM operations: find viewBox, state bbox, set viewBox to zoomed area
  useEffect(() => {
    if (!svgContent) return;
    const container = containerRef.current;
    if (!container) return;

    // inject svg content
    container.innerHTML = svgContent;

    // small timeout to ensure DOM parsing of innerHTML is done
    requestAnimationFrame(() => {
      const svg = container.querySelector("svg");
      if (!svg) {
        console.error("No <svg> found in loaded content.");
        return;
      }

      // Read original viewBox 
      let origViewBox = { minX: 0, minY: 0, width: 1000, height: 1000 };
      const vb = svg.getAttribute("viewBox");
      if (vb) {
        const parts = vb.split(/\s+|,/).map(Number);
        if (parts.length === 4 && parts.every(n => !Number.isNaN(n))) {
          origViewBox = { minX: parts[0], minY: parts[1], width: parts[2], height: parts[3] };
        }
      } else {
        const w = parseFloat(svg.getAttribute("width")) || 1000;
        const h = parseFloat(svg.getAttribute("height")) || 1000;
        origViewBox = { minX: 0, minY: 0, width: w, height: h };
        svg.setAttribute("viewBox", `0 0 ${origViewBox.width} ${origViewBox.height}`);
      }

      // Remove any old overlay if it exists (cleanup)
      let overlay = svg.querySelector("#__temple_overlay");
      if (overlay) overlay.remove();

      // attempt to find the path for the selected state using the SVG ID
      const statePath = svg.getElementById(svgId);
      if (!statePath) {
        console.warn(`No path with id="${svgId}" found in SVG.`);
      } else {
        try {
          const bbox = statePath.getBBox();
          const padFactor = 0.1;
          const padX = bbox.width * padFactor;
          const padY = bbox.height * padFactor;

          const newMinX = bbox.x - padX;
          const newMinY = bbox.y - padY;
          const newW = bbox.width + padX * 2;
          const newH = bbox.height + padY * 2;

          const origRatio = origViewBox.width / origViewBox.height;
          let finalW = newW;
          let finalH = newH;
          if (newW / newH > origRatio) {
            finalH = newW / origRatio;
            const extraH = finalH - newH;
            svg.setAttribute("viewBox", `${newMinX} ${newMinY - extraH / 2} ${finalW} ${finalH}`);
          } else {
            finalW = newH * origRatio;
            const extraW = finalW - newW;
            svg.setAttribute("viewBox", `${newMinX - extraW / 2} ${newMinY} ${finalW} ${finalH}`);
          }

          if (!svg.getAttribute("viewBox")) {
            svg.setAttribute("viewBox", `${newMinX} ${newMinY} ${finalW} ${finalH}`);
          }

          svg.classList.add("__state_focused_svg");

          const allPaths = svg.querySelectorAll("path");
          allPaths.forEach(p => {
            if (p === statePath) {
              p.style.opacity = "1";
              p.style.filter = "drop-shadow(0 4px 6px rgba(0,0,0,0.35))";
            } else {
              p.style.opacity = "0.25";
            }
          });
        } catch (err) {
          console.warn("Could not compute bbox for state path:", err);
        }
      }

      setLoaded(true);
    });
  }, [svgContent, svgId]);

  return (
    <div className="state-view">
      <button className="back-btn" onClick={onBack}>← Back to India</button>

      <h2 className="state-title">{stateKey.replaceAll("_", " ").toUpperCase()}</h2>

      <div className="state-svg-wrap" style={{ position: "relative" }}>
        <div
          ref={containerRef}
          className="india-map"
          style={{ width: "100%", maxWidth: 900, margin: "0 auto" }}
        />
      </div>

      <div className="temple-list">
        <h3>Temples in {stateKey.replaceAll("_", " ")}</h3>
        {temples.length > 0 ? (
          <ul>
            {temples.map((t, i) => (
              <li key={i}>
                <button onClick={() => setSelectedTemple(t)}>
                  {t.name} — {t.location}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-temples">No temple data available for this state.</p>
        )}
      </div>

      {selectedTemple && (
        <div className="popup-overlay" onClick={() => setSelectedTemple(null)}>
          <div className="popup-content" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedTemple(null)}>×</button>
            <h2>{selectedTemple.name}</h2>
            <p><strong>Location:</strong> {selectedTemple.location}</p>
            <p><strong>Deity:</strong> {selectedTemple.deity}</p>
            <p>{selectedTemple.info}</p>
            {selectedTemple.image_url && <img className="temple-img" src={selectedTemple.image_url} alt={selectedTemple.name} />}
          </div>
        </div>
      )}

      <style>{`
        .state-svg-wrap { margin-bottom: 1rem; }
        .india-map svg { width: 100%; height: auto; display: block; transition: viewBox 300ms ease; }
        .popup-overlay {
          position: fixed;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.45);
          z-index: 9999;
        }
        .popup-content {
          background: white;
          padding: 1rem 1.25rem;
          border-radius: 10px;
          max-width: 640px;
          width: 90%;
          box-shadow: 0 8px 28px rgba(0,0,0,0.25);
          position: relative;
        }
        .close-btn { position: absolute; right: 8px; top: 8px; background: none; border: none; font-size: 20px; cursor: pointer; }
        .temple-img { max-width: 100%; height: auto; margin-top: 0.75rem; border-radius: 6px; }
      `}</style>
    </div>
  );
}