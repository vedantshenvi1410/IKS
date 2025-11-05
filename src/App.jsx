import React, { useState } from 'react';
import IndiaMap from './components/IndiaMap';
import StateView from './components/StateView';
import templesData from './data/temples.json';

export default function App() {
  const [selectedState, setSelectedState] = useState(null);

  const handleStateClick = (stateId) => {
    // normalize id just in case (e.g., "tamil_nadu" instead of "Tamil Nadu")
    const normalizedId = stateId.toLowerCase().replace(/\s+/g, '_');
    if (templesData[normalizedId]) {
      setSelectedState(normalizedId);
    } else {
      console.warn(`No temple data found for: ${normalizedId}`);
    }
  };

  const handleBack = () => {
    setSelectedState(null);
  };

  const handleSelectTemple = (temple) => {
    alert(`Selected: ${temple.name} — ${temple.location}`);
    // later, open modal or navigate to temple details
  };
  console.log('Selected state data:', templesData[selectedState]);
  return (
    <div className="app-root">
      <header className="topbar">
        <h1>Interactive Map of Ancient Indian Temples</h1>
        <p className="subtitle">Explore India’s sacred heritage by state</p>
      </header>

      <main className="main-area">
        {!selectedState ? (
          <IndiaMap onStateClick={handleStateClick} />
        ) : (
          <StateView
            stateId={selectedState}
            temples={templesData[selectedState]}
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
