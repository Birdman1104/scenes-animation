import { animate } from "animejs";
import { Container, DisplayObject } from "pixi.js";
import { AppConfig } from "../configs/AppConfig";

export interface AnimationOptions {
  duration?: number;
  easing?: string;
  delay?: number;
}

export const fadeToAlpha = (target: DisplayObject, toAlpha: number, options: AnimationOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    animate(target, {
      alpha: toAlpha,
      duration: options.duration ?? AppConfig.transitions.duration,
      easing: options.easing ?? AppConfig.transitions.easing,
      delay: options.delay ?? 0,
      onComplete: () => resolve(),
    });
  });
};

export const fadeIn = (target: DisplayObject, options: AnimationOptions = {}): Promise<void> => {
  return fadeToAlpha(target, 1, options);
};

export const fadeOut = (target: DisplayObject, options: AnimationOptions = {}): Promise<void> => {
  return fadeToAlpha(target, 0, options);
};

export const scaleTo = (
  target: DisplayObject,
  toScale: number | { x: number; y: number },
  options: AnimationOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    const scaleObj = typeof toScale === "number" ? { x: toScale, y: toScale } : toScale;

    animate(target.scale, {
      x: scaleObj.x,
      y: scaleObj.y,
      duration: options.duration ?? AppConfig.transitions.duration,
      easing: options.easing ?? AppConfig.transitions.easing,
      delay: options.delay ?? 0,
      onComplete: () => resolve(),
    });
  });
};

export const moveTo = (
  target: DisplayObject,
  toPosition: { x: number; y: number },
  options: AnimationOptions = {}
): Promise<void> => {
  return new Promise((resolve) => {
    animate(target, {
      x: toPosition.x,
      y: toPosition.y,
      duration: options.duration ?? AppConfig.transitions.duration,
      easing: options.easing ?? AppConfig.transitions.easing,
      delay: options.delay ?? 0,
      onComplete: () => resolve(),
    });
  });
};

export const pulse = (target: DisplayObject, maxScale: number = 1.1, options: AnimationOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    const originalScale = { x: target.scale.x, y: target.scale.y };

    animate(target.scale, {
      x: maxScale,
      y: maxScale,
      duration: (options.duration ?? 400) / 2,
      easing: "easeInOutQuad",
      onComplete: () => {
        animate(target.scale, {
          x: originalScale.x,
          y: originalScale.y,
          duration: (options.duration ?? 400) / 2,
          easing: "easeInOutQuad",
          onComplete: () => resolve(),
        });
      },
    });
  });
};

export const shake = (target: DisplayObject, intensity: number = 10, options: AnimationOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    const originalX = target.x;
    const originalY = target.y;

    animate(target, {
      x: [
        originalX,
        originalX - intensity,
        originalX + intensity,
        originalX - intensity,
        originalX + intensity,
        originalX,
      ],
      y: [
        originalY,
        originalY - intensity,
        originalY + intensity,
        originalY - intensity,
        originalY + intensity,
        originalY,
      ],
      duration: options.duration ?? 500,
      easing: "easeInOutQuad",
      onComplete: () => resolve(),
    });
  });
};

export const rotateTo = (target: DisplayObject, toRotation: number, options: AnimationOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    animate(target, {
      rotation: toRotation,
      duration: options.duration ?? AppConfig.transitions.duration,
      easing: options.easing ?? AppConfig.transitions.easing,
      delay: options.delay ?? 0,
      onComplete: () => resolve(),
    });
  });
};

export const bounce = (target: DisplayObject, options: AnimationOptions = {}): Promise<void> => {
  return new Promise((resolve) => {
    const originalY = target.y;

    animate(target, {
      y: originalY - 30,
      duration: (options.duration ?? 600) / 2,
      easing: "easeOutQuad",
      onComplete: () => {
        animate(target, {
          y: originalY,
          duration: (options.duration ?? 600) / 2,
          easing: "easeOutBounce",
          onComplete: () => resolve(),
        });
      },
    });
  });
};

export const sequence = async (animations: Array<() => Promise<void>>): Promise<void> => {
  for (const animation of animations) {
    await animation();
  }
};

export const parallel = async (animations: Array<() => Promise<void>>): Promise<void> => {
  await Promise.all(animations.map((anim) => anim()));
};

export const slideIn = (
  target: DisplayObject,
  from: "left" | "right" | "top" | "bottom",
  distance: number = 100,
  options: AnimationOptions = {}
): Promise<void> => {
  const originalX = target.x;
  const originalY = target.y;

  switch (from) {
    case "left":
      target.x = originalX - distance;
      break;
    case "right":
      target.x = originalX + distance;
      break;
    case "top":
      target.y = originalY - distance;
      break;
    case "bottom":
      target.y = originalY + distance;
      break;
  }

  return moveTo(target, { x: originalX, y: originalY }, options);
};

export const popIn = (target: DisplayObject, options: AnimationOptions = {}): Promise<void> => {
  target.scale.set(0);
  return scaleTo(target, 1, {
    ...options,
    easing: options.easing ?? "easeOutBack",
  });
};

export const stagger = async (
  targets: Container[],
  animationFn: (target: Container) => Promise<void>,
  staggerDelay: number = 100
): Promise<void> => {
  for (let i = 0; i < targets.length; i++) {
    await new Promise((resolve) => setTimeout(resolve, staggerDelay));
    void animationFn(targets[i]);
  }
};
