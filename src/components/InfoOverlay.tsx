import { useState } from 'react';
import { Info, MousePointerClick, ZoomIn, RotateCw } from 'lucide-react';

export default function InfoOverlay() {
  const [show, setShow] = useState(true);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="absolute bottom-4 left-4 z-20 bg-[#1a1a2e]/80 border border-amber-700/30 rounded-lg p-2 text-amber-400 hover:text-amber-300 transition-colors"
      >
        <Info size={18} />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-20 max-w-xs">
      <div className="bg-[#1a1a2e]/90 backdrop-blur-md border border-amber-700/30 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif text-amber-200">操作指南</h3>
          <button
            onClick={() => setShow(false)}
            className="text-amber-500/40 hover:text-amber-300 text-xs"
          >
            收起
          </button>
        </div>
        <div className="space-y-2 text-xs text-amber-100/60">
          <div className="flex items-center gap-2">
            <RotateCw size={12} className="text-amber-500/60" />
            <span>拖拽旋转视角</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn size={12} className="text-amber-500/60" />
            <span>滚轮缩放</span>
          </div>
          <div className="flex items-center gap-2">
            <MousePointerClick size={12} className="text-amber-500/60" />
            <span>点击山岳查看详情</span>
          </div>
        </div>
      </div>
    </div>
  );
}
