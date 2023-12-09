import { actionTypes, gameStatus } from "./constant";

import { createPosition } from "../../helper/helper";
let reducer = (state: any, action: any) => {
	switch (action.type) {
		case actionTypes.GET_USER_DATA: {
			const userData = {
				id: action.payload?.id,
				user_name: action.payload?.user_name,
				score: action.payload?.score,
				colour: action.payload?.colour,
				profile: action.payload.profile,
			};
			return {
				pl: userData,
				...state,
			};
		}
		case actionTypes.NEW_GAME_INIT: {
			const gameObject = action.payload.arg;
			let gameInit = {
				opponent: gameObject.player.colour === "white" ? "b" : "w",
				position: [createPosition()],
				turn: gameObject.turn
					? gameObject.player.colour.charAt(0).toLowerCase()
					: gameObject.opponent.colour.charAt(0).toLowerCase(),
				movementTurn: gameObject.player.colour === "white" ? true : false,
				status: gameStatus.ongoing,
				turnTime: {
					currentPlayerId: gameObject.turn ? gameObject.player.id : gameObject.opponent.id,
					counter: "30.00",
					life: 3,
				},
				totalTurnTime: gameObject.turn_time,
			};
			return {
				...state,
				opponent: gameInit.opponent,
				position: gameInit.position,
				turn: gameInit.turn,
				status: gameInit.status,
				pl: action.payload.arg.player,
				op: action.payload.arg.opponent,
				turnTime: gameInit.turnTime,
				movementTurn: gameInit.movementTurn,
				totalTurnTime: gameInit.totalTurnTime,
			};
		}
		case actionTypes.GAME_TIME: {
			return { ...state, gameTime: action.payload.counter };
		}
		case actionTypes.TURN_TIME: {
			return { ...state, turnTime: action.payload };
		}

		case actionTypes.UPDATE_TURN: {
			const gameObject = action.payload;
			return {
				...state,
				totalTurnTime: Number(gameObject.turn_time),
				turn: gameObject.turn
					? gameObject.player.colour.charAt(0).toLowerCase()
					: gameObject.opponent.colour.charAt(0).toLowerCase(),
			};
		}
		case actionTypes.GAME_END: {
			let gameEndObj = action.payload;
			state.socket.onUpdateWin({
				player: {
					id: gameEndObj.player.id,
					score: gameEndObj.player.score,
					colour: gameEndObj.player.colour,
				},
				opponent: {
					id: gameEndObj.opponent.id,
					score: gameEndObj.opponent.score,
					colour: gameEndObj.opponent.colour,
				},
				winner: gameEndObj.winner,
			});
			let status = "";
			if (gameEndObj.winner) {
				status = gameEndObj.player.colour === "black" ? gameStatus.black : gameStatus.white;
			} else {
				status = gameEndObj.opponent.colour === "black" ? gameStatus.black : gameStatus.white;
			}
			return {
				...state,
				status: status,
			};
		}
		case actionTypes.BOARD_UPDATE: {
			let board = action.payload.arg.board;
			if (board?.status) {
				if (board.status === gameStatus.newGameInit) {
					return {
						...state,
						movementTurn: state.opponent === "w" ? false : true,
						opponent: state.opponent === "w" ? "b" : "w",
						advantage: 0,
						position: [createPosition()],
						status: gameStatus.ongoing,
						turn: "w",
						moveList: [], // array
						kill_pices: [],
						castlingdir: {
							w: "both",
							b: "both",
						},
					};
				}
				let movementTurn = state.movementTurn === true ? false : true;
				return {
					...state,
					status: board.status,
					advantage: board.advantage,
				};
			} else {
				const newposition = [...state.position, board.position];
				let movementTurn = state.movementTurn === true ? false : true;
				return {
					...state,
					position: newposition,
					advantage: board.advantage,
					moveList: [...board.moveList],
					kill_pices: [...board.kill_pices],
					castlingdir: board.castlingDirection,
				};
			}
		}

		case actionTypes.NEW_MOVE: {
			//! move list empty  || if move list not empty check last index two size or not
			//! if last index two size push an element other wise pus new arr

			let newMoveList = [];
			let movementTurn = state.movementTurn === true ? false : true;
			if (!state.moveList.length) {
				newMoveList = [[action.payload.newMove]];
			} else {
				let lastMove = state.moveList[state.moveList.length - 1];

				if (lastMove.length !== 2) {
					newMoveList = [...state.moveList];
					newMoveList[state.moveList.length - 1] = [lastMove[0], action.payload.newMove];
				} else {
					newMoveList = [...state.moveList, [action.payload.newMove]];
				}
			}
			const newposition = [...state.position, action.payload.newPosition];

			state.socket.onUpdateMove({
				board: {
					position: action.payload.newPosition,
					moveList: newMoveList,
					advantage: state.advantage,
					kill_pices: state.kill_pices,
					castlingDirection: state.castlingdir,
				},
				game_state: {
					status: state.status,
					advantage: state.advantage === 0 ? "Neither side" : state.advantage > 0 ? "Black" : "White",
				},
			});

			return {
				...state,
				position: newposition,
				moveList: newMoveList,
			};
		}
		case actionTypes.CANDIDATE_MOVE: {
			return {
				...state,
				candidateMove: action.payload.candicateMove,
			};
		}
		case actionTypes.CLEAR_CANDIDATE_MOVES: {
			return {
				...state,
				candidateMove: action.payload,
			};
		}
		case actionTypes.CLEAR_PIECES_SQOURE_INFO: {
			return {
				...state,
				pieces_square_info: action.payload,
			};
		}
		case actionTypes.PIECES_SQOURE_INFO: {
			return {
				...state,
				pieces_square_info: action.payload.pieces_square_info,
			};
		}
		case actionTypes.OPEN_PROMOTION_BOX: {
			return {
				...state,
				status: gameStatus.promoting,
				promotion_square_info: action.payload,
			};
		}

		case actionTypes.CLOSE_PROMOTION_BOX: {
			return {
				...state,
				status: gameStatus.ongoing,
			};
		}

		case actionTypes.CLEAR_PROMOTION_SQOUR_INFO: {
			return {
				...state,
				promotion_square_info: null,
			};
		}
		case actionTypes.CHECK_CASTEL: {
			let { turn, castlingdir } = state;
			castlingdir[turn] = action.payload;
			return {
				...state,
				status: gameStatus.ongoing,
			};
		}

		case actionTypes.DECTACT_STALEMET: {
			state.socket.onUpdateMove({
				board: {
					status: gameStatus.stalemet,
					advantage: state.advantage,
				},
				game_state: {
					status: state.status,
					advantage: state.advantage === 0 ? "Neither side" : state.advantage > 0 ? "Black" : "White",
				},
			});
			state.socket.onUpdateWin({
				player: { id: state.pl.id, score: 0.5, colour: state.pl.colour },
				opponent: { id: state.op.id, score: 0.5, colour: state.op.colour },
				winner: gameStatus.stalemet,
			});

			return {
				...state,
				status: gameStatus.stalemet,
			};
		}

		case actionTypes.DECTACT_INSUFFICIANT_MATARIAL: {
			state.socket.onUpdateMove({
				board: {
					status: gameStatus.insufficiant,
					advantage: state.advantage,
				},
				game_state: {
					status: state.status,
					advantage: state.advantage === 0 ? "Neither side" : state.advantage > 0 ? "Black" : "White",
				},
			});
			state.socket.onUpdateWin({
				player: { id: state.pl.id, score: 0.5, colour: state.pl.colour },
				opponent: { id: state.op.id, score: 0.5, colour: state.op.colour },
				winner: gameStatus.insufficiant,
			});

			return {
				...state,
				status: gameStatus.insufficiant,
			};
		}

		case actionTypes.WIN: {
			state.socket.onUpdateMove({
				board: {
					status: action.payload === "w" ? gameStatus.white : gameStatus.black,
					advantage: state.advantage,
				},
				game_state: {
					status: state.status,
					advantage: state.advantage === 0 ? "Neither side" : state.advantage > 0 ? "Black" : "White",
				},
			});
			state.socket.onUpdateWin({
				player: {
					id: state.pl.id,
					score: state.pl.colour[0] === action.payload ? 1 : 0,
					colour: state.pl.colour,
				},
				opponent: {
					id: state.op.id,
					score: state.pl.colour[0] === action.payload ? 0 : 1,
					colour: state.op.colour,
				},
				winner: state.pl.colour[0] === action.payload ? state.pl.colour : state.op.colour,
			});

			return {
				...state,
				status: action.payload === "w" ? gameStatus.white : gameStatus.black,
			};
		}
		case actionTypes.SAVE_KILL_PICES: {
			let prevPosition = action.payload.prevPosition;
			let x = action.payload.x;
			let y = action.payload.y;
			let enemy = prevPosition?.[x]?.[y] ? prevPosition[x][y] : null;
			return {
				...state,
				kill_pices: [...state.kill_pices, enemy],
			};
		}
		case actionTypes.UPDATE_ADVANTAGE: {
			return {
				...state,
				advantage: action.payload,
			};
		}

		case actionTypes.NEW_GAME: {
			state.socket.onUpdateMove({
				board: {
					advantage: 0,
					position: [createPosition()],
					status: gameStatus.newGameInit,
					turn: "w",
					moveList: [], // array
					kill_pices: [],
					castlingdir: {
						w: "both",
						b: "both",
					},
				},
				game_state: {
					status: state.status,
					advantage: state.advantage === 0 ? "Neither side" : state.advantage > 0 ? "Black" : "White",
				},
			});
			return {
				...state,
				opponent: state.opponent === "w" ? "b" : "w",
				advantage: 0,
				position: [createPosition()],
				status: gameStatus.ongoing,
				turn: "w",
				moveList: [], // array
				kill_pices: [],
				castlingdir: {
					w: "both",
					b: "both",
				},
			};
		}
		// socket
		case actionTypes.NEW_SOCKET_CONNECTION: {
			return {
				...state,
				socket: action.payload.socket,
			};
		}

		default: {
			state;
			break;
		}
	}
};

export { reducer };
