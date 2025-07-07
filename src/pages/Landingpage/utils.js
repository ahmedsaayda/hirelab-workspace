  // Calculate whether to use black or white text based on background color
  const calculateTextColor = (hexColor, threshold = 180) => {
  // Remove the # if it exists
  const hex = hexColor.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Calculate YIQ ratio (perceived brightness)
  // This formula gives more weight to colors the human eye is more sensitive to
  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  // Return black for bright backgrounds, white for dark backgrounds
  // Threshold can be adjusted: higher values = more sensitive (more black text)
  return yiq >= threshold ? "#000000" : "#FFFFFF"
}

  export { calculateTextColor }
