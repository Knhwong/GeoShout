function getZone(lat, lon, precision = 100) {
  const zLat = Math.round(lat * precision);
  const zLon = Math.round(lon * precision);
  return `${zLat}:${zLon}`;
}

module.exports = getZone;