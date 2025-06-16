// Astronomical constants and utilities

export const ASTRONOMICAL_UNIT = 149597870.7; // km
export const SOLAR_RADIUS = 696340; // km
export const EARTH_RADIUS = 6371; // km

// Scale factors for visualization
export const DISTANCE_SCALE = 0.1; // Scale down distances for better visualization
export const SIZE_SCALE = 0.001; // Scale down sizes for better visualization

// Planet data
export const PLANET_DATA = {
  Mercury: {
    realRadius: 2439.7, // km
    realDistance: 57.9e6, // km from Sun
    color: '#8C7853',
    rotationPeriod: 58.6, // Earth days
    orbitalPeriod: 88, // Earth days
    moons: 0
  },
  Venus: {
    realRadius: 6051.8,
    realDistance: 108.2e6,
    color: '#FFC649',
    rotationPeriod: 243,
    orbitalPeriod: 225,
    moons: 0
  },
  Earth: {
    realRadius: 6371,
    realDistance: 149.6e6,
    color: '#6B93D6',
    rotationPeriod: 1,
    orbitalPeriod: 365.25,
    moons: 1
  },
  Mars: {
    realRadius: 3389.5,
    realDistance: 227.9e6,
    color: '#CD5C5C',
    rotationPeriod: 1.03,
    orbitalPeriod: 687,
    moons: 2
  },
  Jupiter: {
    realRadius: 69911,
    realDistance: 778.5e6,
    color: '#D8CA9D',
    rotationPeriod: 0.41,
    orbitalPeriod: 4333,
    moons: 79
  },
  Saturn: {
    realRadius: 58232,
    realDistance: 1432e6,
    color: '#FAD5A5',
    rotationPeriod: 0.45,
    orbitalPeriod: 10759,
    moons: 82
  }
};

// Utility functions
export const scaleDistance = (realDistance) => {
  return (realDistance / ASTRONOMICAL_UNIT) * DISTANCE_SCALE;
};

export const scaleSize = (realRadius) => {
  return (realRadius / EARTH_RADIUS) * SIZE_SCALE;
};

export const formatNumber = (num) => {
  if (num >= 1e9) {
    return (num / 1e9).toFixed(1) + 'B';
  } else if (num >= 1e6) {
    return (num / 1e6).toFixed(1) + 'M';
  } else if (num >= 1e3) {
    return (num / 1e3).toFixed(1) + 'K';
  }
  return num.toString();
};

export const formatDistance = (km) => {
  if (km >= ASTRONOMICAL_UNIT) {
    return (km / ASTRONOMICAL_UNIT).toFixed(2) + ' AU';
  } else if (km >= 1e6) {
    return (km / 1e6).toFixed(1) + ' million km';
  } else if (km >= 1e3) {
    return (km / 1e3).toFixed(1) + ' thousand km';
  }
  return km.toFixed(0) + ' km';
};

// Performance settings
export const PERFORMANCE_PRESETS = {
  low: {
    quality: 'low',
    enableLOD: true,
    maxParticles: 500,
    shadowQuality: 'off',
    antialiasing: false
  },
  medium: {
    quality: 'medium',
    enableLOD: true,
    maxParticles: 1000,
    shadowQuality: 'low',
    antialiasing: true
  },
  high: {
    quality: 'high',
    enableLOD: false,
    maxParticles: 2000,
    shadowQuality: 'high',
    antialiasing: true
  }
};

// Animation easing functions
export const easeInOut = (t) => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeOut = (t) => {
  return 1 - Math.pow(1 - t, 3);
};

export const easeIn = (t) => {
  return t * t * t;
};
