import { io } from "socket.io-client";
import { gameInit, updateBoard, gameTimer, turnTimer, turnUpdate } from "../arbitar/context/reducer/move";
class Client {
	constructor(gameSceneInstance) {
		this.gameSceneRefence = gameSceneInstance;
		this.urlParams = new URLSearchParams(window.location.search);
		this.token = this.urlParams.get("auth_token");
		this.baseUrl = "http://16.163.81.210:5003/chessio";
		this.socket = io(this.baseUrl, {
			query: {
				auth_token: this.token,
			},
		});

		this.soundName = null;

		this._initSocketListeners();

		// this.getGameInitFromServer();
		// this.ListenCurrentState();
		// this.StartTimerFromServer();
		// this.GetTimerFromServer();
		// this.StartDrawFromServer();
		// this.CurrentDrawNumberFromServer();
		// this.StopDrawNumberFromServer();
	}
	create() {}
	_initSocketListeners() {
		// console.log('connecting to socket');
		let ref = this;
		this.socket.on("connect", () => {
			console.log("Successfully connected!======>", this.socket.id);
			localStorage.setItem("socketId", this.socket.id);
		});
	}
	getGameInitFromServer(dispatch) {
		this.socket.on("game-start", (arg) => {
			dispatch(gameInit({ arg }));
			console.log(arg, "game start from server========>");
		});
	}
	getUpdateDetailsFromServer(dispatch) {
		this.socket.on("update-details", (arg) => {
			dispatch(updateBoard({ arg }));
			console.log("Game Update Details From Server", arg);
		});
	}
	onGmaeTime(dispatch) {
		this.socket.on("gameTimer", (arg) => {
			dispatch(gameTimer(arg));
		});
	}
	onTurnTimer(dispatch) {
		this.socket.on("turnTimer", (arg) => {
			dispatch(turnTimer(arg));
		});
	}
	onTurnChange(dispatch) {
		this.socket.on("game-updateTurn", (arg) => {
			dispatch(turnUpdate(arg));
		});
	}
	onUpdateMove(cur_game) {
		console.log("current game move", cur_game);
		this.socket.emit("update-move", cur_game);
	}
	onUpdateWin(data) {
		console.log("resultt", data);
		this.socket.emit("update-scrore", data);
	}
	onRendomMatch() {
		this.socket.emit("queue-join");
	}
	onQueueLeave() {
		console.log("queue leave");
		this.socket.emit("queue-leave");
	}
}
// let client = new Client();

// export { client as Client };
export default Client;
