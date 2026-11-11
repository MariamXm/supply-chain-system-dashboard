export function parseGps(text) {
  const m = /(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)/.exec(text ?? '')
  return m ? { lat: Number(m[1]), lng: Number(m[2]) } : null
}

export const osmUrl = ({ lat, lng }) =>
  `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=12/${lat}/${lng}`

export const googleMapsUrl = ({ lat, lng }) =>
  `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`

/** Official Embed API when a key is provided; otherwise the keyless embed. */
export function googleMapsEmbedUrl({ lat, lng }, apiKey = '') {
  return apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(apiKey)}&q=${lat},${lng}&zoom=14`
    : `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`
}
