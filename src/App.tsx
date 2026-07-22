import { useState } from 'react';
import Scene3D from './components/Scene3D';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';
import InfoOverlay from './components/InfoOverlay';
import type { Mountain } from './data/shanhaijing';

function App() {
  const [selectedMountain, setSelectedMountain] = useState<Mountain | null>(null);
  const [filterRegion, setFilterRegion] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0a0a14]">
      {/* 3D Scene */}
      <Scene3D
        selectedMountain={selectedMountain}
        onSelectMountain={setSelectedMountain}
        hoveredRegion={hoveredRegion}
        filterRegion={filterRegion}
        searchTerm={searchTerm}
      />

      {/* Vignette overlay */}
      <div className="absolute inset-0 pointer-events-none z-10" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,20,0.6) 100%)',
      }} />

      {/* Sidebar */}
      <Sidebar
        selectedMountain={selectedMountain}
        onSelectMountain={setSelectedMountain}
        filterRegion={filterRegion}
        setFilterRegion={setFilterRegion}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setHoveredRegion={setHoveredRegion}
      />

      {/* Detail Panel */}
      <DetailPanel mountain={selectedMountain} onClose={() => setSelectedMountain(null)} />

      {/* Info Overlay */}
      <InfoOverlay />

      {/* Title overlay (when no sidebar visible space) */}
      <div className="absolute top-4 right-4 z-10 pointer-events-none">
        <div className="text-right">
          <div className="text-amber-500/30 text-xs tracking-[0.3em]">ANCIENT CHINESE MYTHOLOGY</div>
        </div>
      </div>
    </div>
  );
}

export default App;
