import React from "react";

export default function AdPreviewDemo({ variant, format }) {
  if (!variant || !format) return null;
  const { width, height } = format;

  const [scale, setScale] = React.useState(1);
  const [src, setSrc] = React.useState(variant?.image || "");
  const [fallbackIdx, setFallbackIdx] = React.useState(0);
  const [useDefault, setUseDefault] = React.useState(true);

  const getDefaultBaseName = React.useCallback(() => {
    const ad = (variant?.adTypeId || '').replace(/_/g, '-').toLowerCase();
    const fmt = (format?.id === 'portrait' ? 'portrait' : format?.id).toLowerCase();
    const v = variant?.variantNumber || 1;
    // canonical names per requested scheme
    if (ad === 'employer-brand') return `employer_brand_${fmt}_v1`;
    if (ad === 'company' || ad === 'about-company') return `about_company_${fmt}_v1`;
    if (ad === 'testimonial' || ad === 'testimonials') return `testimonial_${fmt}_v1`;
    // job (two variants)
    return `job_${fmt}_v${v}`;
  }, [variant, format]);

  // Prefer PNG as you mentioned your assets are PNGs
  const defaultExtensions = ['png', 'jpg', 'webp'];
  const defaultUrl = React.useMemo(() => `/ads-demo/${getDefaultBaseName()}.${defaultExtensions[fallbackIdx]}`, [getDefaultBaseName, fallbackIdx]);

  React.useEffect(() => {
    const calc = () => {
      const container = document.querySelector('.ad-preview-container');
      if (!container) return 0.3;
      const cw = container.clientWidth - 64;
      const ch = container.clientHeight - 64;
      let s = Math.min(cw / width, ch / height);
      if (format?.id === 'story' || format?.aspectRatio === '9:16') s *= 0.88;
      else if (format?.id === 'portrait' || format?.aspectRatio === '4:5') s *= 0.9;
      else s *= 0.92;
      return Math.min(Math.max(s, 0.3), 0.92);
    };
    const timer = setTimeout(() => setScale(calc()), 80);
    const onResize = () => setScale(calc());
    window.addEventListener('resize', onResize);
    return () => { clearTimeout(timer); window.removeEventListener('resize', onResize); };
  }, [width, height, format]);

  const onPaste = (e) => {
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
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] w-full h-full bg-gray-50 overflow-hidden">
      <div className="ad-preview-container flex items-center justify-center p-8 w-full h-full overflow-hidden">
        <div
          className="bg-white shadow-lg rounded-lg relative overflow-hidden border border-[#eaecf0]"
          style={{
            transform: `scale(${scale})`,
            transformOrigin: 'center center',
            width: `${width}px`,
            height: `${height}px`,
            transition: 'transform 0.3s ease-out',
            backgroundColor: '#0F0828',
          }}
          onPaste={onPaste}
        >
          <img
            alt="creative"
            src={useDefault ? defaultUrl : (src || defaultUrl)}
            onError={() => {
              // If a custom src failed, switch to default series
              if (!useDefault) {
                setUseDefault(true);
                setFallbackIdx(0);
                return;
              }
              // rotate default extension if default also missing
              if (fallbackIdx < defaultExtensions.length - 1) {
                setFallbackIdx((i) => i + 1);
              }
            }}
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          />
          {!src && (
            <div className="absolute bottom-3 right-3">
              <div className="px-2 py-1 rounded bg-white/85 text-gray-800 text-[10px] font-medium shadow">{getDefaultBaseName()}.{defaultExtensions[fallbackIdx]}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


