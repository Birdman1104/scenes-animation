import { Texture } from "pixi.js";

export const getParticleConfig = (texture: Texture) => {
  return {
    lifetime: {
      min: 0.5,
      max: 1.5,
    },
    frequency: 0.001,
    spawnChance: 1,
    particlesPerWave: 1,
    emitterLifetime: -1,
    maxParticles: 20,
    pos: {
      x: 0,
      y: 0,
    },
    behaviors: [
      {
        type: "alpha",
        config: {
          alpha: {
            list: [
              { value: 0.5, time: 0 },
              { value: 0, time: 1 },
            ],
          },
        },
      },
      {
        type: "moveAcceleration",
        config: {
          accel: {
            x: 0,
            y: 0.001,
          },
          minStart: 0.1,
          maxStart: 0.4,
          rotate: false,
        },
      },
      {
        type: "color",
        config: {
          color: {
            list: [
              { value: "#d13d26", time: 0 },
              { value: "#f09918", time: 1 },
            ],
          },
        },
      },
      {
        type: "scale",
        config: {
          scale: {
            list: [
              { value: 1, time: 0 },
              { value: 0.4, time: 1 },
            ],
          },
        },
      },
      {
        type: "moveSpeed",
        config: {
          speed: {
            list: [
              { value: 50, time: 0 },
              { value: 10, time: 1 },
            ],
            isStepped: false,
          },
        },
      },
      {
        type: "rotationStatic",
        config: {
          min: 235,
          max: 300,
        },
      },
      {
        type: "textureSingle",
        config: {
          texture,
        },
      },
    ],

    // noRotation: false,
    // rotationSpeed: {
    //   min: 0,
    //   max: 0,
    // },
    // blendMode: "normal",
  };
};
