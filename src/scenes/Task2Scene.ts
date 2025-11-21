import { Container, FederatedPointerEvent, Graphics, NineSlicePlane, Texture } from "pixi.js";
import { ChatBubble } from "../components/ChatBubble";
import { getGroupChatNameTextConfig } from "../configs/TextConfigs";
import { Scene } from "../core/Scene";
import { fadeIn } from "../utils/animations";
import { makeText } from "../utils/functions";

const MESSAGE_SPACING = 75;
const ANIMATION_DELAY = 300;
export const CHAT_WIDTH = 700;
const CHAT_HEIGHT = 480;
const CHAT_CONTENT_Y = 135;
const SCROLL_SPEED = 10;
const FETCH_URL = "https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords";

export const AVATARS_MAP: Record<string, string> = {};
export const EMOJIS_MAP: Record<string, string> = {};

const TASK_2_TITLE = "Task 2: Group Chat";
export class Task2Scene extends Scene {
  private dialogueContainer: Container;
  private chatContentContainer: Container;
  private scrollBar: Graphics;
  private scrollThumb: Graphics;
  private messages: DialogueMessage[] = [];
  private currentMessageIndex: number = 0;
  private animationTimer: number = 0;
  private scrollY: number = 0;
  private maxScrollY: number = 0;
  private isDragging: boolean = false;
  private messageBubbles: Container[] = [];

  constructor() {
    super();
    this.dialogueContainer = new Container();
    this.chatContentContainer = new Container();
    this.scrollBar = new Graphics();
    this.scrollThumb = new Graphics();
  }

  init(): void {
    this.addTitle(TASK_2_TITLE);
    this.addChatBackground();
    this.addChatTitle();
    this.setupScrollableArea();
    this.addScrollBar();
    this.setupScrollListeners();
    this.loadDialogueData();
  }

  update(delta: number): void {
    if (this.getIsPaused()) return;

    if (this.currentMessageIndex < this.messages.length) {
      this.animationTimer += delta * (1000 / 60);

      if (this.animationTimer >= ANIMATION_DELAY) {
        this.animationTimer = 0;
        this.addMessageBubble(this.currentMessageIndex);
        this.currentMessageIndex++;
      }
    }

    this.cullMessages();
  }

  reset(): void {
    this.chatContentContainer.removeChildren();
    this.messageBubbles = [];
    this.currentMessageIndex = 0;
    this.animationTimer = 0;
    this.scrollY = 0;
    this.maxScrollY = 0;

    this.removeChildren();
    this.dialogueContainer = new Container();
    this.chatContentContainer = new Container();
    this.scrollBar = new Graphics();
    this.scrollThumb = new Graphics();
    this.init();
  }

  private addChatBackground(): void {
    const bg = new NineSlicePlane(Texture.from("chat_bkg.png"), 17, 47, 17, 17);
    bg.width = CHAT_WIDTH;
    bg.height = CHAT_HEIGHT + 15;
    bg.position.set(50, 70);
    this.addChild(bg);
  }

  private addChatTitle(): void {
    const chatTitle = makeText(getGroupChatNameTextConfig());
    this.addChild(chatTitle);
  }

  private setupScrollableArea(): void {
    this.dialogueContainer.addChild(this.chatContentContainer);
    this.dialogueContainer.position.set(60, CHAT_CONTENT_Y);

    const mask = new Graphics();
    mask.beginFill(0xffffff);
    mask.drawRect(50, CHAT_CONTENT_Y - 15, CHAT_WIDTH - 40, CHAT_HEIGHT - 40);
    mask.endFill();
    this.addChild(mask);
    this.dialogueContainer.mask = mask;

    this.addChild(this.dialogueContainer);
  }

  private addScrollBar(): void {
    this.scrollBar.beginFill(0x2a2a3e, 0.5);
    this.scrollBar.drawRoundedRect(0, 0, 8, CHAT_HEIGHT - 60, 4);
    this.scrollBar.endFill();
    this.scrollBar.position.set(735, CHAT_CONTENT_Y);
    this.addChild(this.scrollBar);

    this.updateScrollThumb();
    this.addChild(this.scrollThumb);
  }

  private updateScrollThumb(): void {
    const contentHeight = this.currentMessageIndex * MESSAGE_SPACING;
    const visibleHeight = CHAT_HEIGHT - 60;

    const needsScroll = contentHeight > visibleHeight;
    this.scrollBar.visible = needsScroll;
    this.scrollThumb.visible = needsScroll;

    if (!needsScroll) {
      return;
    }

    this.scrollThumb.clear();
    this.scrollThumb.beginFill(0x4a90e2, 0.8);

    const thumbHeight = Math.max(30, (visibleHeight / contentHeight) * visibleHeight);

    this.scrollThumb.drawRoundedRect(0, 0, 6, thumbHeight, 3);
    this.scrollThumb.endFill();

    const scrollPercentage = this.maxScrollY > 0 ? this.scrollY / this.maxScrollY : 0;
    this.scrollThumb.position.set(736, CHAT_CONTENT_Y + scrollPercentage * (visibleHeight - thumbHeight));
  }

