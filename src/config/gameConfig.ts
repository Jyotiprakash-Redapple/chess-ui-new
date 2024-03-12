import { Game } from "../typo/typo";

export const  baseUrl = "http://3.137.86.237:5000"
export const gameConfig: Game = {
	chessGameId: 25
	playerReturnUrl: baseUrl + "/api/v2/player-return",
	getGameSettingUrl: baseUrl + "/api/v2/game-setting",
	verifyToken: baseUrl +"/api/v2/verify-game-token"
	
};
