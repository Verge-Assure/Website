// ── Gallery configuration ───────────────────────────────────────────────────
// To swap a placeholder for a real photo:
//   1. Drop the file into src/assets/gallery/
//   2. Replace the import path — everything else stays the same
// ──────────────────────────────────────────────────────────────────────────

import flood      from '../../assets/gallery/01-flood-damage.svg'
import fire       from '../../assets/gallery/02-fire-damage.svg'
import vehicle    from '../../assets/gallery/03-vehicle-accident.svg'
import storm      from '../../assets/gallery/04-storm-damage.svg'
import earthquake from '../../assets/gallery/05-earthquake-damage.svg'
import hail       from '../../assets/gallery/06-hail-damage.svg'
import waterLeak  from '../../assets/gallery/07-water-leak.svg'
import roof       from '../../assets/gallery/08-roof-damage.svg'
import electrical from '../../assets/gallery/09-electrical-damage.svg'

export interface GalleryItem {
  id: number
  src: string
  alt: string
  left: string
  top: string           // % within the 200vh section
  width: string
  aspectRatio: number
  scrollSpeed: number
  mouseSpeed: number
  entryProgress: number // negative = starts appearing while section enters from below
  exitProgress: number  // >1 = stays visible past max scroll
}

// scrollSpeed / mouseSpeed intentionally span a wide range to sell depth:
//   background layer  →  scrollSpeed  18–35,  mouseSpeed 0.005–0.010
//   midground layer   →  scrollSpeed  85–130, mouseSpeed 0.022–0.032
//   foreground layer  →  scrollSpeed 210–320, mouseSpeed 0.055–0.075
export const GALLERY_ITEMS: GalleryItem[] = [
  // ── Top band — background (far, slow) ────────────────────────
  {
    id: 1, src: flood, alt: 'Flood damage',
    left: '3%', top: '5%', width: '22vw', aspectRatio: 400 / 267,
    scrollSpeed: 22, mouseSpeed: 0.007,
    entryProgress: -0.30, exitProgress: 0.72,
  },
  {
    id: 7, src: waterLeak, alt: 'Water damage',
    left: '66%', top: '3%', width: '19vw', aspectRatio: 400 / 267,
    scrollSpeed: 18, mouseSpeed: 0.006,
    entryProgress: -0.22, exitProgress: 0.76,
  },
  {
    id: 5, src: earthquake, alt: 'Earthquake damage',
    left: '36%', top: '28%', width: '18vw', aspectRatio: 400 / 267,
    scrollSpeed: 28, mouseSpeed: 0.008,
    entryProgress: -0.25, exitProgress: 0.74,
  },
  // ── Top band — foreground (close, fast) ──────────────────────
  {
    id: 6, src: hail, alt: 'Hail damage',
    left: '7%', top: '19%', width: '16vw', aspectRatio: 267 / 400,
    scrollSpeed: 215, mouseSpeed: 0.058,
    entryProgress: -0.18, exitProgress: 0.77,
  },

  // ── Middle band — foreground ──────────────────────────────────
  {
    id: 2, src: fire, alt: 'Fire damage',
    left: '63%', top: '15%', width: '20vw', aspectRatio: 267 / 400,
    scrollSpeed: 260, mouseSpeed: 0.065,
    entryProgress: -0.10, exitProgress: 0.83,
  },
  // ── Middle band — midground ───────────────────────────────────
  {
    id: 3, src: vehicle, alt: 'Vehicle accident',
    left: '2%', top: '41%', width: '20vw', aspectRatio: 400 / 267,
    scrollSpeed: 90, mouseSpeed: 0.025,
    entryProgress: -0.04, exitProgress: 0.87,
  },
  {
    id: 8, src: roof, alt: 'Roof damage',
    left: '26%', top: '64%', width: '17vw', aspectRatio: 267 / 400,
    scrollSpeed: 115, mouseSpeed: 0.030,
    entryProgress: 0.00, exitProgress: 0.90,
  },

  // ── Bottom band — foreground ──────────────────────────────────
  {
    id: 4, src: storm, alt: 'Storm damage',
    left: '75%', top: '50%', width: '19vw', aspectRatio: 267 / 400,
    scrollSpeed: 300, mouseSpeed: 0.070,
    entryProgress: 0.26, exitProgress: 1.05,
  },
  // ── Bottom band — midground ───────────────────────────────────
  {
    id: 9, src: electrical, alt: 'Electrical damage',
    left: '4%', top: '72%', width: '18vw', aspectRatio: 400 / 267,
    scrollSpeed: 95, mouseSpeed: 0.026,
    entryProgress: 0.32, exitProgress: 1.10,
  },
  // ── Bottom band — background ──────────────────────────────────
  {
    id: 10, src: flood, alt: 'Flood damage',
    left: '56%', top: '75%', width: '20vw', aspectRatio: 400 / 267,
    scrollSpeed: 32, mouseSpeed: 0.009,
    entryProgress: 0.28, exitProgress: 1.08,
  },
  {
    id: 11, src: hail, alt: 'Hail damage',
    left: '30%', top: '80%', width: '15vw', aspectRatio: 267 / 400,
    scrollSpeed: 25, mouseSpeed: 0.007,
    entryProgress: 0.38, exitProgress: 1.12,
  },
  // ── Bottom band — foreground ──────────────────────────────────
  {
    id: 12, src: vehicle, alt: 'Vehicle accident',
    left: '74%', top: '86%', width: '17vw', aspectRatio: 400 / 267,
    scrollSpeed: 320, mouseSpeed: 0.075,
    entryProgress: 0.44, exitProgress: 1.15,
  },
]
