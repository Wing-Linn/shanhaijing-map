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
        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-[#1a1a2e]/90 border border-amber-700/30 border-l-0 rounded-r-lg p-3 text-amber-400 hover:text-amber-300 transition-all"
      >
        <ChevronRight size={20} className="rotate-180" />
      </button>
    );
  }

  return (
    <div className="absolute left-0 top-0 h-full w-80 z-20 pointer-events-auto">
      <div className="h-full flex flex-col bg-gradient-to-b from-[#1a1a2e]/95 to-[#0d0d1a]/95 backdrop-blur-md border-r border-amber-700/30 shadow-2xl">
        {/* Title */}
        <div className="p-6 border-b border-amber-700/20">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-serif text-amber-200 tracking-wider">山海经</h1>
              <p className="text-xs text-amber-500/50 mt-1 tracking-widest">SHAN HAI JING · 3D MAP</p>
            </div>
            <button
              onClick={() => setIsCollapsed(true)}
              className="text-amber-300/50 hover:text-amber-300 transition-colors p-1"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-amber-700/10">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500/40" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索山名、异兽..."
              className="w-full pl-9 pr-3 py-2 bg-[#0d0d1a] border border-amber-700/20 rounded-lg text-sm text-amber-100 placeholder-amber-500/30 focus:outline-none focus:border-amber-600/50 transition-colors"
            />
          </div>
        </div>

        {/* Region filters */}
        <div className="p-4 border-b border-amber-700/10">
          <div className="flex items-center gap-2 text-amber-500/60 text-xs mb-3">
            <Compass size={14} />
            <span>五方山经</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setFilterRegion(null)}
              onMouseEnter={() => setHoveredRegion(null)}
              className={`px-2 py-1.5 text-xs rounded-md transition-all ${
                !filterRegion
                  ? 'bg-amber-700/40 text-amber-200 border border-amber-600/50'
                  : 'bg-[#0d0d1a] text-amber-500/50 border border-amber-700/10 hover:border-amber-700/30'
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
                className={`px-2 py-1.5 text-xs rounded-md transition-all border ${
                  filterRegion === r.code
                    ? 'text-white'
                    : 'bg-[#0d0d1a] text-amber-500/50 border-amber-700/10 hover:border-amber-700/30'
                }`}
                style={filterRegion === r.code ? {
                  background: `${r.color}40`,
                  borderColor: `${r.color}80`,
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
            <div className="text-center text-amber-500/30 text-sm py-8">无搜索结果</div>
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
                        ? 'bg-amber-900/30 border border-amber-700/40'
                        : 'hover:bg-amber-900/10 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: region?.color }}
                        />
                        <span className={`text-sm font-serif ${isSelected ? 'text-amber-200' : 'text-amber-100/70'}`}>
                          {m.name}
                        </span>
                      </div>
                      {m.creatures.length > 0 && (
                        <span className="text-xs text-amber-500/40">
                          {m.creatures.length} 异物
                        </span>
                      )}
                    </div>
                    {m.creatures.length > 0 && (
                      <div className="mt-1 ml-4 text-xs text-amber-500/30 truncate">
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
        <div className="p-4 border-t border-amber-700/20 text-xs text-amber-500/40">
          <div className="flex justify-between">
            <span>共载 {mountains.length} 山</span>
            <span>{mountains.reduce((sum, m) => sum + m.creatures.length, 0)} 异物</span>
          </div>
        </div>
      </div>
    </div>
  );
}
