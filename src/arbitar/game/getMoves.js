import { arbitar } from "./arbitar";
import { gameStatus } from "../context/reducer/constant";
import { weights, pstOpponent, pstSelf } from "../helper/helper";
/**
 * rook move rule
 */
let getRookMoves = ({ position, rank, file, piece }) => {
	let move = [];

	let us = piece[0];
	let enemy = us === "w" ? "b" : "w";

	let direction = [
		[-1, 0],
		[0, 1],
		[0, -1],
		[1, 0],
	];

	direction.forEach((dir) => {
		for (let i = 1; i < 8; i++) {
			let xmoves = i * dir[0];
			let ymoves = i * dir[1];
			const x = rank + xmoves;
			const y = file + ymoves;

			if (position?.[x]?.[y] === undefined) {
				return;
			}
			const cellValue = position[x][y];
			const isEnemy = cellValue.startsWith(enemy);
			const isUs = cellValue.startsWith(us);

			if (isEnemy) {
				move.push([x, y]);
				return;
			} else {
				if (isUs) {
					return;
				} else {
					move.push([x, y]);
				}
			}
		}
	});

	return move;
};
/**
 * knight move rule fixed with opponet black and white
 */
let getKnightMoves = ({ position, rank, file }) => {
	const moves = [];
	const enemy = position[rank][file].startsWith("w") ? "b" : "w";

	const candidates = [
		[-2, -1],
		[-2, 1],
		[-1, -2],
		[-1, 2],
		[1, -2],
		[1, 2],
		[2, -1],
		[2, 1],
	];
	candidates.forEach((c) => {
		const cell = position?.[rank + c[0]]?.[file + c[1]];
		if (cell !== undefined && (cell.startsWith(enemy) || cell === "")) {
			moves.push([rank + c[0], file + c[1]]);
		}
	});

	return moves;
};

/**
 * bishop move rule
 */

let getBishopMoves = ({ position, piece, rank, file }) => {
	const moves = [];
	const us = piece[0];
	const enemy = us === "w" ? "b" : "w";

	const direction = [
		[-1, -1],
		[-1, 1],
		[1, -1],
		[1, 1],
	];

	direction.forEach((dir) => {
		for (let i = 1; i <= 8; i++) {
			const x = rank + i * dir[0];
			const y = file + i * dir[1];
			if (position?.[x]?.[y] === undefined) break;
			if (position[x][y].startsWith(enemy)) {
				moves.push([x, y]);
				break;
			}
			if (position[x][y].startsWith(us)) {
				break;
			}
			moves.push([x, y]);
		}
	});

	return moves;
};
/**
 * queen move rule
 */
let getQueenMoves = ({ position, piece, rank, file }) => {
	const moves = [
		...getBishopMoves({ position, piece, rank, file }),
		...getRookMoves({ position, piece, rank, file }),
	];

	return moves;
};

/**
 * king move rule with opponet black and white fixed
 */
let getKingMoves = ({ position, piece, rank, file }) => {
	let moves = [];
	const us = piece[0];
	const direction = [
		[1, -1],
		[1, 0],
		[1, 1],
		[0, -1],
		[0, 1],
		[-1, -1],
		[-1, 0],
		[-1, 1],
	];

	direction.forEach((dir) => {
		const x = rank + dir[0];
		const y = file + dir[1];
		if (position?.[x]?.[y] !== undefined && !position[x][y].startsWith(us)) moves.push([x, y]);
	});
	return moves;
};

/**
 * pawn move rule
 */
let getPawnMoves = ({ position, piece, rank, file, opponent }) => {
	const moves = [];

	const dir = piece === "wp" ? 1 : -1;

	// Move two tiles on first move
	if (rank % 5 === 1) {
		if (position?.[rank + dir]?.[file] === "" && position?.[rank + dir + dir]?.[file] === "") {
			moves.push([rank + dir + dir, file]);
		}
	}

	// Move one tile
	if (!position?.[rank + dir]?.[file]) {
		moves.push([rank + dir, file]);
	}

	return moves;
};

/**
 * pawn capture rule
 */
