let L: typeof import("leaflet") | null = null

export async function initLeaflet() {
  if (L) return L

  if (typeof window === "undefined") return null

  const leaflet = await import("leaflet")
  const L_object = leaflet.default

  ;(window as any).L = L_object

  const leafletFullscreen = await import("leaflet.fullscreen")
  const leafletDraw = await import("leaflet-draw")
  await import("leaflet.markercluster")

  if (L_object.Control && !L_object.Control.FullScreen) {
    L_object.Control.FullScreen =
      leafletFullscreen.default || leafletFullscreen
  }

  L = L_object
  return L
}
