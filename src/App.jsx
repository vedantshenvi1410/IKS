import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import StateView from './components/StateView';
import templesData from './data/temples.json';

// Map SVG IDs to JSON keys
const stateIdMap = {
  INKA: 'karnataka',
  INTN: 'manipur', // Note: Check your mapping, INTN is usually Tamil Nadu, but using your provided map
  INAP: 'andhra_pradesh',
  INAR: 'arunachal_pradesh',
  INAS: 'assam',
  INBI: 'bihar',
  INCH: 'chhattisgarh',
  INGO: 'goa',
  INGJ: 'gujarat',
  INHR: 'haryana',
  INHP: 'himachal_pradesh',
  INJH: 'jharkhand',
  INKL: 'kerala',
  INMP: 'madhya_pradesh',
  INMH: 'maharashtra',
  INML: 'meghalaya',
  INMZ: 'mizoram',
  INNL: 'nagaland',
  INOD: 'odisha',
  INPB: 'punjab',
  INRJ: 'rajasthan',
  INS: 'sikkim',
  INTNADU: 'tamil_nadu',
  INTG: 'telangana',
  INTR: 'tripura',
  INUP: 'uttar_pradesh',
  INUK: 'uttarakhand',
  INWB: 'west_bengal',
  INAN: 'andaman_and_nicobar_islands',
  INCHD: 'chandigarh',
  INDND: 'dadra_and_nagar_haveli_and_daman_and_diu',
  INDL: 'delhi',
  INJK: 'jammu_and_kashmir',
  INLAD: 'ladakh',
  INLAK: 'lakshadweep',
  INPY: 'puducherry'
};

export default function App() {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedSvgId, setSelectedSvgId] = useState(null);
  const [showInfo, setShowInfo] = useState(false);

  const handleStateClick = (svgId) => {
    // Handle special cases or standard mapping
    const key = svgId.toUpperCase();
    // Fallback logic if needed, or direct map
    const normalizedId = stateIdMap[key];
    
    if (normalizedId && templesData[normalizedId]) {
      setSelectedState(normalizedId);
      setSelectedSvgId(svgId);
    } else {
      console.warn(`No temple data found for: ${svgId}`);
    }
  };

  const handleBack = () => {
    setSelectedState(null);
    setSelectedSvgId(null);
  };

  return (
    <div className="app-root">
      <header className="topbar">
        <div className="brand-block">
          <h1>IKS_ARCHIVE</h1>
          <p className="subtitle">HERITAGE_MAPPING_SYSTEM_V1</p>
        </div>
        <button className="info-btn" onClick={() => setShowInfo(true)}>
          <span className="icon">ℹ</span> SYSTEM_INFO
        </button>
      </header>

      <main className="main-area">
        {!selectedState ? (
          <IndiaMap onStateClick={handleStateClick} />
        ) : (
          <StateView
            stateKey={selectedState}
            svgId={selectedSvgId}
            temples={templesData[selectedState] || []}
            onBack={handleBack}
          />
        )}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} INDIAN KNOWLEDGE SYSTEMS — SECURE NODE
      </footer>

      {/* Info Modal */}
      {showInfo && (
        <div className="modal-overlay" onClick={() => setShowInfo(false)}>
          <div className="modal-cyber info-modal" onClick={e => e.stopPropagation()}>
            <div className="scanline"></div>
            <div className="modal-header">
              <h2>SYSTEM PROTOCOL</h2>
              <button className="close-btn" onClick={() => setShowInfo(false)}>✕</button>
            </div>
            <div className="modal-content">
              <p><strong>MISSION:</strong> Digital preservation of ancient Indian heritage sites through interactive vector mapping.</p>
              <p><strong>USAGE:</strong> Select a secure node (State) from the map to access classified temple data.</p>
              <p className="status-line">STATUS: <span style={{color: 'var(--secondary)'}}>ONLINE</span></p>
            </div>
          </div>
        </div>
      )}

      <style>{`
        /* Topbar Button Styling */
        .info-btn {
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid var(--secondary);
          color: var(--secondary);
          font-family: var(--font-mono);
          font-size: 11px;
          padding: 8px 16px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 8px;
          transition: all 0.2s;
          letter-spacing: 1px;
        }
        .info-btn:hover {
          background: var(--secondary);
          color: #000;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.4);
        }
        
        /* Modal Reuse Styles (Local override for App level) */
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
          padding: 30px;
          position: relative;
          box-shadow: 0 0 40px rgba(0,0,0,0.8);
          overflow: hidden;
          max-width: 500px;
          width: 90%;
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          border-bottom: 1px solid #333;
          padding-bottom: 10px;
        }
        .modal-header h2 {
          font-family: var(--font-head);
          color: #fff;
          margin: 0;
          font-size: 20px;
        }
        .modal-content p {
          color: var(--text-muted);
          line-height: 1.6;
          font-size: 14px;
          margin-bottom: 12px;
        }
        .status-line {
          font-family: var(--font-mono);
          border-top: 1px dashed #333;
          padding-top: 12px;
          margin-top: 20px;
        }
        .scanline {
          position: absolute;
          top: 0; left: 0; right: 0; height: 2px;
          background: rgba(34, 211, 238, 0.3);
          animation: scan 3s linear infinite;
          pointer-events: none;
        }
        @keyframes scan { 0% {top:0} 100% {top:100%} }
        
        .close-btn {
          background: transparent;
          border: none;
          color: #666;
          cursor: pointer;
          font-size: 16px;
        }
        .close-btn:hover { color: var(--accent); }
      `}</style>
    </div>
  );
}