import { animate } from "animejs";
import { Card } from "../components/Card";
import { Scene } from "../core/Scene";

interface CardDeck {
  cards: Card[];
  x: number;
  y: number;
  index: number;
  isCollecting: boolean;
}

const NUM_DECKS = 12;
const CARDS_PER_DECK = 24;

const DECKS_POSITIONS = [
  { x: 400, y: 90 },
  { x: 500, y: 126 },
  { x: 600, y: 200 },
  { x: 630, y: 325 },
  { x: 600, y: 450 },
  { x: 500, y: 473 },
  { x: 400, y: 500 },
  { x: 300, y: 473 },
  { x: 200, y: 450 },
  { x: 170, y: 325 },
  { x: 200, y: 200 },
  { x: 300, y: 126 },
];
const CARD_OFFSET_Y = 1;
const CARD_OFFSET_X = 1;
const MOVE_INTERVAL = 1000;
const ANIMATION_DURATION = 2000;

const TASK_1_TITLE = "Task 1: Card Stack Animation";
export class Task1Scene extends Scene {
  private decks: CardDeck[] = [];
  private moveTimer: number = 0;
  private isAnimating: boolean = false;

  constructor() {
    super();
    this.initializeDecks();
  }

  init(): void {
    this.addTitle(TASK_1_TITLE);
    this.createCards();
  }

  update(delta: number): void {
    if (this.getIsPaused() || this.isAnimating) return;

    this.moveTimer += delta * (1000 / 60);

    if (this.moveTimer >= MOVE_INTERVAL) {
      this.moveTimer = 0;
      void this.moveAllCards();
    }
  }

  reset(): void {
    this.decks.forEach((deck) => {
      deck.cards.forEach((card) => card.destroy());
      deck.cards = [];
      deck.isCollecting = deck.index % 2 === 1;
    });

    this.moveTimer = 0;
    this.isAnimating = false;

    this.removeChildren();
    this.createCards();
    this.addTitle(TASK_1_TITLE);
  }

  private initializeDecks(): void {
    this.decks = DECKS_POSITIONS.map((pos, index) => ({
      cards: [],
      x: pos.x,
      y: pos.y,
      index,
      isCollecting: index % 2 === 1,
    }));
  }

  private createCards(): void {
    let cardIndex = 0;

    for (let deckIndex = 0; deckIndex < NUM_DECKS; deckIndex += 2) {
      const deck = this.decks[deckIndex];

      for (let i = 0; i < CARDS_PER_DECK; i++) {
        const cardNumber = (cardIndex % 13) + 1;
        const cardSuit = deckIndex / 2 + 1;
        const card = new Card(cardNumber, cardSuit);

        card.x = deck.x + i * CARD_OFFSET_X;
        card.y = deck.y - i * CARD_OFFSET_Y;

        this.addChild(card);
        deck.cards.push(card);
        cardIndex++;
      }
    }
  }

  private async moveAllCards(): Promise<void> {
    this.isAnimating = true;

    const givingDecks = this.decks.filter((deck) => !deck.isCollecting);
    const allGivingDecksEmpty = givingDecks.every((deck) => deck.cards.length === 0);

    if (allGivingDecksEmpty) {
      this.decks.forEach((deck) => {
        deck.isCollecting = !deck.isCollecting;
      });
    }

    const cardMoves: Array<{
      card: Card;
      sourceDeck: CardDeck;
      destDeck: CardDeck;
      destX: number;
      destY: number;
    }> = [];

    for (const sourceDeck of this.decks) {
      if (sourceDeck.isCollecting || sourceDeck.cards.length === 0) continue;

      const card = sourceDeck.cards.pop();
      if (!card) continue;

      const destDeckIndex = (sourceDeck.index + 1) % NUM_DECKS;
      const destDeck = this.decks[destDeckIndex];

      if (!destDeck.isCollecting) {
        sourceDeck.cards.push(card);
        continue;
      }

      const destX = destDeck.x + destDeck.cards.length * CARD_OFFSET_X;
      const destY = destDeck.y - destDeck.cards.length * CARD_OFFSET_Y;

      cardMoves.push({ card, sourceDeck, destDeck, destX, destY });
    }

    if (cardMoves.length === 0) {
      this.isAnimating = false;
      return;
    }

    const animationPromises = cardMoves.map(({ card, destX, destY }) => {
      card.isOpened ? card.close() : card.open();

      return this.animateCardMovement(card, destX, destY);
    });

    await Promise.all(animationPromises);

    cardMoves.forEach(({ card, destDeck }) => {
      destDeck.cards.push(card);
    });

    this.isAnimating = false;
  }

  private animateCardMovement(card: Card, toX: number, toY: number): Promise<void> {
    return new Promise((resolve) => {
      this.setChildIndex(card, this.children.length - 1);

      animate(card, {
        x: toX,
        y: toY,
        duration: ANIMATION_DURATION,
        easing: "easeInOutCubic",
        onComplete: () => resolve(),
      });
    });
  }
}