let getPawnCapture = ({ position, prevPosition, piece, rank, file }) => {
	const moves = [];
	const dir = piece === "wp" ? 1 : -1;
	const enemy = piece[0] === "w" ? "b" : "w";

	// Capture enemy to left
	if (position?.[rank + dir]?.[file - 1] && position[rank + dir][file - 1].startsWith(enemy)) {
		moves.push([rank + dir, file - 1]);
	}

	// Capture enemy to right
	if (position?.[rank + dir]?.[file + 1] && position[rank + dir][file + 1].startsWith(enemy)) {
		moves.push([rank + dir, file + 1]);
	}

	// EnPassant
	// Check if enemy moved twice in last round
	const enemyPawn = dir === 1 ? "bp" : "wp";
	const adjacentFiles = [file - 1, file + 1];
	if (prevPosition) {
		if ((dir === 1 && rank === 4) || (dir === -1 && rank === 3)) {
			adjacentFiles.forEach((f) => {
				if (
					position?.[rank]?.[f] === enemyPawn &&
					position?.[rank + dir + dir]?.[f] === "" &&
					prevPosition?.[rank]?.[f] === "" &&
					prevPosition?.[rank + dir + dir]?.[f] === enemyPawn
				) {
					moves.push([rank + dir, f]);
				}
			});
		}
	}

	return moves;
};

/**
 * validate catling move
 */
let getCastlingMove = ({ position, castelDirection, piece, rank, file }) => {
	const move = [];

	if (file !== 4 || rank % 7 !== 0 || castelDirection === "none") {
		return move;
	}

	if (piece.startsWith("w")) {
		if (arbitar.isPlayerChecked({ positionAfterMove: position, player: "w" })) {
			return move;
		}
		if (
			["left", "both"].includes(castelDirection) &&
			!position[0][3] &&
			!position[0][1] &&
			!position[0][2] &&
			position[0][0] === "wr" &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 0,
					y: 3,
				}),
				player: "w",
			}) &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 0,
					y: 2,
				}),
				player: "w",
			})
		) {
			move.push([0, 2]);
		}
		if (
			["right", "both"].includes(castelDirection) &&
			!position[0][5] &&
			!position[0][6] &&
			position[0][7] === "wr" &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 0,
					y: 5,
				}),
				player: "w",
			}) &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 0,
					y: 6,
				}),
				player: "w",
			})
		) {
			move.push([0, 6]);
		}
	} else {
		if (arbitar.isPlayerChecked({ positionAfterMove: position, player: "b" })) {
			return move;
		}
		if (
			["left", "both"].includes(castelDirection) &&
			!position[7][3] &&
			!position[7][1] &&
			!position[7][2] &&
			position[7][0] === "br" &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 7,
					y: 3,
				}),
				player: "b",
			}) &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 7,
					y: 2,
				}),
				player: "b",
			})
		) {
			move.push([7, 2]);
		}
		if (
			["right", "both"].includes(castelDirection) &&
			!position[7][5] &&
			!position[7][6] &&
			position[7][7] === "br" &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 7,
					y: 5,
				}),
				player: "b",
			}) &&
			!arbitar.isPlayerChecked({
				positionAfterMove: arbitar.checkAmove({
					position,
					piece,
					rank,
					file,
					x: 7,
					y: 6,
				}),
				player: "b",
			})
		) {
			move.push([7, 6]);
		}
	}
	return move;
};

/**
 * validate catling dir
 */

let getCastlingDir = ({ castelDirection, piece, rank, file }) => {
	file = Number(file);
	rank = Number(rank);
	const direction = castelDirection[piece[0]];
	if (piece.endsWith("k")) return "none";

	if (file === 0 && rank === 0) {
		if (direction === "both") return "right";
		if (direction === "left") return "none";
	}
	if (file === 7 && rank === 0) {
		if (direction === "both") return "left";
		if (direction === "right") return "none";
	}
	if (file === 0 && rank === 7) {
		if (direction === "both") return "right";
		if (direction === "left") return "none";
	}
	if (file === 7 && rank === 7) {
		if (direction === "both") return "left";
		if (direction === "right") return "none";
	}
};

