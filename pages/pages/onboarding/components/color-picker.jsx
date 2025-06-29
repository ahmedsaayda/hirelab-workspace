import React, { useState, useEffect, useRef, useCallback } from "react";
import { Modal, Input, Button } from "antd";
import { PlusOutlined, CopyOutlined } from "@ant-design/icons";



export function ColorPicker({
  open,
  onClose,
  onColorSelect,
  initialColor = "#344054",
}) {
  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [isDragging, setIsDragging] = useState(false);
  const gradientRef = useRef(null);
  const [handlePosition, setHandlePosition] = useState({ x: 0, y: 0 });

  const colors = [
    "#FF0000",
    "#FF7F00",
    "#FFFF00",
    "#00FF00",
    "#0000FF",
    "#8B00FF",
    "#FF00FF",
    "#000000",
    "#FFFFFF",
    "#808080",
    "#C0C0C0",
    "#800000",
  ];

  const getColorAtPosition = useCallback((x, y) => {
    if (!gradientRef.current) return "#FFFFFF";

    const rect = gradientRef.current.getBoundingClientRect();
    const percentageX = Math.max(0, Math.min(1, (x - rect.left) / rect.width));
    const percentageY = Math.max(0, Math.min(1, (y - rect.top) / rect.height));

    // Convert HSV to RGB
    const hue = percentageX * 360;
    const saturation = 1 - percentageY;
    const value = 1;

    const c = value * saturation;
    const x1 = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = value - c;

    let r, g, b;
    if (hue < 60) {
      [r, g, b] = [c, x1, 0];
    } else if (hue < 120) {
      [r, g, b] = [x1, c, 0];
    } else if (hue < 180) {
      [r, g, b] = [0, c, x1];
    } else if (hue < 240) {
      [r, g, b] = [0, x1, c];
    } else if (hue < 300) {
      [r, g, b] = [x1, 0, c];
    } else {
      [r, g, b] = [c, 0, x1];
    }

    const toHex = (value) =>
      Math.round((value + m) * 255)
        .toString(16)
        .padStart(2, "0");
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }, []);

  const updateColorFromPosition = (x, y) => {
    if (!gradientRef.current) return;

    const rect = gradientRef.current.getBoundingClientRect();
    const newX = Math.max(0, Math.min(rect.width, x - rect.left));
    const newY = Math.max(0, Math.min(rect.height, y - rect.top));

    setHandlePosition({ x: newX, y: newY });
    setSelectedColor(getColorAtPosition(x, y));
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    updateColorFromPosition(e.clientX, e.clientY);
  };

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging) return;
      updateColorFromPosition(e.clientX, e.clientY);
    },
    [isDragging]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (open) {
      setSelectedColor(initialColor || "#344054");
      // Reset handle position when opening
      setHandlePosition({ x: 0, y: 0 });
    }
  }, [open, initialColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color.toUpperCase());
  };

  const handleCopyColor = async () => {
    try {
      await navigator.clipboard.writeText(selectedColor);
    } catch (err) {
      console.error("Failed to copy color:", err);
    }
  };

  const handleContinue = () => {
    onColorSelect?.(selectedColor);
    onClose();
  };

  return (
    <Modal
      title="Upload color"
      open={open}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: "480px" }}
      className="rounded-lg"
    >
      <div className="py-4 space-y-6">
        {/* Full Spectrum Color Picker */}
        <div
          ref={gradientRef}
          className="relative h-48 rounded-lg cursor-crosshair"
          style={{
            background:
              "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000)",
            backgroundImage:
              "linear-gradient(to right, #FF0000, #FFFF00, #00FF00, #00FFFF, #0000FF, #FF00FF, #FF0000), linear-gradient(to bottom, rgba(255,255,255,0), #000000)",
            backgroundBlendMode: "normal, multiply",
          }}
          onMouseDown={handleMouseDown}
        >
          <div
            className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 border-2 border-white rounded-full shadow-md cursor-grab active:cursor-grabbing"
            style={{
              left: handlePosition.x,
              top: handlePosition.y,
              backgroundColor: selectedColor,
            }}
          />
        </div>

        {/* Color Input */}
        <div className="flex items-center gap-2">
          <Input
            value={selectedColor}
            onChange={(e) => handleColorSelect(e.target.value)}
            className="font-mono uppercase border-gray-300 rounded-md"
          />
          <div
            className="w-10 h-10 border border-gray-200 rounded-md"
            style={{ backgroundColor: selectedColor }}
          />
          <Button
            icon={<CopyOutlined />}
            onClick={handleCopyColor}
            className="text-gray-700 border-gray-300"
          />
        </div>

        {/* Color Swatches */}
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <div
              key={color}
              className={`h-8 w-8 cursor-pointer rounded-full transition-all hover:ring-2 hover:ring-offset-2 ${
                selectedColor.toUpperCase() === color.toUpperCase()
                  ? "ring-2 ring-blue-600 ring-offset-2"
                  : ""
              }`}
              style={{ backgroundColor: color }}
              onClick={() => handleColorSelect(color)}
            />
          ))}
          <div className="flex items-center justify-center w-8 h-8 border-2 border-gray-300 border-dashed rounded-full cursor-pointer hover:border-gray-400">
            <PlusOutlined className="text-gray-400" />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between pt-6 border-t border-gray-200">
          <Button className="text-gray-700 border-gray-300" onClick={onClose}>
            Back
          </Button>
          <Button
            type="primary"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={handleContinue}
          >
            Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
