import { Container, Rectangle } from "pixi.js";
import { getTitleTextConfig } from "../configs/TextConfigs";
import { makeText } from "../utils/functions";

export abstract class Scene extends Container {
  protected isActive: boolean = false;
  protected isPaused: boolean = false;

  constructor() {
    super();
    this.visible = false;
  }

  protected addTitle(title: string): void {
    const titleText = makeText(getTitleTextConfig(title));
    this.addChild(titleText);
  }

  abstract init(): void;
  abstract reset(): void;
  abstract update(delta: number): void;

  getBounds(): Rectangle {
    return new Rectangle(0, 0, 800, 600);
  }

  getIsActive(): boolean {
    return this.isActive;
  }

  getIsPaused(): boolean {
    return this.isPaused;
  }

  activate(): void {
    this.isActive = true;
    this.isPaused = false;
    this.visible = true;
    this.alpha = 0;
  }

  deactivate(): void {
    this.isActive = false;
    this.visible = false;
  }

  pause(): void {
    this.isPaused = true;
  }

  resume(): void {
    this.isPaused = false;
  }
}
