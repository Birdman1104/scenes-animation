import { Container, Sprite, Text, Texture } from "pixi.js";
import { ScenesConfig } from "../configs/ScenesConfig";
import { getButtonLabelTextConfig, getRestartToggleLabelTextConfig } from "../configs/TextConfigs";
import { makeSprite, makeText } from "../utils/functions";

export class Button extends Container {
  private bkg: Sprite;
  private label: Text;

  public isActive: boolean = false;

  constructor(public readonly id: string, label: string) {
    super();

    this.bkg = makeSprite({ frame: "btn_up.png" });

    this.label = makeText(getButtonLabelTextConfig(label));
    this.addChild(this.bkg, this.label);

    this.bkg.eventMode = "static";
    this.bkg.on("pointerdown", () => this.emit("buttonClick", this.id));
  }

  updateBkg(): void {
    this.bkg.texture = Texture.from(this.isActive ? "btn_selected.png" : "btn_up.png");
  }
}

export class Menu extends Container {
  private buttons: Button[] = [];
  private onTaskSelect: MenuCallback;
  private currentTaskId: string | null = null;
  private restartOnSwitch: boolean = false;

  private readonly BUTTON_SPACING = 10;

  constructor(onTaskSelect: MenuCallback) {
    super();
    this.onTaskSelect = onTaskSelect;
    this.createMenu();
  }

  shouldRestartOnSwitch(): boolean {
    return this.restartOnSwitch;
  }

  getCurrentTaskId(): string | null {
    return this.currentTaskId;
  }

  private createMenu(): void {
    const startX = 0;
    const startY = 15;

    ScenesConfig.forEach((task, index) => {
      const button = new Button(task.name, task.label);
      button.position.set(startX + (this.BUTTON_SPACING + button.width) * index, startY);
      button.on("buttonClick", (id: string) => this.onButtonClick(id));
      this.buttons.push(button);
      this.addChild(button);
    });

    const restartButton = this.createRestartToggle(680, 15);
    this.addChild(restartButton);
  }

  private async onButtonClick(id: string): Promise<void> {
    const switchSuccess = await this.onTaskSelect(id);
    if (switchSuccess) {
      this.setActiveTask(id);
    }
  }

  private createRestartToggle(x: number, y: number): Container {
    const container = new Container();
    container.position.set(x, y);

    const checkbox = makeSprite({ frame: "checkbox.png" });
    const checkMark = makeSprite({ frame: "checkmark.png" });
    checkMark.visible = false;

    const label = makeText(getRestartToggleLabelTextConfig());

    container.addChild(checkbox, checkMark, label);

    checkbox.eventMode = "static";
    checkbox.cursor = "pointer";

    let isChecked = false;
    checkbox.on("pointerdown", () => {
      isChecked = !isChecked;
      checkMark.visible = isChecked;
      this.restartOnSwitch = isChecked;
    });

    return container;
  }

  setActiveTask(taskId: string): void {
    this.buttons.forEach((button) => {
      button.isActive = button.id === taskId;
      button.updateBkg();
    });
    this.currentTaskId = taskId;
  }
}
