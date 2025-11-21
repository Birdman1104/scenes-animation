import { Scene } from "../core/Scene";
import { Task1Scene } from "../scenes/Task1Scene";
import { Task2Scene } from "../scenes/Task2Scene";
import { Task3Scene } from "../scenes/Task3Scene";

interface SceneConfig {
  name: string;
  class: new () => Scene;
  label: string;
}

export const ScenesConfig: ReadonlyArray<SceneConfig> = [
  {
    name: "task1",
    class: Task1Scene,
    label: "Task 1",
  },
  {
    name: "task2",
    class: Task2Scene,
    label: "Task 2",
  },
  {
    name: "task3",
    class: Task3Scene,
    label: "Task 3",
  },
];
