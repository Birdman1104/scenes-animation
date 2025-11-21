export const getTitleTextConfig = (text: string): TextConfig => {
  return {
    text: text,
    style: {
      fontFamily: "Arial",
      fontSize: 24,
      fill: 0xffffff,
    },
    anchor: { x: 0, y: 0 },
    x: 20,
    y: 20,
  };
};

export const getInitialTextConfig = (letter: string): TextConfig => {
  return {
    text: letter,
    style: {
      fontFamily: "Arial",
      fontSize: 14,
      fill: 0xffffff,
      fontWeight: "bold",
    },
  };
};

export const getNameTextConfig = (name: string, x: number, color: number): TextConfig => {
  return {
    text: name,
    style: {
      fontFamily: "Arial",
      fontSize: 13,
      fill: color,
      fontWeight: "bold",
    },
    anchor: { x: 0, y: 0 },
    x,
    y: -8,
  };
};

export const getTextElementConfig = (text: string, color: number): TextConfig => {
  return {
    text: text,
    style: {
      fontFamily: "Arial",
      fontSize: 15,
      fill: color,
    },
    anchor: { x: 0, y: 0 },
  };
};

export const getGroupChatNameTextConfig = (): TextConfig => {
  return {
    text: "That weird group chat",
    style: {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
      fontWeight: "bold",
    },
    anchor: { x: 0, y: 0 },
    x: 70,
    y: 83,
  };
};

export const getButtonLabelTextConfig = (label: string): TextConfig => {
  return {
    text: label,
    style: {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
      fontWeight: "bold",
    },
    anchor: { x: 0.5, y: 0.5 },
  };
};

export const getRestartToggleLabelTextConfig = (): TextConfig => {
  return {
    text: "Restart on switch",
    style: {
      fontFamily: "Arial",
      fontSize: 18,
      fill: 0xffffff,
    },
    anchor: { x: 0, y: 0 },
    x: -160,
    y: -11,
  };
};

export const getFPSCounterTextConfig = (): TextConfig => {
  return {
    text: "FPS: 60",
    x: 10,
    y: 10,
    style: {
      fontSize: 14,
      fill: 0x00ff00,
    },
    anchor: { x: 0, y: 0 },
  };
};
