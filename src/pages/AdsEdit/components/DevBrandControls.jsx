import React from "react";
import { Drawer, Input, Button } from "antd";
import ColorPickerButton from "../../onboarding/components/ColorPickerButton.jsx";

const STORAGE_KEY = "hl_dev_ads_brand_override_v1";

const normalizeHex = (raw) => {
  const s = String(raw || "").trim();
  if (!s) return "";
  const withHash = s.startsWith("#") ? s : `#${s}`;
  const upper = withHash.toUpperCase();
  // Allow #RGB or #RRGGBB
  if (/^#[0-9A-F]{3}$/i.test(upper) || /^#[0-9A-F]{6}$/i.test(upper)) return upper;
  return "";
};

const Row = ({ label, value, onPick, onText, drawerBodyRef }) => (
  <div className="flex items-center justify-between gap-3 py-2">
    <div className="text-sm font-medium text-[#101828] min-w-[88px]">{label}</div>
    <div className="flex items-center gap-3">
      <ColorPickerButton
        label={label}
        color={value || "#000000"}
        setColor={onPick}
        // Important: render popup within drawer to allow smooth dragging (no outside-click interference)
        getPopupContainer={() => drawerBodyRef.current || document.body}
      />
      <Input
        value={value || ""}
        onChange={(e) => onText(e.target.value)}
        placeholder="#RRGGBB"
        className="w-[120px]"
        size="small"
      />
    </div>
  </div>
);

export default function DevBrandControls({ brandData, onChange, onReset }) {
  const [open, setOpen] = React.useState(false);
  const drawerBodyRef = React.useRef(null);

  // Load any saved override once (dev-only usage expected)
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === "object") {
        onChange?.({ ...(brandData || {}), ...parsed });
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const patch = (partial) => {
    const next = { ...(brandData || {}), ...(partial || {}) };
    onChange?.(next);
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify({
          primaryColor: next.primaryColor,
          secondaryColor: next.secondaryColor,
          tertiaryColor: next.tertiaryColor,
        }));
      } catch {
        // ignore
      }
    }
  };

  const reset = () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem(STORAGE_KEY);
      } catch {
        // ignore
      }
    }
    onReset?.();
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-[80] px-3 py-2 rounded-full shadow-lg border border-[#e5e7eb] bg-white text-[#111827] text-sm font-semibold hover:bg-[#f9fafb]"
        title="Dev-only: tweak brand colors live"
      >
        Dev Brand
      </button>

      <Drawer
        title="Dev Brand (Ads Editor)"
        open={open}
        onClose={() => setOpen(false)}
        placement="right"
        width={360}
      >
        <div ref={drawerBodyRef} className="relative">
          <div className="text-xs text-[#667085] mb-4">
            Dev-only overrides for preview. Saved in localStorage, never persisted to backend.
          </div>

          <div className="border border-[#eaecf0] rounded-lg p-3">
          <Row
            label="Primary"
            value={brandData?.primaryColor}
            onPick={(hex) => patch({ primaryColor: normalizeHex(hex) || hex })}
            onText={(txt) => {
              const hex = normalizeHex(txt);
              if (hex) patch({ primaryColor: hex });
            }}
            drawerBodyRef={drawerBodyRef}
          />
          <Row
            label="Secondary"
            value={brandData?.secondaryColor}
            onPick={(hex) => patch({ secondaryColor: normalizeHex(hex) || hex })}
            onText={(txt) => {
              const hex = normalizeHex(txt);
              if (hex) patch({ secondaryColor: hex });
            }}
            drawerBodyRef={drawerBodyRef}
          />
          <Row
            label="Tertiary"
            value={brandData?.tertiaryColor}
            onPick={(hex) => patch({ tertiaryColor: normalizeHex(hex) || hex })}
            onText={(txt) => {
              const hex = normalizeHex(txt);
              if (hex) patch({ tertiaryColor: hex });
            }}
            drawerBodyRef={drawerBodyRef}
          />
          </div>

          <div className="flex gap-2 mt-4">
            <Button onClick={reset} danger className="flex-1">
              Reset
            </Button>
            <Button onClick={() => setOpen(false)} type="primary" className="flex-1">
              Close
            </Button>
          </div>
        </div>
      </Drawer>
    </>
  );
}


