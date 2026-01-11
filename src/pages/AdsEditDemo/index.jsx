import React from "react";

const FORMAT_SPECS = {
  story: { id: 'story', label: 'Vertical (9:16)', width: 1080, height: 1920, aspectRatio: '9:16' },
  square: { id: 'square', label: 'Square (1:1)', width: 1080, height: 1080, aspectRatio: '1:1' },
  portrait: { id: 'portrait', label: 'Portrait (4:5)', width: 1080, height: 1350, aspectRatio: '4:5' },
};

function useScale(width, height) {
  const [scale, setScale] = React.useState(1);
  React.useEffect(() => {
    const calc = () => {
      const container = document.querySelector('.demo-preview-container');
      if (!container) return 0.3;
      const cw = container.clientWidth - 64;
      const ch = container.clientHeight - 64;
      const s = Math.min(cw / width, ch / height);
      return Math.min(Math.max(s * 0.9, 0.25), 0.95);
    };
    const timer = setTimeout(() => setScale(calc()), 50);
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, [width, height]);
  return scale;
}

function ImageSlot({ label, width, height }) {
  const [src, setSrc] = React.useState('');
  const inputRef = React.useRef(null);
  const scale = useScale(width, height);

  const onPaste = React.useCallback((e) => {
    const text = e.clipboardData?.getData('text');
    if (text && /^(https?:)?\//.test(text)) {
      setSrc(text.trim());
      e.preventDefault();
      return;
    }
    const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'));
    if (item) {
      const file = item.getAsFile();
      if (file) setSrc(URL.createObjectURL(file));
      e.preventDefault();
    }
  }, []);

  const onDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith('image/')) setSrc(URL.createObjectURL(file));
  };

  const onPick = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) setSrc(URL.createObjectURL(file));
  };

  return (
    <div className="flex flex-col items-center gap-2 mb-10">
      <div className="text-sm font-medium text-gray-700">{label} • {width}×{height}px</div>
      <div className="demo-preview-container flex items-center justify-center w-full" style={{ minHeight: 360 }}>
        <div
          onPaste={onPaste}
          onDrop={onDrop}
          onDragOver={(e) => e.preventDefault()}
          className="relative bg-white shadow rounded-lg overflow-hidden border border-gray-200"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: `${width}px`,
            height: `${height}px`,
            backgroundColor: '#0F0828',
            backgroundImage: src ? `url(${src})` : 'repeating-linear-gradient(45deg, rgba(255,255,255,0.06) 0, rgba(255,255,255,0.06) 12px, transparent 12px, transparent 24px)',
            backgroundSize: src ? 'cover' : 'auto',
            backgroundPosition: 'center',
          }}
        >
          {!src && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white/85">
                <div className="text-lg font-semibold mb-1">Paste or Drop Image</div>
                <div className="text-xs opacity-80 mb-3">Ctrl/Cmd+V URL or image, or click to upload</div>
                <button
                  className="px-3 py-1.5 rounded bg-white/90 text-gray-800 text-xs font-medium"
                  onClick={() => inputRef.current?.click()}
                >Upload</button>
              </div>
            </div>
          )}
          <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={onPick} />
        </div>
      </div>
    </div>
  );
}

export default function AdsEditDemo() {
  const [formatId, setFormatId] = React.useState('story');
  const spec = FORMAT_SPECS[formatId];

  const Button = ({ id, children }) => (
    <button
      onClick={() => setFormatId(id)}
      className={`px-3 py-1.5 rounded-full text-sm font-medium border ${formatId === id ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-800 border-gray-300'}`}
    >{children}</button>
  );

  return (
    <div className="w-full h-full p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-xl font-semibold">Demo Image Slots</div>
        <div className="flex gap-2">
          <Button id="story">Vertical (9:16)</Button>
          <Button id="square">Square (1:1)</Button>
          <Button id="portrait">Portrait (4:5)</Button>
        </div>
      </div>

      <div className="space-y-10">
        <section>
          <div className="text-lg font-semibold mb-2">Job Ad</div>
          <ImageSlot label={`Variant 1 – ${FORMAT_SPECS[formatId].label}`} width={spec.width} height={spec.height} />
          <ImageSlot label={`Variant 2 – ${FORMAT_SPECS[formatId].label}`} width={spec.width} height={spec.height} />
        </section>

        <section>
          <div className="text-lg font-semibold mb-2">Employer Brand</div>
          <ImageSlot label={`Variant 1 – ${FORMAT_SPECS[formatId].label}`} width={spec.width} height={spec.height} />
        </section>

        <section>
          <div className="text-lg font-semibold mb-2">About The Company</div>
          <ImageSlot label={`Variant 1 – ${FORMAT_SPECS[formatId].label}`} width={spec.width} height={spec.height} />
        </section>

        <section>
          <div className="text-lg font-semibold mb-2">Testimonials</div>
          <ImageSlot label={`Variant 1 – ${FORMAT_SPECS[formatId].label}`} width={spec.width} height={spec.height} />
        </section>
      </div>
    </div>
  );
}


