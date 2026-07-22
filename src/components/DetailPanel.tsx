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
      <div className="h-full overflow-y-auto bg-gradient-to-b from-[#1a1a2e]/95 to-[#0d0d1a]/95 backdrop-blur-md border-l border-amber-700/30 shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-b from-[#1a1a2e] to-[#1a1a2e]/80 backdrop-blur-md border-b border-amber-700/20 p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-amber-500/60 text-xs tracking-widest mb-1">{mountain.region}</div>
              <h2 className="text-2xl font-serif text-amber-100">{mountain.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="text-amber-300/50 hover:text-amber-300 transition-colors p-1"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Description */}
          <div>
            <div className="flex items-center gap-2 text-amber-500/80 text-sm mb-2">
              <MountainIcon size={14} />
              <span>山经记载</span>
            </div>
            <p className="text-amber-100/80 text-sm leading-relaxed font-serif">
              {mountain.description}
            </p>
          </div>

          {/* Rivers */}
          {mountain.rivers.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-sky-400/80 text-sm mb-2">
                <Droplet size={14} />
                <span>水系</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mountain.rivers.map((r, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-sky-900/40 border border-sky-700/30 text-sky-200"
                  >
                    {r}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Minerals */}
          {mountain.minerals.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-amber-500/80 text-sm mb-2">
                <Gem size={14} />
                <span>所产</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {mountain.minerals.map((m, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 text-xs rounded-full bg-amber-900/30 border border-amber-700/30 text-amber-200"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Creatures */}
          {mountain.creatures.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-amber-500/80 text-sm mb-3">
                <Sparkles size={14} />
                <span>异物志</span>
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
      className="rounded-lg border p-4 transition-all hover:scale-[1.02]"
      style={{
        borderColor: `${color}40`,
        background: `linear-gradient(135deg, ${color}15, ${color}05)`,
      }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-lg font-serif" style={{ color }}>
          {creature.name}
        </h4>
        <span
          className="text-xs px-2 py-0.5 rounded-full"
          style={{
            background: `${color}20`,
            color: color,
            border: `1px solid ${color}40`,
          }}
        >
          {creatureTypeLabels[creature.type]}
        </span>
      </div>
      <p className="text-sm text-amber-100/70 leading-relaxed mb-2 font-serif">
        {creature.description}
      </p>
      <div className="text-xs text-amber-300/60 italic font-serif">
        「{creature.effect}」
      </div>
    </div>
  );
}
