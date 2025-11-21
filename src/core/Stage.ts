import { Container } from "pixi.js";
import { SceneWrapper } from "./SceneWrapper";
import { UIWrapper } from "./UIWrapper";

class MainStage extends Container {
  private sceneContainer: SceneWrapper;
  private uiContainer: UIWrapper;

  constructor() {
    super();
    this.sceneContainer = new SceneWrapper();
    this.uiContainer = new UIWrapper();

    this.addChild(this.sceneContainer);
    this.addChild(this.uiContainer);
  }

  getSceneContainer(): SceneWrapper {
    return this.sceneContainer;
  }

  getUiContainer(): UIWrapper {
    return this.uiContainer;
  }

  resize(): void {
    this.sceneContainer?.rebuild();
    this.uiContainer?.rebuild();
  }
}
export default MainStage;
