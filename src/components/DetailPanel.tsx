import { type Mountain, type Creature, creatureTypeLabels, creatureTypeColors } from '../data/shanhaijing';
import { X, Mountain as MountainIcon, Droplet, Gem, Sparkles } from 'lucide-react';

interface DetailPanelProps {
  mountain: Mountain | null;
  onClose: () => void;
}

export default function DetailPanel({ mountain, onClose }: DetailPanelProps) {
  if (!mountain) return null;

  return (
    <div className="absolute right-0 top-0 h-full w-full max-w-md z-20 pointer-events-auto">
      <div className="h-full overflow-y-auto bg-gradient-to-b from-[#f5eedc]/97 to-[#ede4cc]/97 backdrop-blur-md border-l border-[#8a6c2a]/25 shadow-2xl">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#f5eedc]/98 to-[#f5eedc]/80 backdrop-blur-sm border-b border-[#8a6c2a]/15 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[#8a6c2a]/60 text-xs tracking-[0.25em] mb-1 font-sans">{mountain.region}</div>
              <h2 className="text-2xl font-serif text-[#1a3a28]">{mountain.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#8a6c2a]/50 hover:text-[#8a6c2a] transition-colors p-1 mt-1"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Decorative divider */}
        <div className="flex items-center gap-2 px-6 py-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8a6c2a]/30 to-transparent" />
          <span className="text-[#8a6c2a]/40 text-xs">✦</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#8a6c2a]/30 to-transparent" />
        </div>

        {/* Content */}
        <div className="px-6 pb-8 space-y-6">
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 text-[#2d6b4a]/80 text-xs mb-2">
              <MountainIcon size={13} />
              <span className="tracking-widest">山经记载</span>
            </div>
            <p className="text-[#2a3820] text-sm leading-[1.9] font-serif tracking-wide">
              {mountain.description}
            </p>
          </div>

          {/* Rivers */}
          {mountain.rivers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[#3a6880]/80 text-xs mb-2">
                <Droplet size={13} />
                <span className="tracking-widest">水系</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mountain.rivers.map((r, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-full bg-[#9bbcb8]/20 border border-[#3a6880]/20 text-[#2a4858] font-serif">
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Minerals */}
          {mountain.minerals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[#8a6c2a]/80 text-xs mb-2">
                <Gem size={13} />
                <span className="tracking-widest">所产珍材</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mountain.minerals.map((min, i) => (
                  <span key={i} className="px-3 py-1 text-xs rounded-full bg-[#d4a42a]/10 border border-[#8a6c2a]/25 text-[#5a4010] font-serif">
                    {min}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creatures */}
          {mountain.creatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-[#2d6b4a]/80 text-xs mb-3">
                <Sparkles size={13} />
                <span className="tracking-widest">异物志</span>
              </div>
              <div className="space-y-3">
                {mountain.creatures.map((c, i) => (
                  <CreatureCard key={i} creature={c} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CreatureCard({ creature }: { creature: Creature }) {
  const color = creatureTypeColors[creature.type];
  return (
    <div
      className="rounded-lg border p-4 transition-all hover:scale-[1.015]"
      style={{
        borderColor: `${color}35`,
        background: `linear-gradient(135deg, ${color}12, ${color}05)`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-base font-serif tracking-wide" style={{ color: color }}>
          {creature.name}
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded-full font-sans"
          style={{ background: `${color}18`, color: color, border: `1px solid ${color}35` }}
        >
          {creatureTypeLabels[creature.type]}
        </span>
      </div>
      <p className="text-xs text-[#2a3820]/75 leading-relaxed mb-2 font-serif tracking-wide">
        {creature.description}
      </p>
      <div className="text-xs text-[#8a6c2a]/70 italic font-serif">
        「{creature.effect}」
      </div>
    </div>
  );
}
