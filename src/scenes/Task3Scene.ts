import * as particles from "@pixi/particle-emitter";
import { AnimatedSprite, Container, Texture } from "pixi.js";
import { getParticleConfig } from "../configs/emitter";
import { Scene } from "../core/Scene";
import { makeSprite } from "../utils/functions";

const TASK_3_TITLE = "Task 3: Is the world on fire?";

export class Task3Scene extends Scene {
  private time: number = 0;
  private emitter: particles.Emitter | null = null;
  private particleContainer: Container = new Container();

  constructor() {
    super();
  }

  init(): void {
    this.addTitle(TASK_3_TITLE);
    this.initFirstFire();
    this.initSecondFire();
  }

  update(delta: number): void {
    if (this.getIsPaused()) return;

    this.emitter?.update(delta * 0.02);
    this.time += delta;
  }

  reset(): void {
    this.time = 0;
    this.removeChildren();
    this.init();
  }

  private initFirstFire(): void {
    const explosionTextures = [];
    let i;

    for (i = 0; i < 26; i++) {
      const texture = Texture.from(`Explosion_Sequence_A ${i + 1}.png`);
      explosionTextures.push(texture);
    }

    const setSpritePosition = (sprite: AnimatedSprite) => {
      sprite.x = (Math.random() * this.width) / 2;
      sprite.y = Math.random() * (this.height - 50) + 120;
    };

    for (i = 0; i < 5; i++) {
      const explosion = new AnimatedSprite(explosionTextures);

      setSpritePosition(explosion);
      explosion.anchor.set(0.5);
      explosion.rotation = Math.random() * Math.PI;
      explosion.scale.set(0.5 + Math.random() * 0.5);
      explosion.gotoAndPlay(Math.floor(Math.random() * 26));
      explosion.onLoop = () => setSpritePosition(explosion);
      this.addChild(explosion);
    }
  }

  private initSecondFire(): void {
    const torch = makeSprite({ frame: "torch.png", scaleX: 0.5, scaleY: 0.5, x: 600, y: 400 });
    this.addChild(torch);

    this.particleContainer = new Container();
    this.particleContainer.position.set(torch.x, torch.y - torch.height / 2);
    this.addChild(this.particleContainer);
    this.emitter = new particles.Emitter(this.particleContainer, getParticleConfig(Texture.from("particle.png")));
    this.emitter.emit = true;
  }
}
