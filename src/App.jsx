// src/App.jsx
import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import StateView from './components/StateView';
import templesData from './data/temples.json';
import './index.css'; // Single CSS file

// Mappings for SVG IDs to JSON keys
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
    // Some SVGs might return undefined id or parent id, handle safely
    if (!svgId) return;
    const normalizedId = stateIdMap[svgId.toUpperCase()] || svgId.toLowerCase();
    
    if (templesData[normalizedId]) {
      setSelectedState(normalizedId);
    } else {
      console.warn(`No data for ${normalizedId}`);
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
    </div>
  );
}