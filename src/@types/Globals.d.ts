declare module "stats.js";
interface Window {
  game: Application;
}

type Dimensions = {
  width: number;
  height: number;
};

type MenuCallback = (taskId: string) => Promise<boolean>;

type SpriteConfig = {
  frame: string;
  atlas?: string;
  x?: number;
  y?: number;
  scaleX?: number;
  scaleY?: number;
  anchor?: Point;
  tint?: number;
  alpha?: number;
  rotation?: number;
  name?: string;
};

interface TextConfig {
  text: string;
  x?: number;
  y?: number;
  alpha?: number;
  anchor?: { x: number; y: number };
  style: Partial<ITextStyle>;
}

interface DialogueMessage {
  name: string;
  text: string;
}

type EmojiEntry = {
  name: string;
  url: string;
};

type AvatarEntry = {
  name: string;
  url: string;
  position: "left" | "right";
};

type DialogueData = {
  dialogue: DialogueMessage[];
  emojies: EmojiEntry[];
  avatars: AvatarEntry[];
};
