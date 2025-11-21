import { ICellConfig, IPixiChild, PixiGrid } from "@armathai/pixi-grid";
import { FPSCounter } from "../components/FPSCounter";
import { lp } from "../utils/functions";

const getUIWrapperGridConfig = (): ICellConfig => {
  return lp(getUIWrapperGridLandscapeConfig, getUIWrapperGridPortraitConfig).call(null);
};

const getUIWrapperGridLandscapeConfig = (): ICellConfig => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "ui",
    // debug: { color: 0xd95027 },
    bounds,
    cells: [
      {
        name: "fps",
        bounds: { x: 0, y: 0, width: 0.1, height: 0.1 },
      },
      {
        name: "menu",
        bounds: { x: 0.075, y: 0, width: 0.85, height: 0.2 },
      },
    ],
  };
};

const getUIWrapperGridPortraitConfig = (): ICellConfig => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "ui",
    // debug: { color: 0xd95027 },
    bounds,
    cells: [
      {
        name: "fps",
        bounds: { x: 0, y: 0, width: 0.1, height: 0.1 },
      },
      {
        name: "menu",
        bounds: { x: 0.075, y: 0, width: 0.85, height: 0.2 },
      },
    ],
  };
};

export class UIWrapper extends PixiGrid {
  private fpsCounter: FPSCounter;

  constructor() {
    super();
    this.fpsCounter = new FPSCounter();
    this.setChildAt("fps", this.fpsCounter);
  }

  get name(): string {
    return "uiWrapper";
  }

  setChildAt(name: string, child: IPixiChild): void {
    super.setChild(name, child);
  }

  getGridConfig(): ICellConfig {
    return getUIWrapperGridConfig();
  }

  rebuild(): void {
    super.rebuild(this.getGridConfig());
  }
}
