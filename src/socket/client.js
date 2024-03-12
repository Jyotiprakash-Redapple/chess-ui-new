import { io } from "socket.io-client";
import { gameInit, updateBoard, gameTimer, turnTimer, turnUpdate, gameEnd, getUserData, getMatchMakeingData, getCheckStatus } from "../arbitar/context/reducer/move";

class Client {
	constructor(gameSceneInstance) {
		this.gameSceneRefence = gameSceneInstance;
		this.urlParams = new URLSearchParams(window.location.search);
		this.token = this.urlParams.get("auth_token");
		this.baseUrl = "http://3.137.86.237:5002/chessio";
		this.socket = io(this.baseUrl, {
			query: {
				auth_token: this.token,
			},
		});

		this.soundName = null;
		this.user_data = null;

		this._initSocketListeners();
	}
	create() {}

	_initSocketListeners() {
		// console.log('connecting to socket');
		let ref = this;
		this.socket.on("connect", () => {
			console.log("Successfully connected!======>", this.socket.id);
			this.socket.on("user-data", (arg) => {
				this.user_data = arg;
			});
			localStorage.setItem("socketId", this.socket.id);
		});
	}
	getUserDataFromServer(dispatch) {
		dispatch(getUserData(this.user_data));
	}
	getMatchMakeingDataFromServer(dispatch) {
		this.socket.on("matchmacking-data", (arg) => {
			dispatch(getMatchMakeingData(arg));
		});
	}
	getGameInitFromServer(dispatch) {
		this.socket.on("game-start", (arg) => {
			dispatch(gameInit({ arg }));
		});
	}
	getUpdateDetailsFromServer(dispatch) {
		this.socket.on("update-details", (arg) => {
			dispatch(updateBoard({ arg }));
		});
	}
	getUpdateCheckStatusFromServer(dispatch) {
		this.socket.on("check-status-details", (arg) => {
			dispatch(getCheckStatus({ arg }));
		});
	}
	onGmaeTime(dispatch) {
		this.socket.on("gameTimer", (arg) => {
			dispatch(gameTimer(arg));
			// console.log("Game Timer From Server=============>", arg);
		});
	}
	onTurnTimer(dispatch) {
		this.socket.on("turnTimer", (arg) => {
			dispatch(turnTimer(arg));
			// console.log("GameTurnTimer From Server===========>", arg);
		});
	}
	onTurnChange(dispatch) {
		this.socket.on("game-updateTurn", (arg) => {
			dispatch(turnUpdate(arg));
			console.log("GameTurnTimer From Server===========>", arg);
		});
	}
	onUpdateMove(cur_game) {
		this.socket.emit("update-move", cur_game);
	}
	onUpdateCheckStatus(status) {
		this.socket.emit("check-status", status);
	}
	onUpdateWin(data) {
		this.socket.emit("update-score", data);
	}
	onRendomMatch() {
		this.socket.emit("queue-join");
	}
	onQueueLeave() {
		this.socket.emit("queue-leave");
	}
	emitDisConnect() {
		this.socket.disconnect();
	}
	onGameEnd(dispatch) {
		this.socket.on("game-end", (arg) => {
			dispatch(gameEnd(arg));
		});
	}
}
// let client = new Client();

// export { client as Client };
export default Client;
