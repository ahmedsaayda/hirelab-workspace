"use client";

import { useMemo } from "react";
import { colord } from "colord";
import useTemplatePalette from "../../../../pages/hooks/useTemplatePalette";
import { getThemeData } from "../../../utils/destructureTheme";
import { calculateTextColor } from "../../../pages/Landingpage/utils";

const DEFAULT_COLORS = {
  primaryColor: "#5e15eb",
  secondaryColor: "#dbd5fe",
  tertiaryColor: "#7252e0",
  heroBackgroundColor: "#19024c",
};

const pickFirstDefined = (values, fallback) => {
  for (const value of values) {
    if (value !== undefined && value !== null && value !== "") {
      return value;
    }
  }
  return fallback;
};

export default function useAdPalette({
  landingPageData,
  brandData,
  defaultColors = DEFAULT_COLORS,
} = {}) {
  const themeData = useMemo(
    () => (landingPageData?.theme ? getThemeData(landingPageData?.theme) : {}),
    [landingPageData?.theme]
  );

  const resolvedPrimary = pickFirstDefined(
    [
      landingPageData?.primaryColor,
      brandData?.primaryColor,
      themeData?.basePrimary,
    ],
    defaultColors.primaryColor
  );

  const resolvedSecondary = pickFirstDefined(
    [
      landingPageData?.secondaryColor,
      brandData?.secondaryColor,
      themeData?.baseSecondary,
      themeData?.variantPl2,
    ],
    defaultColors.secondaryColor
  );

  const resolvedTertiary = pickFirstDefined(
    [
      landingPageData?.tertiaryColor,
      brandData?.tertiaryColor,
      themeData?.baseTertiary,
      themeData?.variantTl2,
    ],
    defaultColors.tertiaryColor
  );

  const heroBackgroundCandidates = [
    landingPageData?.heroBackgroundColor,
    landingPageData?.backgroundColor,
    themeData?.variantPd5,
    themeData?.basePrimary
      ? colord(themeData.basePrimary).darken(0.45).toHex()
      : undefined,
  ];

  const resolvedHeroBackground = pickFirstDefined(
    heroBackgroundCandidates,
    defaultColors.heroBackgroundColor
  );

  const palette = useTemplatePalette(defaultColors, {
    primaryColor: resolvedPrimary,
    secondaryColor: resolvedSecondary,
    tertiaryColor: resolvedTertiary,
    heroBackgroundColor: resolvedHeroBackground,
  });

  const getContrastColor = (color, fallback = "#ffffff") => {
    if (!color) return fallback;
    // Normalize to hex format because calculateTextColor expects strictly #RRGGBB
    // This handles rgb(), rgba(), 3-digit hex, and other formats colord supports
    const hex = colord(color).toHex();
    // Use the shared utility that respects yiqThreshold from landing page data
    // Default to 128 if not provided to ensure better accessibility (standard YIQ threshold)
    return calculateTextColor(hex, landingPageData?.yiqThreshold || 128);
  };

  return {
    ...palette,
    primaryColor: palette.getPrimary(500),
    secondaryColor: palette.getSecondary(500),
    tertiaryColor: palette.getTertiary(500),
    heroBackgroundColor: palette.getHeroBackground(500),
    getContrastColor,
  };
}




