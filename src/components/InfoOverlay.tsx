import { useState } from 'react';
import { Info, MousePointerClick, ZoomIn, RotateCw } from 'lucide-react';

export default function InfoOverlay() {
  const [show, setShow] = useState(true);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="absolute bottom-4 left-4 z-20 bg-[#f5eedc]/85 border border-[#8a6c2a]/25 rounded-lg p-2 text-[#2d6b4a] hover:text-[#1a4a30] transition-colors shadow-lg"
      >
        <Info size={18} />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 left-4 z-20 max-w-xs">
      <div className="bg-[#f5eedc]/90 backdrop-blur-md border border-[#8a6c2a]/25 rounded-lg p-4 shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-serif text-[#1a3a28] tracking-wide">操作指南</h3>
          <button
            onClick={() => setShow(false)}
            className="text-[#8a6c2a]/40 hover:text-[#8a6c2a] text-xs font-serif"
          >
            收起
          </button>
        </div>
        <div className="space-y-2 text-xs text-[#2a3820]/65 font-serif">
          <div className="flex items-center gap-2">
            <RotateCw size={12} className="text-[#2d6b4a]/60" />
            <span>拖拽旋转视角</span>
          </div>
          <div className="flex items-center gap-2">
            <ZoomIn size={12} className="text-[#2d6b4a]/60" />
            <span>滚轮缩放</span>
          </div>
          <div className="flex items-center gap-2">
            <MousePointerClick size={12} className="text-[#2d6b4a]/60" />
            <span>点击山岳查看详情</span>
          </div>
        </div>
      </div>
    </div>
  );
}
