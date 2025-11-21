import { ICellConfig, IPixiChild, PixiGrid } from "@armathai/pixi-grid";
import { ScenesConfig } from "../configs/ScenesConfig";
import { lp } from "../utils/functions";

const taskCellsPortrait = ScenesConfig.map(({ name }) => {
  return {
    name,
    bounds: { x: 0, y: 0.2, width: 1, height: 0.8 },
  };
});

const taskCellsLandscape = ScenesConfig.map(({ name }) => {
  return {
    name,
    bounds: { x: 0, y: 0.2, width: 1, height: 0.8 },
  };
});

const getSceneWrapperGridConfig = (): ICellConfig => {
  return lp(getSceneWrapperGridLandscapeConfig, getSceneWrapperGridPortraitConfig)();
};

const getSceneWrapperGridLandscapeConfig = (): ICellConfig => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "scene",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: taskCellsLandscape,
  };
};

const getSceneWrapperGridPortraitConfig = (): ICellConfig => {
  const bounds = {
    x: 0,
    y: 0,
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  return {
    name: "scene",
    // debug: { color: 0xd9ff27 },
    bounds,
    cells: taskCellsPortrait,
  };
};

export class SceneWrapper extends PixiGrid {
  get name(): string {
    return "sceneWrapper";
  }

  setChildAt(name: string, child: IPixiChild): void {
    super.setChild(name, child);
  }

  getGridConfig(): ICellConfig {
    return getSceneWrapperGridConfig();
  }

  rebuild(): void {
    super.rebuild(this.getGridConfig());
  }
}
