import { Container, Rectangle, Text } from "pixi.js";
import { getFPSCounterTextConfig } from "../configs/TextConfigs";
import { makeText } from "../utils/functions";

const FPS_HISTORY_SIZE = 60;
export class FPSCounter extends Container {
  private fpsText: Text;
  private fpsHistory: number[] = [];

  constructor() {
    super();

    this.fpsText = makeText(getFPSCounterTextConfig());
    this.addChild(this.fpsText);
  }

  get viewName(): string {
    return "fpsCounter";
  }

  getBounds(): Rectangle {
    return new Rectangle(0, 0, 80, 40);
  }

  update(delta: number): void {
    const fps = Math.round(60 / delta);

    this.fpsHistory.push(fps);
    if (this.fpsHistory.length > FPS_HISTORY_SIZE) {
      this.fpsHistory.shift();
    }

    const averageFps = Math.round(this.fpsHistory.reduce((sum, value) => sum + value, 0) / this.fpsHistory.length);

    this.fpsText.text = `FPS: ${averageFps}`;

    if (averageFps >= 55) {
      this.fpsText.style.fill = 0x00ff00;
    } else if (averageFps >= 30) {
      this.fpsText.style.fill = 0xffaa00;
    } else {
      this.fpsText.style.fill = 0xff0000;
    }
  }
}
