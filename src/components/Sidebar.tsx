import { useState } from 'react';
import { mountains, regions, type Mountain } from '../data/shanhaijing';
import { Search, Compass, ChevronRight } from 'lucide-react';

interface SidebarProps {
  selectedMountain: Mountain | null;
  onSelectMountain: (m: Mountain) => void;
  filterRegion: string | null;
  setFilterRegion: (r: string | null) => void;
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  setHoveredRegion: (r: string | null) => void;
}

export default function Sidebar({
  selectedMountain,
  onSelectMountain,
  filterRegion,
  setFilterRegion,
  searchTerm,
  setSearchTerm,
  setHoveredRegion,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const filteredMountains = mountains.filter(m => {
    if (filterRegion && m.regionCode !== filterRegion) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchName = m.name.toLowerCase().includes(term);
      const matchCreature = m.creatures.some(c => c.name.toLowerCase().includes(term));
      const matchDesc = m.description.toLowerCase().includes(term);
      if (!matchName && !matchCreature && !matchDesc) return false;
    }
    return true;
  });

  if (isCollapsed) {
    return (
      <button
        onClick={() => setIsCollapsed(false)}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#f5eedc]/90 border border-[#8a6c2a]/25 border-l-0 rounded-r-lg p-3 text-[#2d6b4a] hover:text-[#1a4a30] transition-all shadow-lg"
      >
        <ChevronRight size={20} className="rotate-180" />
      </button>
    );
  }

  return (
    <div className="absolute left-0 top-0 h-full w-80 z-20 pointer-events-auto">
      <div className="h-full flex flex-col bg-gradient-to-b from-[#f5eedc]/96 to-[#ede4cc]/96 backdrop-blur-md border-r border-[#8a6c2a]/25 shadow-2xl">
        {/* Title */}
        <div className="p-6 border-b border-[#8a6c2a]/15">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-[#1a3a28] tracking-[0.15em]">山海经</h1>
              <p className="text-xs text-[#8a6c2a]/50 mt-1 tracking-[0.2em] font-sans">SHAN HAI JING · 3D MAP</p>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-[#8a6c2a]/50 hover:text-[#8a6c2a] transition-colors p-1"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-[#8a6c2a]/10">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a6c2a]/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索山名、异兽..."
              className="w-full pl-9 pr-3 py-2 bg-[#ede4cc]/60 border border-[#8a6c2a]/20 rounded-lg text-sm text-[#2a3820] placeholder-[#8a6c2a]/35 focus:outline-none focus:border-[#2d6b4a]/40 transition-colors font-serif"
            />
          </div>
        </div>

        {/* Region filters */}
        <div className="p-4 border-b border-[#8a6c2a]/10">
          <div className="flex items-center gap-2 text-[#2d6b4a]/70 text-xs mb-3">
            <Compass size={13} />
            <span className="tracking-widest">五方山经</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFilterRegion(null)}
              onMouseEnter={() => setHoveredRegion(null)}
              className={`px-2 py-1.5 text-xs rounded-md transition-all font-serif ${
                !filterRegion
                  ? 'bg-[#2d6b4a]/15 text-[#1a3a28] border border-[#2d6b4a]/40'
                  : 'bg-[#ede4cc]/40 text-[#8a6c2a]/60 border border-[#8a6c2a]/15 hover:border-[#8a6c2a]/30'
              }`}
            >
              全部
            </button>
            {regions.map(r => (
              <button
                key={r.code}
                onClick={() => setFilterRegion(filterRegion === r.code ? null : r.code)}
                onMouseEnter={() => setHoveredRegion(r.code)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`px-2 py-1.5 text-xs rounded-md transition-all border font-serif ${
                  filterRegion === r.code ? 'text-white' : 'bg-[#ede4cc]/40 text-[#8a6c2a]/60 border-[#8a6c2a]/15 hover:border-[#8a6c2a]/30'
                }`}
                style={filterRegion === r.code ? {
                  background: `${r.color}30`,
                  borderColor: `${r.color}80`,
                  color: r.color,
                } : {}}
              >
                {r.name}
              </button>
            ))}
          </div>
        </div>

        {/* Mountain list */}
        <div className="flex-1 overflow-y-auto p-2">
          {filteredMountains.length === 0 ? (
            <div className="text-center text-[#8a6c2a]/30 text-sm py-8 font-serif">无搜索结果</div>
          ) : (
            <div className="space-y-1">
              {filteredMountains.map(m => {
                const region = regions.find(r => r.code === m.regionCode);
                const isSelected = selectedMountain?.id === m.id;
                return (
                  <button
                    key={m.id}
                    onClick={() => onSelectMountain(m)}
                    className={`w-full text-left px-3 py-2.5 rounded-lg transition-all group ${
                      isSelected
                        ? 'bg-[#2d6b4a]/12 border border-[#2d6b4a]/30'
                        : 'hover:bg-[#2d6b4a]/8 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: region?.color }}
                        />
                        <span className={`text-sm font-serif tracking-wide ${isSelected ? 'text-[#1a3a28]' : 'text-[#2a3820]/75'}`}>
                          {m.name}
                        </span>
                      </div>
                      {m.creatures.length > 0 && (
                        <span className="text-xs text-[#8a6c2a]/45 font-sans">
                          {m.creatures.length} 异物
                        </span>
                      )}
                    </div>
                    {m.creatures.length > 0 && (
                      <div className="mt-1 ml-4 text-xs text-[#8a6c2a]/35 truncate font-serif">
                        {m.creatures.map(c => c.name).join(' · ')}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer stats */}
        <div className="p-4 border-t border-[#8a6c2a]/15 text-xs text-[#8a6c2a]/45 font-serif">
          <div className="flex justify-between">
            <span>共载 {mountains.length} 山</span>
            <span>{mountains.reduce((sum, m) => sum + m.creatures.length, 0)} 异物</span>
          </div>
        </div>
      </div>
    </div>
  );
}
