import { type } from "os";

export type String = string;
export type Boolean = boolean;
export type Number = number;

export interface App {
	gameMode: {
		online: string;
		offline: string;
	};
	player: {
		name: string;
		image: string;
	};
	opponent: {
		name: string;
		image: string;
	};
	imageArray: string[];
}
export interface Game {
	playerReturnUrl: string;
	getGameSettingUrl: string;

	chessGameId: number;

	verifyToken: string;
}
