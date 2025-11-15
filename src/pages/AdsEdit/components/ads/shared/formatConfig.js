// Centralized format definitions and layout helpers for Meta creatives
// Sizes (px): Story 1080×1920, Square 1080×1080, 4:5 1080×1350 (mapped to "landscape" id in loader)

export const FORMAT_SPECS = {
  story: { id: 'story', width: 1080, height: 1920, aspectRatio: '9:16' },
  square: { id: 'square', width: 1080, height: 1080, aspectRatio: '1:1' },
  landscape: { id: 'landscape', width: 1080, height: 1350, aspectRatio: '4:5' },
};

// Returns canvas size plus suggested key positions based on format
export function getFormatMetrics(formatId) {
  const spec = FORMAT_SPECS[formatId] || FORMAT_SPECS.story;
  const { width, height } = spec;

  // Basic offsets tuned from Figma nodes; components can override per design
  const metrics = {
    width,
    height,
    padding: 80,
    titleMaxWidth: formatId === 'square' ? Math.min(720, width - 2 * 100) : Math.min(711, width - 2 * 185),
    badgesWidth: formatId === 'square' ? 634 : 634,
    cta: {
      width: formatId === 'square' ? 291 : 331,
      height: formatId === 'square' ? 82 : 93,
      y: formatId === 'story' ? height - 165 : height - 120,
    },
  };

  return { ...spec, ...metrics };
}


