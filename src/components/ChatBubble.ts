import { Container, Graphics, NineSlicePlane, Sprite, Texture } from "pixi.js";
import { getInitialTextConfig, getNameTextConfig, getTextElementConfig } from "../configs/TextConfigs";
import { AVATARS_MAP, CHAT_WIDTH, EMOJIS_MAP } from "../scenes/Task2Scene";
import { makeText } from "../utils/functions";

const EMOJI_SIZE = 24;
const AVATAR_RADIUS = 20;

const getColorFromName = (name: string): number => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 0xffffff;
};
class Avatar extends Container {
  constructor(name: string, speakerColor: number) {
    super();

    const avatarCircle = new Graphics();
    avatarCircle.beginFill(speakerColor);
    avatarCircle.drawCircle(0, 0, AVATAR_RADIUS);
    avatarCircle.endFill();
    this.addChild(avatarCircle);

    if (AVATARS_MAP[name]) {
      const avatar = Sprite.from(Texture.from(AVATARS_MAP[name]));
      avatar.anchor.set(0.5);
      avatar.y = -5;
      avatar.scale.set((AVATAR_RADIUS * 2) / avatar.width, (AVATAR_RADIUS * 2) / avatar.height);
      this.addChild(avatar);
    } else {
      const initial = makeText(getInitialTextConfig(name[0]));
      this.addChild(initial);
    }
  }
}

export class ChatBubble extends Container {
  constructor(message: DialogueMessage) {
    super();
    const speakerColor = getColorFromName(message.name);

    const avatar = new Avatar(message.name, speakerColor);
    this.addChild(avatar);

    const nameText = makeText(getNameTextConfig(message.name, avatar.width + 10, speakerColor));
    this.addChild(nameText);

    const messageContent = this.createMessageContent(message.text);
    const bubbleWidth = Math.min(messageContent.width + 15, CHAT_WIDTH - 100);

    const bubbleHeight = messageContent.height + 20;

    const bubble = new NineSlicePlane(Texture.from("speech_bubble.png"), 14, 14, 14, 14);
    bubble.width = bubbleWidth;
    bubble.height = bubbleHeight;
    avatar.position.set(avatar.width / 2, 10 + avatar.height / 2);
    bubble.position.set(avatar.x + avatar.width / 2 + 10, 10);

    this.addChild(bubble);

    messageContent.position.set(10, 10);
    bubble.addChild(messageContent);
  }

  private createMessageContent(text: string): Container {
    const container = new Container();
    const parts = this.parseTextWithEmojis(text);
    let currentX = 0;
    let currentY = 0;
    const maxWidth = CHAT_WIDTH - 50;
    const lineHeight = 26;

    for (const part of parts) {
      if (part.type === "text" && part.content) {
        const textElement = makeText(getTextElementConfig(part.content + " ", 0xffffff));

        if (currentX + textElement.width > maxWidth) {
          currentX = 0;
          currentY += lineHeight;
        }

        textElement.position.set(currentX, currentY);
        container.addChild(textElement);
        currentX += textElement.width;
      } else if (part.type === "emoji" && EMOJIS_MAP[part.content]) {
        const emoji = this.createCustomEmoji(part.content);

        if (currentX + EMOJI_SIZE > maxWidth) {
          currentX = 0;
          currentY += lineHeight;
        }

        emoji.x = currentX;
        emoji.y = currentY - 2;
        container.addChild(emoji);
        currentX += EMOJI_SIZE + 5;
      }
    }

    return container;
  }

  private createCustomEmoji(emojiName: string): Container {
    const container = new Container();

    if (EMOJIS_MAP[emojiName]) {
      const emoji = Sprite.from(EMOJIS_MAP[emojiName]);
      emoji.scale.set(EMOJI_SIZE / emoji.width, EMOJI_SIZE / emoji.height);
      container.addChild(emoji);
    }
    return container;
  }

  private parseTextWithEmojis(text: string): Array<{ type: "text" | "emoji"; content: string }> {
    const parts: Array<{ type: "text" | "emoji"; content: string }> = [];
    const emojiRegex = /\{(\w+)\}/g;
    let lastIndex = 0;
    let match;

    while ((match = emojiRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: "text", content: text.substring(lastIndex, match.index) });
      }
      parts.push({ type: "emoji", content: match[1] });
      lastIndex = match.index + match[0].length;
    }

    if (lastIndex < text.length) {
      parts.push({ type: "text", content: text.substring(lastIndex) });
    }

    return parts;
  }
}
