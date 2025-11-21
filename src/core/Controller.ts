import { FPSCounter } from "../components/FPSCounter";
import { ScenesConfig } from "../configs/ScenesConfig";
import { Menu } from "../ui/Menu";
import { getViewByProperty } from "../utils/functions";
import { SceneManager } from "./SceneManager";

import MainStage from "./Stage";

export class Controller {
  private readonly sceneManager: SceneManager;
  private readonly menu: Menu;
  private fpsCounter: FPSCounter | null = null;

  constructor(private readonly stage: MainStage) {
    this.sceneManager = new SceneManager(this.stage.getSceneContainer());
    this.initializeScenes();

    this.menu = new Menu((taskId: string) => this.onTaskSelected(taskId));
    this.stage.getUiContainer().setChildAt("menu", this.menu);

    this.sceneManager.switchTo("task1", false);
    this.menu.setActiveTask("task1");

    this.fpsCounter = getViewByProperty("viewName", "fpsCounter");
  }

  update(delta: number): void {
    this.sceneManager.update(delta);
    this.fpsCounter?.update(delta);
  }

  private initializeScenes(): void {
    ScenesConfig.forEach(({ name, class: SceneClass }) => {
      const scene = new SceneClass();
      this.sceneManager.addScene(name, scene);
    });
  }

  private async onTaskSelected(taskId: string): Promise<boolean> {
    const shouldRestart = this.menu.shouldRestartOnSwitch();
    return await this.sceneManager.switchTo(taskId, shouldRestart ?? false);
  }
}
