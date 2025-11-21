import { App } from "./App";

window.addEventListener("DOMContentLoaded", () => {
  window.game = new App();
  window.game.init();
  // @ts-ignore
  if (process.env.NODE_ENV !== "production") {
    // @ts-ignore
    globalThis.__PIXI_APP__ = window.game;
  }

  window.addEventListener("resize", () => window.game.appResize());
});
