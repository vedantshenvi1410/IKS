import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import StateView from './components/StateView';
import templesData from './data/temples.json';

// Map SVG IDs to JSON keys
const stateIdMap = {
  INKA: 'karnataka',
  INTN: 'manipur',
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
  const [selectedState, setSelectedState] = useState(null); // stores normalized ID (e.g., 'karnataka')
  const [selectedSvgId, setSelectedSvgId] = useState(null); // stores SVG ID (e.g., 'INKA')

  const handleStateClick = (svgId) => {
    const normalizedId = stateIdMap[svgId.toUpperCase()];
    console.log('SVG clicked:', svgId, 'Mapped ID:', normalizedId);
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

  const handleSelectTemple = (temple) => {
    alert(`Selected: ${temple.name} — ${temple.location}`);
  };

  return (
    <div className="app-root">
      <header className="topbar">
         {/* <h1>Interactive Map of Ancient Indian Temples</h1>
        <p className="subtitle">Explore India’s sacred heritage by state</p> */}
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
            onSelectTemple={handleSelectTemple}
          />
        )}
      </main>

      <footer className="footer">
        © {new Date().getFullYear()} Indian Knowledge Systems — Heritage Map
      </footer>
    </div>
  );
}