let getEnemyPices = (position, enemy) => {
	const enemyPieces = [];
	if (position && position.length > 0) {
		position.forEach((rank, x) => {
			rank.forEach((file, y) => {
				if (position[x][y].startsWith(enemy))
					enemyPieces.push({
						piece: position[x][y],
						rank: x,
						file: y,
					});
			});
		});
	}
	return enemyPieces;
};

let getKingPosition = (position, player) => {
	let kingPos = [];
	if (position && position.length > 0) {
		position.forEach((rank, x) => {
			rank.forEach((file, y) => {
				if (position[x][y].startsWith(player) && position[x][y].endsWith("k")) kingPos = [x, y];
			});
		});
	}

	return kingPos;
};

let evaluateBoard = ({
	status,
	piece,
	prevSum,
	opponentColor,
	moveColor,
	from_,
	to_,
	x,
	y,
	prevPosition,
	promotion,
	newMove,
}) => {
	if (status === gameStatus.white || status === gameStatus.black) {
		// Opponent is in checkmate (good for us)
		if (moveColor === opponentColor) {
			return 10 ** 10;
		}
		// Our king's in checkmate (bad for us)
		else {
			return -(10 ** 10);
		}
	}

	if (status === gameStatus.insufficiant || status === gameStatus.stalemet) {
		return 0;
	}

	if (status === gameStatus.b_check || status === gameStatus.w_check) {
		// Opponent is in check (good for us)
		if (moveColor === opponentColor) {
			prevSum += 50;
		}
		// Our king's in check (bad for us)
		else {
			prevSum -= 50;
		}
	}

	var from = [8 - parseInt(from_[1]), from_.charCodeAt(0) - "a".charCodeAt(0)];
	var to = [8 - parseInt(to_[1]), to_.charCodeAt(0) - "a".charCodeAt(0)];

	// Change endgame behavior for kings

	if (prevSum < -1500) {
		if (piece === "k") {
			piece = "k_e";
		}
		// Kings can never be captured
		// else if (move.captured === 'k') {
		//   move.captured = 'k_e';
		// }
	}

	if (newMove.includes("x")) {
		// Opponent piece was captured (good for us)
		let capturePices = prevPosition[x][y] || null;

		console.log(capturePices, "capture picves");
		if (capturePices) {
			if (moveColor === opponentColor) {
				prevSum +=
					weights[capturePices[1]] + pstOpponent[opponentColor][capturePices[1]][to[0]][to[1]];
			}
			// Our piece was captured (bad for us)
			else {
				prevSum -= weights[capturePices[1]] + pstSelf[opponentColor][capturePices[1]][to[0]][to[1]];
			}
		}
	}

	if (piece === "p") {
		// NOTE: promote to queen for simplicity

		if (promotion) {
			if (opponentColor === moveColor) {
				// Our piece was promoted (good for us)
				prevSum -= weights[piece] + pstSelf[moveColor][piece][from[0]][from[1]];
				prevSum += weights[promotion] + pstSelf[moveColor][promotion][to[0]][to[1]];
			}
			// Opponent piece was promoted (bad for us)
			else {
				prevSum += weights[piece] + pstSelf[moveColor][piece][from[0]][from[1]];
				prevSum -= weights[promotion] + pstSelf[moveColor][promotion][to[0]][to[1]];
			}
		}
	} else {
		// The moved piece still exists on the updated board, so we only need to update the position value
		if (moveColor !== opponentColor) {
			prevSum += pstSelf[moveColor][piece][from[0]][from[1]];
			prevSum -= pstSelf[moveColor][piece][to[0]][to[1]];
		} else {
			prevSum -= pstSelf[moveColor][piece][from[0]][from[1]];
			prevSum += pstSelf[moveColor][piece][to[0]][to[1]];
		}
	}

	return prevSum;
};
export {
	getRookMoves,
	getKingMoves,
	getKnightMoves,
	getQueenMoves,
	getPawnMoves,
	getBishopMoves,
	getPawnCapture,
	getCastlingMove,
	getCastlingDir,
	getEnemyPices,
	getKingPosition,
	evaluateBoard,
};