  private setupScrollListeners(): void {
    this.eventMode = "static";
    this.on("wheel", (event: any) => {
      const deltaY = event.deltaY;
      this.scrollBy(deltaY > 0 ? SCROLL_SPEED : -SCROLL_SPEED);
    });

    const scrollableArea = new Graphics();
    scrollableArea.beginFill(0x000000, 0.01);
    scrollableArea.drawRect(50, CHAT_CONTENT_Y, CHAT_WIDTH - 40, CHAT_HEIGHT - 55);
    scrollableArea.endFill();
    scrollableArea.eventMode = "static";
    scrollableArea.cursor = "pointer";

    let dragStartY = 0;
    let scrollStartY = 0;

    scrollableArea.on("pointerdown", (event: FederatedPointerEvent) => {
      this.isDragging = true;
      dragStartY = event.global.y;
      scrollStartY = this.scrollY;
    });

    scrollableArea.on("pointermove", (event: FederatedPointerEvent) => {
      if (this.isDragging) {
        const deltaY = dragStartY - event.global.y;
        this.scrollTo(scrollStartY + deltaY);
      }
    });

    scrollableArea.on("pointerup", () => {
      this.isDragging = false;
    });

    scrollableArea.on("pointerupoutside", () => {
      this.isDragging = false;
    });

    this.addChild(scrollableArea);
  }

  private scrollBy(amount: number): void {
    const contentHeight = this.currentMessageIndex * MESSAGE_SPACING;
    const visibleHeight = CHAT_HEIGHT - 60;

    if (contentHeight <= visibleHeight) {
      return;
    }

    this.scrollTo(this.scrollY + amount);
  }

  private scrollTo(newScrollY: number): void {
    const contentHeight = this.currentMessageIndex * MESSAGE_SPACING;
    const visibleHeight = CHAT_HEIGHT - 60;

    if (contentHeight <= visibleHeight) {
      this.scrollY = 0;
      this.maxScrollY = 0;
      this.chatContentContainer.y = 0;
      this.updateScrollThumb();
      return;
    }

    this.maxScrollY = Math.max(0, contentHeight - visibleHeight + 50);

    this.scrollY = Math.max(0, Math.min(newScrollY, this.maxScrollY));
    this.chatContentContainer.y = -this.scrollY;
    this.updateScrollThumb();
  }

  private async loadDialogueData(): Promise<void> {
    const response = await fetch(FETCH_URL);
    const data: DialogueData = await response.json();

    const { dialogue, emojies, avatars } = data;

    for (const avatar of avatars) {
      AVATARS_MAP[avatar.name] = avatar.url;
      // I admit it, this is not the best way to load the textures
      // I had bugs loading them in the App.ts
      // So this is a workaround to load them here
      Texture.from(avatar.url);
    }

    for (const emoji of emojies) {
      EMOJIS_MAP[emoji.name] = emoji.url;
      Texture.from(emoji.url);
    }

    this.messages = dialogue;
  }

  private addMessageBubble(index: number): void {
    const message = this.messages[index];
    const yPosition = index * MESSAGE_SPACING;

    const bubble = this.createMessageBubble(message, yPosition);
    this.chatContentContainer.addChild(bubble);
    this.messageBubbles.push(bubble);

    bubble.alpha = 0;
    fadeIn(bubble);

    const contentHeight = (index + 1) * MESSAGE_SPACING;
    const visibleHeight = CHAT_HEIGHT - 60;
    if (contentHeight > visibleHeight) {
      this.scrollTo(contentHeight - visibleHeight + 50);
    }
  }

  private createMessageBubble(message: DialogueMessage, y: number): Container {
    const container = new ChatBubble(message);
    container.position.set(0, y);
    return container;
  }

  private cullMessages(): void {
    const visibleHeight = CHAT_HEIGHT - 60;
    const viewportTop = this.scrollY;
    const viewportBottom = this.scrollY + visibleHeight;

    for (let i = 0; i < this.messageBubbles.length; i++) {
      const bubble = this.messageBubbles[i];
      const bubbleTop = i * MESSAGE_SPACING;
      const bubbleBottom = bubbleTop + MESSAGE_SPACING;

      const isVisible = bubbleBottom + MESSAGE_SPACING >= viewportTop && bubbleTop - MESSAGE_SPACING <= viewportBottom;

      bubble.renderable = isVisible;
    }
  }
}
