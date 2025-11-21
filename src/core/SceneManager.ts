import { Graphics } from "pixi.js";
import { fadeIn, fadeOut } from "../utils/animations";
import { Scene } from "./Scene";
import { SceneWrapper } from "./SceneWrapper";

export class SceneManager {
  private scenes: Map<string, Scene> = new Map();
  private currentScene: Scene | null = null;
  private currentSceneId: string | null = null;
  private container: SceneWrapper;
  private isTransitioning: boolean = false;
  private fadeOverlay: Graphics;

  constructor(container: SceneWrapper) {
    this.container = container;

    this.fadeOverlay = new Graphics();
    this.fadeOverlay.beginFill(0x000000);
    this.fadeOverlay.drawRect(0, 0, 4000, 4000);
    this.fadeOverlay.endFill();
    this.fadeOverlay.alpha = 0;
    this.fadeOverlay.visible = false;
    this.fadeOverlay.name = "fadeOverlay";
    this.container.addChild(this.fadeOverlay);
  }

  getCurrentSceneId(): string | null {
    return this.currentSceneId;
  }

  getScene(id: string): Scene | undefined {
    return this.scenes.get(id);
  }

  getIsTransitioning(): boolean {
    return this.isTransitioning;
  }

  addScene(id: string, scene: Scene): void {
    if (this.scenes.has(id)) {
      console.warn(`Scene with id "${id}" already exists. Overwriting.`);
    }
    this.scenes.set(id, scene);
    this.container.setChildAt(id, scene);
    scene.init();
  }

  async switchTo(id: string, shouldRestart: boolean = false): Promise<boolean> {
    if (this.isTransitioning) {
      console.warn("Scene transition already in progress");
      return false;
    }

    if (!this.scenes.has(id)) {
      console.error(`Scene "${id}" not found`);
      return false;
    }

    if (this.currentSceneId === id) {
      console.log("Already on this scene");
      return false;
    }

    this.isTransitioning = true;
    const nextScene = this.scenes.get(id)!;

    try {
      if (this.currentScene) {
        await fadeOut(this.currentScene);
        this.currentScene.deactivate();

        shouldRestart ? this.currentScene.reset() : this.currentScene.pause();
      }

      shouldRestart ? nextScene.reset() : nextScene.resume();
      nextScene.activate();
      this.currentScene = nextScene;
      this.currentSceneId = id;

      await fadeIn(nextScene);
      return true;
    } catch (error) {
      console.error("Error during scene transition:", error);
      return false;
    } finally {
      this.isTransitioning = false;
    }
  }

  update(delta: number): void {
    if (this.currentScene && !this.currentScene.getIsPaused() && !this.isTransitioning) {
      this.currentScene.update(delta);
    }
  }
}
