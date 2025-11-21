import { Container, DisplayObject, Graphics, Point, Rectangle, Sprite, Text, Texture } from "pixi.js";
import { SPRITESHEET } from "../assets/assetsNames/spritesheets";

export const getGameBounds = (): Rectangle => {
  const { clientWidth: width, clientHeight: height } = document.body;
  return new Rectangle(0, 0, width, height);
};

export const lp = <T>(l: T, p: T): T => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h ? l : p;
};

export const isLandscape = (): boolean => {
  const { clientWidth: w, clientHeight: h } = document.body;
  return w > h;
};

export const isSquareLikeScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) > 0.7;
};

export const isNarrowScreen = (): boolean => {
  const { width, height } = getGameBounds();
  return Math.min(width, height) / Math.max(width, height) < 0.5;
};

export const fitDimension = (
  dim: { width: number; height: number },
  minRatio: number,
  maxRatio: number
): { width: number; height: number } => {
  const ratioW = dim.width / dim.height;
  const ratioH = dim.height / dim.width;

  if (ratioW < ratioH) {
    if (ratioW > maxRatio) {
      dim.width = dim.width * (maxRatio / ratioW);
    } else if (ratioW < minRatio) {
      dim.height = dim.height * (ratioW / minRatio);
    }
  } else {
    if (ratioH > maxRatio) {
      dim.height = dim.height * (maxRatio / ratioH);
    } else if (ratioH < minRatio) {
      dim.width = dim.width * (ratioH / minRatio);
    }
  }
  return dim;
};

export const drawBounds = (
  container: Container,
  color: number = Math.floor(0xffffff * Math.random()),
  alpha: number = 0.5
): Graphics => {
  const { x, y, width, height } = container.getBounds();
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawRect(x, y, width, height);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const drawPoint = (
  container: Container,
  x: number,
  y: number,
  radius: number = 5,
  color: number = Math.floor(0xffffff * Math.random()),
  alpha: number = 0.5
): Graphics => {
  const gr = new Graphics();
  gr.beginFill(color, alpha);
  gr.drawCircle(x, y, radius);
  gr.endFill();
  container.addChild(gr);
  return gr;
};

export const getTextureFromSpriteSheet = (atlas: string, key: string): Texture => {
  return SPRITESHEET[atlas].textures[key];
};

export const makeSprite = (config: SpriteConfig): Sprite => {
  const {
    frame,
    atlas = "",
    x = 0,
    y = 0,
    scaleX = 1,
    scaleY = 1,
    anchor = new Point(0.5, 0.5),
    tint = 0xffffff,
    alpha = 1,
    rotation = 0,
    name = "",
  } = config;

  const texture = SPRITESHEET[atlas] ? getTextureFromSpriteSheet(atlas, frame) : Texture.from(frame);

  const sprite = Sprite.from(texture);
  sprite.position.set(x, y);
  sprite.scale.set(scaleX, scaleY);
  sprite.anchor.set(anchor.x, anchor.y);
  sprite.tint = tint;
  sprite.alpha = alpha;
  sprite.rotation = rotation;
  name && (sprite.name = name);
  return sprite;
};

export const makeText = (config: TextConfig, name?: string): Text => {
  const { text: content, x = 0, y = 0, alpha = 1, style = {}, anchor = { x: 0.5, y: 0.5 } } = config;
  const text = new Text(content, style);
  text.position.set(x, y);
  text.anchor.set(anchor.x, anchor.y);
  text.alpha = alpha;
  name && (text.name = name);
  return text;
};

export const getViewByProperty = <T extends DisplayObject = DisplayObject>(
  prop: string,
  value: string,
  parent?: DisplayObject
): T | null => {
  const { children } = parent || window.game.stage;

  if (!children || children.length === 0) {
    return null;
  }

  for (let i = 0; i < children.length; i += 1) {
    const child = children[i];
    if (child[prop] === value) {
      return child;
    }

    const view = getViewByProperty<T>(prop, value, child);
    if (view) {
      return view;
    }
  }

  return null;
};
