import React, { useEffect, useState } from "react";
import indiaSVG from "../assets/in.svg";
import './StateView.css';


export default function StateView({ stateId, temples = [], onBack, onSelectTemple }) {
  const [statePath, setStatePath] = useState(null);

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

        // Extract d attribute for <path> or <g> inner markup
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

          {/* Temple markers */}
          {temples.map((t, idx) => {
            const cx = (t.normalized_x || 0.5) * 1000;
            const cy = (t.normalized_y || 0.5) * 1000;
            return (
              <g
                key={idx}
                className="marker"
                transform={`translate(${cx}, ${cy})`}
                onClick={() => onSelectTemple(t)}
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
                <button onClick={() => onSelectTemple(t)}>
                  {t.name} — {t.location}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-temples">No temple data available for this state.</p>
        )}
      </div>

      <style>{`
        .state-view {
          padding: 1rem;
          text-align: center;
        }

        .state-title {
          margin: 0.5rem 0 1rem;
          color: #5a3e1e;
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: capitalize;
        }

        .back-btn {
          background: none;
          border: 1px solid #cfa06a;
          padding: 0.4rem 1rem;
          cursor: pointer;
          border-radius: 6px;
          transition: 0.2s;
        }

        .back-btn:hover {
          background: #f6e7d4;
        }

        .state-svg-wrap {
          width: 100%;
          max-width: 700px;
          margin: 1rem auto;
          background: #fffaf3;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.08);
          overflow: hidden;
        }

        .state-svg {
          width: 100%;
          height: auto;
        }

        .state-shape path,
        .state-shape g path {
          fill: #f7eee2;
          stroke: #cfa06a;
          stroke-width: 3;
        }

        .marker circle {
          fill: #d63384;
          stroke: #fff;
          stroke-width: 2;
          cursor: pointer;
          transition: transform 0.2s ease, fill 0.2s;
        }

        .marker:hover circle {
          transform: scale(1.3);
          fill: #b62b72;
        }

        .marker-label {
          font-size: 0.75rem;
          font-weight: 600;
          fill: #222;
          pointer-events: none;
        }

        .temple-list {
          margin-top: 1.5rem;
          text-align: left;
          max-width: 600px;
          margin-inline: auto;
        }

        .temple-list ul {
          list-style: none;
          padding: 0;
        }

        .temple-list li {
          margin-bottom: 0.4rem;
        }

        .temple-list button {
          background: none;
          border: none;
          cursor: pointer;
          color: #00695c;
          font-size: 1rem;
          transition: 0.2s;
        }

        .temple-list button:hover {
          color: #004d40;
          text-decoration: underline;
        }

        .no-temples {
          color: #666;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
