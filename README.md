# PixiJS Animation Scenes

_~Generated~ Handwritten by Birdman_

_This project is a test task from SoftGames._

## Project

The project is about showcasing 3 different animation scenes using Scene Management system. It's also adaptive under different devices and has a performance monitoring (FPS only).

## Teck Stack

- **PixiJS 7.4.2**
- **TypeScript 5.3.3**
- **Vite 5.0.7**
- **AnimJS 4.2.2**
- **@armathai/pixi-grid 6.0.1** (very small community supported package)
- **@pixi/particle-emitter 5.0.8** - (I really hope won't be using it any more)

## Features

### Scene System

- **Scene Manager** - Handles scenes and their transitions
- **Scene Wrapper** - Responsive layout
- **Hot-swappable Scenes** - Transition between scenes with an option to restart them

### Animations

1. **Task 1** - Card deck animation with 144 sprites moving between 12 circular decks
2. **Task 2** - Scrollable group chat with custom emoji support and API integration
3. **Task 3** - Fire particle effects with animated sprite sequences and particle emitter

### UI Components

- Menu for scene selection
- Real-time FPS counter
- Responsive layout
- Texture atlas system

## Architecture

**MVC-inspired pattern:**

- `App.ts` - Entry point, asset loading
- `Controller.ts` - Coordinates scene manager and UI
- `SceneManager.ts` - Handles scene transitions and lifecycle
- `Scene.ts` - Abstract base class for all scenes

## Controls

- **Menu Buttons** - Switch between Tasks
- **Restart Toggle** - Reset scenes on switch
