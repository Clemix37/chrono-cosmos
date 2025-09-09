import GameStateManager from "../src/content/Classes/GameStateManager";
import Spaceship from "../src/content/Classes/Spaceship";
import { GameStatus } from "../src/content/utils/constants";
import { getDefaultConfig } from "../src/content/utils/utils";

test("it should change config status to over", () => {
	GameStateManager.config = getDefaultConfig();
	GameStateManager.changeStatus(GameStatus.over);
	expect(GameStateManager.config.status).toBeDefined();
	expect(GameStateManager.config.status).toBe(GameStatus.over);
});

test("it should upgrade spaceship from level 1 to level 2", () => {
	GameStateManager.spaceship = new Spaceship({ level: 1 });
	GameStateManager.upgradeSpaceship();
	expect(GameStateManager.spaceship.level).toBeDefined();
	expect(GameStateManager.spaceship.level).toBe(2);
});
