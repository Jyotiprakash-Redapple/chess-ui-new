import { initArr } from "../context/reducer/constant";
import { Getnewmovenotation } from "../context/type";

// function convertChessboard(inputArray) {
// 	const chessboard = [];
// 	const pieceTypes = ["r", "n", "b", "q", "k", "b", "n", "r"];

// 	for (let i = 0; i < inputArray.length; i++) {
// 		const row = inputArray[i];
// 		const chessboardRow = [];

// 		for (let j = 0; j < row.length; j++) {
// 			const pieceCode = row[j];
// 			if (pieceCode !== "") {
// 				const color = i < 4 ? "w" : "b";
// 				const pieceType = pieceTypes[j];
// 				const square = [i, j];
// 				const chessPiece = {
// 					square: square,
// 					type: pieceType,
// 					color: color,
// 				};
// 				chessboardRow.push(chessPiece);
// 			} else {
// 				const square = [i, j];
// 				const chessPiece = {
// 					square: square,
// 					type: "",
// 					color: "",
// 				};
// 				chessboardRow.push(chessPiece);
// 			}
// 		}

// 		chessboard.push(chessboardRow);
// 	}

// 	return chessboard;
// }

let createPosition = () => {
	const position = new Array(8).fill("").map((x) => new Array(8).fill(""));

	for (let i = 0; i < 8; i++) {
		position[6][i] = "bp";
		position[1][i] = "wp";
	}
	// if white is first player
	position[0][0] = "wr";
	position[0][1] = "wn";
	position[0][2] = "wb";
	position[0][3] = "wq";
	position[0][4] = "wk";
	position[0][5] = "wb";
	position[0][6] = "wn";
	position[0][7] = "wr";

	position[7][0] = "br";
	position[7][1] = "bn";
	position[7][2] = "bb";
	position[7][3] = "bq";
	position[7][4] = "bk";
	position[7][5] = "bb";
	position[7][6] = "bn";
	position[7][7] = "br";

	return position;
};

let copyPosition = (position: any) => {
	let copyPosition = Array(8)
		.fill("")
		.map((el) => Array(8).fill(""));

	for (let rank = 0; rank < 8; rank++) {
		for (let file = 0; file < 8; file++) {
			copyPosition[rank][file] = position[rank][file];
		}
	}

	return copyPosition;
};

let AsciiToChar = (ascii: any) => {
	let char = String.fromCharCode(96 + ascii);

	return char;
};

let areSameColorTiles = (coords1: any, coords2: any) =>
	(coords1.x + coords1.y) % 2 === coords2.x + coords2.y;

let findPieceCoords = (position: any, type: any) => {
	let results: any = [];
	position.forEach((rank: any, i: any) => {
		rank.forEach((pos: any, j: any) => {
			if (pos === type) results.push({ x: i, y: j });
		});
	});
	return results;
};

