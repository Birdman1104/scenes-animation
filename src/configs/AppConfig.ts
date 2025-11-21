export const AppConfig = Object.freeze({
  canvas: {
    width: 800,
    height: 600,
    backgroundColor: 0x1a1a2e,
  },

  transitions: {
    duration: 300,
    easing: "easeInOutCubic" as const,
  },
} as const);
