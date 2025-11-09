import React, { useEffect, useState } from "react";
import indiaSVG from "../assets/in.svg";
import './StateView.css';

export default function StateView({ stateId, temples = [], onBack }) {
  const [statePath, setStatePath] = useState(null);
  const [selectedTemple, setSelectedTemple] = useState(null);

  useEffect(() => {
    async function loadStatePath() {
      try {
        const res = await fetch(indiaSVG);
        const data = await res.text();
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(data, "image/svg+xml");
        const pathEl = svgDoc.getElementById(stateId);
        if (!pathEl) {
          console.warn(`⚠️ No path found for state: ${stateId}`);
          setStatePath(null);
          return;
        }

        const d = pathEl.getAttribute("d");
        const inner = d
          ? <path d={d} fill="#f7eee2" stroke="#cfa06a" strokeWidth="3" />
          : <g dangerouslySetInnerHTML={{ __html: pathEl.innerHTML }} />;

        setStatePath(inner);
      } catch (err) {
        console.error("Failed to load SVG:", err);
      }
    }

    loadStatePath();
  }, [stateId]);

  return (
    <div className="state-view">
      <button className="back-btn" onClick={onBack}>← Back to India</button>

      <h2 className="state-title">{stateId.replaceAll("_", " ").toUpperCase()}</h2>

      <div className="state-svg-wrap">
        <svg viewBox="0 0 1000 1000" className="state-svg">
          <g className="state-shape">{statePath}</g>

          {temples.map((t, idx) => {
            const cx = (t.normalized_x || 0.5) * 1000;
            const cy = (t.normalized_y || 0.5) * 1000;
            return (
              <g
                key={idx}
                className="marker"
                transform={`translate(${cx}, ${cy})`}
                onClick={() => setSelectedTemple(t)}
              >
                <circle r="10" />
                <text y="-16" textAnchor="middle" className="marker-label">
                  {t.name.split(" ")[0]}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      <div className="temple-list">
        <h3>Temples in {stateId.replaceAll("_", " ")}</h3>
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

      {/* Popup modal for temple info */}
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
    </div>
  );
}