let getNewMoveNotation = ({
	piece,
	rank,
	file,
	x,
	y,
	position,
	promotesTo,
}: Getnewmovenotation) => {
	let note = "";
	rank = Number(rank);
	file = Number(file);
	if (piece[1] === "k" && Math.abs(file - y) === 2) {
		if (file < y) return "O-O";
		else return "O-O-O";
	}

	if (piece[1] !== "p") {
		note += piece[1].toUpperCase();
		if (position[x][y]) {
			note += "x";
		}
	} else if (rank !== x && file !== y) {
		note += AsciiToChar(file + 1) + "x";
	}

	note += AsciiToChar(y + 1) + (x + 1);

	if (promotesTo) note += "=" + promotesTo.toUpperCase();
	return note;
};
var weights = { p: 100, n: 280, b: 320, r: 479, q: 929, k: 60000, k_e: 60000 };
var pst_w = {
	p: [
		[100, 100, 100, 100, 105, 100, 100, 100],
		[78, 83, 86, 73, 102, 82, 85, 90],
		[7, 29, 21, 44, 40, 31, 44, 7],
		[-17, 16, -2, 15, 14, 0, 15, -13],
		[-26, 3, 10, 9, 6, 1, 0, -23],
		[-22, 9, 5, -11, -10, -2, 3, -19],
		[-31, 8, -7, -37, -36, -14, 3, -31],
		[0, 0, 0, 0, 0, 0, 0, 0],
	],
	n: [
		[-66, -53, -75, -75, -10, -55, -58, -70],
		[-3, -6, 100, -36, 4, 62, -4, -14],
		[10, 67, 1, 74, 73, 27, 62, -2],
		[24, 24, 45, 37, 33, 41, 25, 17],
		[-1, 5, 31, 21, 22, 35, 2, 0],
		[-18, 10, 13, 22, 18, 15, 11, -14],
		[-23, -15, 2, 0, 2, 0, -23, -20],
		[-74, -23, -26, -24, -19, -35, -22, -69],
	],
	b: [
		[-59, -78, -82, -76, -23, -107, -37, -50],
		[-11, 20, 35, -42, -39, 31, 2, -22],
		[-9, 39, -32, 41, 52, -10, 28, -14],
		[25, 17, 20, 34, 26, 25, 15, 10],
		[13, 10, 17, 23, 17, 16, 0, 7],
		[14, 25, 24, 15, 8, 25, 20, 15],
		[19, 20, 11, 6, 7, 6, 20, 16],
		[-7, 2, -15, -12, -14, -15, -10, -10],
	],
	r: [
		[35, 29, 33, 4, 37, 33, 56, 50],
		[55, 29, 56, 67, 55, 62, 34, 60],
		[19, 35, 28, 33, 45, 27, 25, 15],
		[0, 5, 16, 13, 18, -4, -9, -6],
		[-28, -35, -16, -21, -13, -29, -46, -30],
		[-42, -28, -42, -25, -25, -35, -26, -46],
		[-53, -38, -31, -26, -29, -43, -44, -53],
		[-30, -24, -18, 5, -2, -18, -31, -32],
	],
	q: [
		[6, 1, -8, -104, 69, 24, 88, 26],
		[14, 32, 60, -10, 20, 76, 57, 24],
		[-2, 43, 32, 60, 72, 63, 43, 2],
		[1, -16, 22, 17, 25, 20, -13, -6],
		[-14, -15, -2, -5, -1, -10, -20, -22],
		[-30, -6, -13, -11, -16, -11, -16, -27],
		[-36, -18, 0, -19, -15, -15, -21, -38],
		[-39, -30, -31, -13, -31, -36, -34, -42],
	],
	k: [
		[4, 54, 47, -99, -99, 60, 83, -62],
		[-32, 10, 55, 56, 56, 55, 10, 3],
		[-62, 12, -57, 44, -67, 28, 37, -31],
		[-55, 50, 11, -4, -19, 13, 0, -49],
		[-55, -43, -52, -28, -51, -47, -8, -50],
		[-47, -42, -43, -79, -64, -32, -29, -32],
		[-4, 3, -14, -50, -57, -18, 13, 4],
		[17, 30, -3, -14, 6, -1, 40, 18],
	],

	// Endgame King Table
	k_e: [
		[-50, -40, -30, -20, -20, -30, -40, -50],
		[-30, -20, -10, 0, 0, -10, -20, -30],
		[-30, -10, 20, 30, 30, 20, -10, -30],
		[-30, -10, 30, 40, 40, 30, -10, -30],
		[-30, -10, 30, 40, 40, 30, -10, -30],
		[-30, -10, 20, 30, 30, 20, -10, -30],
		[-30, -30, 0, 0, 0, 0, -30, -30],
		[-50, -30, -30, -30, -30, -30, -30, -50],
	],
};
var pst_b = {
	p: pst_w["p"].slice().reverse(),
	n: pst_w["n"].slice().reverse(),
	b: pst_w["b"].slice().reverse(),
	r: pst_w["r"].slice().reverse(),
	q: pst_w["q"].slice().reverse(),
	k: pst_w["k"].slice().reverse(),
	k_e: pst_w["k_e"].slice().reverse(),
};

var pstOpponent = { w: pst_b, b: pst_w };
var pstSelf = { w: pst_w, b: pst_b };
export {
	createPosition,
	copyPosition,
	AsciiToChar,
	areSameColorTiles,
	findPieceCoords,
	getNewMoveNotation,
	pstOpponent,
	pstSelf,
	weights,
	pst_b,
	pst_w,
};
