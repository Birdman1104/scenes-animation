import { Container, Rectangle, Sprite } from "pixi.js";
import { scaleTo, sequence } from "../utils/animations";
import { makeSprite } from "../utils/functions";

const easing = "linear";
const duration = 1000;

export class Card extends Container {
  private readonly card: Sprite;
  private readonly back: Sprite;

  public isOpened: boolean = true;

  constructor(cardNumber: number, cardSuit: number) {
    super();
    this.card = makeSprite({ frame: `card_${cardNumber}.png`, atlas: "cards" });
    this.back = makeSprite({ frame: `deck_${cardSuit}.png`, atlas: "cards" });

    this.addChild(this.card, this.back);

    this.back.scale.set(0, 1);
    this.scale.set(0.5);
  }

  public getBounds(): Rectangle {
    return new Rectangle(-this.card.width / 2, -this.card.height / 2, this.card.width, this.card.height);
  }

  close(): void {
    this.isOpened = false;
    sequence([
      () => scaleTo(this.card, { x: 0, y: 1 }, { duration, easing }),
      () => scaleTo(this.back, { x: 1, y: 1 }, { duration, easing }),
    ]);
  }

  open(): void {
    this.isOpened = true;
    sequence([
      () => scaleTo(this.back, { x: 0, y: 1 }, { duration, easing }),
      () => scaleTo(this.card, { x: 1, y: 1 }, { duration, easing }),
    ]);
  }
}
