import { Application, Assets, Spritesheet } from "pixi.js";
import { ATLASES } from "./assets/assetsNames/atlases";
import { IMAGES } from "./assets/assetsNames/images";
import { SPRITESHEET } from "./assets/assetsNames/spritesheets";
import { AppConfig } from "./configs/AppConfig";
import { ScreenSizeConfig } from "./configs/ScreenSizeConfig";
import { Controller } from "./core/Controller";
import MainStage from "./core/Stage";
import { fitDimension } from "./utils/functions";

export class App extends Application {
  public stage: MainStage;
  private controller: Controller | null = null;

  constructor() {
    super({
      width: AppConfig.canvas.width,
      height: AppConfig.canvas.height,
      backgroundColor: AppConfig.canvas.backgroundColor,
      antialias: true,
      resolution: window.devicePixelRatio || 1,
      autoDensity: true,
    });
    this.stage = new MainStage();
  }

  async init(): Promise<void> {
    (this.view as HTMLCanvasElement).classList.add("app");
    document.body.appendChild(this.view as HTMLCanvasElement);

    await this.loadAssets();
    this.controller = new Controller(this.stage);
    this.ticker.add((delta) => this.update(delta));
    this.appResize();
  }

  appResize(): void {
    const { clientWidth: w, clientHeight: h } = document.body;
    if (w === 0 || h === 0) return;

    const { min, max } = ScreenSizeConfig.size.ratio;
    const { width, height } = fitDimension({ width: w, height: h }, min, max);

    this.resizeCanvas(width, height);
    this.resizeRenderer(width, height);
    this.stage.resize();
  }

  private async loadAssets(): Promise<void> {
    for (const image of IMAGES) {
      const { name, path } = image;
      await Assets.load({ alias: name, src: path });
    }

    await Assets.load("https://pixijs.com/assets/spritesheet/mc.json");

    for (const atlas of ATLASES) {
      const { name, img, json } = atlas;
      const sheetTexture = await Assets.load({ alias: `${name}.png`, src: img });
      SPRITESHEET[name] = new Spritesheet(sheetTexture, json);
      await SPRITESHEET[name].parse();
    }
  }

  private resizeCanvas(width: number, height: number): void {
    const view = this.view as HTMLCanvasElement;
    const { style } = view;

    style.width = `${width}px`;
    style.height = `${height}px`;
  }

  private resizeRenderer(width: number, height: number): void {
    this.renderer.resize(width, height);
  }

  private update(delta: number): void {
    this.controller?.update(delta);
  }
}
