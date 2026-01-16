// src/App.jsx
import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import StateView from './components/StateView';
import templesData from './data/temples.json';
import './index.css'; 

// Mappings for SVG IDs (from standard India maps) to JSON keys
const stateIdMap = {
  INKA: 'karnataka', INTN: 'manipur', INAP: 'andhra_pradesh', INAR: 'arunachal_pradesh',
  INAS: 'assam', INBI: 'bihar', INCH: 'chhattisgarh', INGO: 'goa', INGJ: 'gujarat',
  INHR: 'haryana', INHP: 'himachal_pradesh', INJH: 'jharkhand', INKL: 'kerala',
  INMP: 'madhya_pradesh', INMH: 'maharashtra', INML: 'meghalaya', INMZ: 'mizoram',
  INNL: 'nagaland', INOD: 'odisha', INPB: 'punjab', INRJ: 'rajasthan', INS: 'sikkim',
  INTNADU: 'tamil_nadu', INTG: 'telangana', INTR: 'tripura', INUP: 'uttar_pradesh',
  INUK: 'uttarakhand', INWB: 'west_bengal', INAN: 'andaman_and_nicobar_islands',
  INCHD: 'chandigarh', INDND: 'dadra_and_nagar_haveli_and_daman_and_diu',
  INDL: 'delhi', INJK: 'jammu_and_kashmir', INLAD: 'ladakh', INLAK: 'lakshadweep',
  INPY: 'puducherry'
};

export default function App() {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (svgId) => {
    if (!svgId) return;
    
    // Normalize ID: Try the map first, otherwise lower case (fallback)
    const normalizedId = stateIdMap[svgId.toUpperCase()] || svgId.toLowerCase();
    
    // Check if we have data (or at least valid mapping)
    if (normalizedId) {
      console.log(`Navigating to state: ${normalizedId}`);
      setSelectedState(normalizedId);
    }
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">IKS Temple Heritage Map</h1>
      </header>

      <main className="app-main">
        {!selectedState ? (
          <div className="map-container">
            <IndiaMap onStateClick={handleStateClick} />
          </div>
        ) : (
          <StateView
            stateId={selectedState}
            temples={templesData[selectedState] || []}
            onBack={() => setSelectedState(null)}
          />
        )}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Indian Knowledge Systems — Heritage Map
      </footer>
    </div>
  );
}