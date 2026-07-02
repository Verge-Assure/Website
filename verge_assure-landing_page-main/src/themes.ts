/* ================================================================
   ACTIVE THEME — change this number to switch the entire site theme.
   Must match a key in canvasThemes below AND a [data-theme="N"]
   block in themes.css.
   ================================================================ */
export const ACTIVE_THEME = 1

interface CanvasTheme {
  bgLightRgb:        [number, number, number]
  bgDarkRgb:         [number, number, number]
  gridLightRgb:      [number, number, number]
  gridDarkRgb:       [number, number, number]
  glowLightRgb:      [number, number, number]
  glowDarkRgb:       [number, number, number]
  heroLineRgb:       [number, number, number]
}

const canvasThemes: Record<number, CanvasTheme> = {
  1: {
    bgLightRgb:   [140, 159, 133],   /* #8c9f85 — sage green */
    bgDarkRgb:    [13,  26,  13 ],   /* #0d1a0d — near-black green */
    gridLightRgb: [28,  35,  24 ],   /* #1c2318 — dark green grid lines */
    gridDarkRgb:  [255, 255, 255],   /* white grid lines in dark mode */
    glowLightRgb: [28,  35,  24 ],   /* #1c2318 — cursor glow in light mode */
    glowDarkRgb:  [160, 225, 160],   /* soft green glow in dark mode */
    heroLineRgb:  [28,  38,  22 ],   /* hero constellation lines */
  },
}

export const canvasTheme: CanvasTheme = canvasThemes[ACTIVE_THEME]
