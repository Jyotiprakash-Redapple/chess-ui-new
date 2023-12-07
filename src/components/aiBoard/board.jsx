"use client";
import "@/style/game.css";
import { useEffect, useState, useRef } from "react";
import React from "react";
import $ from "jquery";

import { Chess } from "@/arbitar/lib/chess";

import { ChessBoard } from "@/arbitar/lib/chessboard";
import Chessboard from "chessboardjsx";
import Image from "next/image";
import { app } from "@/config/appConfig";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";
function AIboard() {
	const { player, opponent } = app;
	const boardRef = useRef();
	const router = useRouter();
	const timeRef = useRef("700.00");
	const [quitGame, setQuitGame] = useState(false);
	const [chessMove, setChessMove] = useState({
		fen: "start",
		squareStyles: {},
		// square with the currently clicked piece
		pieceSquare: "",
		// currently clicked square
		square: "",
		// array of past game moves
		history: [],
	});
	/*
	 * A simple chess AI, by someone who doesn't know how to play chess.
	 * Uses the chessboard.js and chess.js libraries.
	 *
	 * Copyright (c) 2020 Zhang Zeyu
	 */

	// maximum size of undo stack

	var board = null;
	var $board = $("#myBoard");

	var game = new Chess();

	// var _ChessBoard = ChessBoard();
	var globalSum = 0; // always from black's perspective. Negative for white's perspective.
	var whiteSquareGrey = "#a9a9a9";
	var blackSquareGrey = "#696969";
	var STACK_SIZE = 50;
	var squareClass = "square-55d63";
	var squareToHighlight = null;
	var colorToHighlight = null;
	var positionCount;
	useEffect(() => {
		var config = {
			draggable: true,
			position: "start",
			onDragStart: onDragStart,
			onDrop: onDrop,
			onMouseoutSquare: onMouseoutSquare,
			onMouseoverSquare: onMouseoverSquare,
			onSnapEnd: onSnapEnd,
			// pieceTheme: metro_theme,
			// boardTheme: metro_board_theme,
			// onSquareClick: onSquareClick,
			// onSquareRightClick: onSquareRightClick,
		};
		let new_ = ChessBoard();
		if (typeof document !== "undefined") {
			// Your browser-specific code here
			board = new new_(document.getElementById("myBoard"), config);
		}

		setInterval(() => {
			let init = timeRef.current;
			if (init == "0.00") return;
			timeRef.current = Number(init) - 1;
		}, 1000);
	}, []);

	let timer = null;

	const squareStyling = ({ pieceSquare, history }) => {
		const sourceSquare = history.length && history[history.length - 1].from;
		const targetSquare = history.length && history[history.length - 1].to;

		return {
			[pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
			...(history.length && {
				[sourceSquare]: {
					backgroundColor: "rgba(255, 255, 0, 0.4)",
				},
			}),
			...(history.length && {
				[targetSquare]: {
					backgroundColor: "rgba(255, 255, 0, 0.4)",
				},
			}),
		};
	};
	const onSquareClick = (square) => {
		setChessMove((history) => {
			return {
				squareStyles: squareStyling({ pieceSquare: square, history }),
				pieceSquare: square,
			};
		});

		let move = game.move({
			from: chessMove.pieceSquare,
			to: square,
			promotion: "q", // always promote to a queen for example simplicity
		});

		// Illegal move
		if (move === null) return "snapback";

		setChessMove(() => {
			return {
				fen: game.fen(),
				history: game.history({ verbose: true }),
				pieceSquare: "",
			};
		});

		// undo_stack = [];

		globalSum = evaluateBoard(game, move, globalSum, "b");
		updateAdvantage();

		// Highlight latest move
		$board.find("." + squareClass).removeClass("highlight-white");

		$board.find(".square-" + move.from).addClass("highlight-white");
		squareToHighlight = move.to;
		colorToHighlight = "white";

		$board.find(".square-" + squareToHighlight).addClass("highlight-" + colorToHighlight);

		if (!checkStatus("black"));
		{
			// Make the best move for black
			window.setTimeout(function () {
				makeBestMove("b");
				window.setTimeout(function () {
					showHint();
				}, 250);
			}, 250);
		}
	};

	const onSquareRightClick = (square) =>
		setChessMove({
			squareStyles: { [square]: { backgroundColor: "deepPink" } },
		});
	/*
	 * Piece Square Tables, adapted from Sunfish.py:
	 * https://github.com/thomasahle/sunfish/blob/master/sunfish.py
	 */

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

	/*
	 * Evaluates the board at this point in time,
	 * using the material weights and piece square tables.
	 */
	function evaluateBoard(game, move, prevSum, color) {
		if (game.in_checkmate()) {
			// Opponent is in checkmate (good for us)
			if (move.color === color) {
				return 10 ** 10;
			}
			// Our king's in checkmate (bad for us)
			else {
				return -(10 ** 10);
			}
		}

		if (game.in_draw() || game.in_threefold_repetition() || game.in_stalemate()) {
			return 0;
		}

		if (game.in_check()) {
			// Opponent is in check (good for us)
			if (move.color === color) {
				prevSum += 50;
			}
			// Our king's in check (bad for us)
			else {
				prevSum -= 50;
			}
		}

		var from = [8 - parseInt(move.from[1]), move.from.charCodeAt(0) - "a".charCodeAt(0)];
		var to = [8 - parseInt(move.to[1]), move.to.charCodeAt(0) - "a".charCodeAt(0)];

		// Change endgame behavior for kings
		if (prevSum < -1500) {
			if (move.piece === "k") {
				move.piece = "k_e";
			}
			// Kings can never be captured
			// else if (move.captured === 'k') {
			//   move.captured = 'k_e';
			// }
		}

		if ("captured" in move) {
			// Opponent piece was captured (good for us)
			if (move.color === color) {
				prevSum += weights[move.captured] + pstOpponent[move.color][move.captured][to[0]][to[1]];
			}
			// Our piece was captured (bad for us)
			else {
				prevSum -= weights[move.captured] + pstSelf[move.color][move.captured][to[0]][to[1]];
			}
		}

		if (move.flags.includes("p")) {
			// NOTE: promote to queen for simplicity
			move.promotion = "q";

			// Our piece was promoted (good for us)
			if (move.color === color) {
				prevSum -= weights[move.piece] + pstSelf[move.color][move.piece][from[0]][from[1]];
				prevSum += weights[move.promotion] + pstSelf[move.color][move.promotion][to[0]][to[1]];
			}
			// Opponent piece was promoted (bad for us)
			else {
				prevSum += weights[move.piece] + pstSelf[move.color][move.piece][from[0]][from[1]];
				prevSum -= weights[move.promotion] + pstSelf[move.color][move.promotion][to[0]][to[1]];
			}
		} else {
			// The moved piece still exists on the updated board, so we only need to update the position value
			if (move.color !== color) {
				prevSum += pstSelf[move.color][move.piece][from[0]][from[1]];
				prevSum -= pstSelf[move.color][move.piece][to[0]][to[1]];
			} else {
				prevSum -= pstSelf[move.color][move.piece][from[0]][from[1]];
				prevSum += pstSelf[move.color][move.piece][to[0]][to[1]];
			}
		}

		return prevSum;
	}

	/*
	 * Performs the minimax algorithm to choose the best move: https://en.wikipedia.org/wiki/Minimax (pseudocode provided)
	 * Recursively explores all possible moves up to a given depth, and evaluates the game board at the leaves.
	 *
	 * Basic idea: maximize the minimum value of the position resulting from the opponent's possible following moves.
	 * Optimization: alpha-beta pruning: https://en.wikipedia.org/wiki/Alpha%E2%80%93beta_pruning (pseudocode provided)
	 *
	 * Inputs:
	 *  - game:                 the game object.
	 *  - depth:                the depth of the recursive tree of all possible moves (i.e. height limit).
	 *  - isMaximizingPlayer:   true if the current layer is maximizing, false otherwise.
	 *  - sum:                  the sum (evaluation) so far at the current layer.
	 *  - color:                the color of the current player.
	 *
	 * Output:
	 *  the best move at the root of the current subtree.
	 */
	function minimax(game, depth, alpha, beta, isMaximizingPlayer, sum, color) {
		positionCount++;
		var children = game.ugly_moves({ verbose: true });

		// Sort moves randomly, so the same move isn't always picked on ties
		children.sort(function (a, b) {
			return 0.5 - Math.random();
		});

		var currMove;
		// Maximum depth exceeded or node is a terminal node (no children)
		if (depth === 0 || children.length === 0) {
			return [null, sum];
		}

		// Find maximum/minimum from list of 'children' (possible moves)
		var maxValue = Number.NEGATIVE_INFINITY;
		var minValue = Number.POSITIVE_INFINITY;
		var bestMove;
		for (var i = 0; i < children.length; i++) {
			currMove = children[i];

			// Note: in our case, the 'children' are simply modified game states
			var currPrettyMove = game.ugly_move(currMove);
			var newSum = evaluateBoard(game, currPrettyMove, sum, color);
			var [childBestMove, childValue] = minimax(
				game,
				depth - 1,
				alpha,
				beta,
				!isMaximizingPlayer,
				newSum,
				color
			);

			game.undo();

			if (isMaximizingPlayer) {
				if (childValue > maxValue) {
					maxValue = childValue;
					bestMove = currPrettyMove;
				}
				if (childValue > alpha) {
					alpha = childValue;
				}
			} else {
				if (childValue < minValue) {
					minValue = childValue;
					bestMove = currPrettyMove;
				}
				if (childValue < beta) {
					beta = childValue;
				}
			}

			// Alpha-beta pruning
			if (alpha >= beta) {
				break;
			}
		}

		if (isMaximizingPlayer) {
			return [bestMove, maxValue];
		} else {
			return [bestMove, minValue];
		}
	}

	function checkStatus(color) {
		if (game.in_checkmate()) {
			// $("#status").html(`<b>Checkmate!</b> Oops, <b>${color}</b> lost.`);
		} else if (game.insufficient_material()) {
			// $("#status").html(`It's a <b>draw!</b> (Insufficient Material)`);
		} else if (game.in_threefold_repetition()) {
			// $("#status").html(`It's a <b>draw!</b> (Threefold Repetition)`);
		} else if (game.in_stalemate()) {
			// $("#status").html(`It's a <b>draw!</b> (Stalemate)`);
		} else if (game.in_draw()) {
			// $("#status").html(`It's a <b>draw!</b> (50-move Rule)`);
		} else if (game.in_check()) {
			// $("#status").html(`Oops, <b>${color}</b> is in <b>check!</b>`);
			return false;
		} else {
			// $("#status").html(`No check, checkmate, or draw.`);
			return false;
		}
		return true;
	}

	function updateAdvantage() {
		if (globalSum > 0) {
			// $("#advantageColor").text("Black");
			// $("#advantageNumber").text(globalSum);
		} else if (globalSum < 0) {
			// $("#advantageColor").text("White");
			// $("#advantageNumber").text(-globalSum);
		} else {
			// $("#advantageColor").text("Neither side");
			// $("#advantageNumber").text(globalSum);
		}
		// $("#advantageBar").attr({
		// 	"aria-valuenow": `${-globalSum}`,
		// 	style: `width: ${((-globalSum + 2000) / 4000) * 100}%`,
		// });
	}

	/*
	 * Calculates the best legal move for the given color.
	 */
	function getBestMove(game, color, currSum) {
		positionCount = 0;

		if (color === "b") {
			var depth = 3;
		} else {
			var depth = 3;
		}

		var d = new Date().getTime();
		var [bestMove, bestMoveValue] = minimax(
			game,
			depth,
			Number.NEGATIVE_INFINITY,
			Number.POSITIVE_INFINITY,
			true,
			currSum,
			color
		);
		var d2 = new Date().getTime();
		var moveTime = d2 - d;
		var positionsPerS = (positionCount * 1000) / moveTime;

		$("#position-count").text(positionCount);
		$("#time").text(moveTime / 1000);
		$("#positions-per-s").text(Math.round(positionsPerS));

		return [bestMove, bestMoveValue];
	}

	/*
	 * Makes the best legal move for the given color.
	 */
	function makeBestMove(color) {
		if (color === "b") {
			var move = getBestMove(game, color, globalSum)[0];
		} else {
			var move = getBestMove(game, color, -globalSum)[0];
		}

		globalSum = evaluateBoard(game, move, globalSum, "b");
		updateAdvantage();

		game.move(move);
		board.position(game.fen());

		if (color === "b") {
			checkStatus("black");

			// Highlight black move
			$board.find("." + squareClass).removeClass("highlight-black");
			$board.find(".square-" + move.from).addClass("highlight-black");
			squareToHighlight = move.to;
			colorToHighlight = "black";

			$board.find(".square-" + squareToHighlight).addClass("highlight-" + colorToHighlight);
		} else {
			checkStatus("white");

			// Highlight white move
			$board.find("." + squareClass).removeClass("highlight-white");
			$board.find(".square-" + move.from).addClass("highlight-white");
			squareToHighlight = move.to;
			colorToHighlight = "white";

			$board.find(".square-" + squareToHighlight).addClass("highlight-" + colorToHighlight);
		}
	}

	/*
	 * Plays Computer vs. Computer, starting with a given color.
	 */
	function compVsComp(color) {
		if (!checkStatus({ w: "white", b: "black" }[color])) {
			timer = window.setTimeout(function () {
				makeBestMove(color);
				if (color === "w") {
					color = "b";
				} else {
					color = "w";
				}
				compVsComp(color);
			}, 250);
		}
	}

	/*
	 * Resets the game to its initial state.
	 */
	function reset() {
		game.reset();
		globalSum = 0;
		$board.find("." + squareClass).removeClass("highlight-white");
		$board.find("." + squareClass).removeClass("highlight-black");
		$board.find("." + squareClass).removeClass("highlight-hint");
		board.position(game.fen());
		$("#advantageColor").text("Neither side");
		$("#advantageNumber").text(globalSum);

		// Kill the Computer vs. Computer callback
		if (timer) {
			clearTimeout(timer);
			timer = null;
		}
	}

	/*
	 * Event listeners for various buttons.
	 */
	const handelruLopezBtn = () => {
		reset();
		game.load("r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1");
		board.position(game.fen());
		window.setTimeout(function () {
			makeBestMove("b");
		}, 250);
	};

	const handelItalianGameBtn = () => {
		reset();
		game.load("r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R b KQkq - 0 1");
		board.position(game.fen());
		window.setTimeout(function () {
			makeBestMove("b");
		}, 250);
	};

	const handelSicilianDefenseBtn = () => {
		reset();
		game.load("rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 1");
		board.position(game.fen());
	};

	const handelStartBtn = () => {
		reset();
	};

	const handelComVsComBtn = () => {
		reset();
		compVsComp("w");
	};

	const handelResetBtn = () => {
		reset();
	};

	var undo_stack = [];

	function undo() {
		var move = game.undo();
		undo_stack.push(move);

		// Maintain a maximum stack size
		if (undo_stack.length > STACK_SIZE) {
			undo_stack.shift();
		}
		board.position(game.fen());
	}

	const handelUndoBtn = () => {
		if (game.history().length >= 2) {
			$board.find("." + squareClass).removeClass("highlight-white");
			$board.find("." + squareClass).removeClass("highlight-black");
			$board.find("." + squareClass).removeClass("highlight-hint");

			// Undo twice: Opponent's latest move, followed by player's latest move
			undo();
			window.setTimeout(function () {
				undo();
				window.setTimeout(function () {
					showHint();
				}, 250);
			}, 250);
		} else {
			alert("Nothing to undo.");
		}
	};

	function redo() {
		game.move(undo_stack.pop());
		board.position(game.fen());
	}

	const handelRedoBtn = () => {
		if (undo_stack.length >= 2) {
			// Redo twice: Player's last move, followed by opponent's last move
			redo();
			window.setTimeout(function () {
				redo();
				window.setTimeout(function () {
					showHint();
				}, 250);
			}, 250);
		} else {
			alert("Nothing to redo.");
		}
	};

	$("#showHint").change(function () {
		window.setTimeout(showHint, 250);
	});

	function showHint() {
		if (typeof document !== undefined) {
			var showHint = document.getElementById("showHint");
			$board.find("." + squareClass).removeClass("highlight-hint");

			// Show hint (best move for white)
			if (showHint.checked) {
				var move = getBestMove(game, "w", -globalSum)[0];

				$board.find(".square-" + move.from).addClass("highlight-hint");
				$board.find(".square-" + move.to).addClass("highlight-hint");
			}
		}
	}

	/*
	 * The remaining code is adapted from chessboard.js examples #5000 through #5005:
	 * https://chessboardjs.com/examples#5000
	 */
	function removeGreySquares() {
		$("#myBoard .square-55d63").css("background", "");
	}

	function greySquare(square) {
		var $square = $("#myBoard .square-" + square);

		var background = whiteSquareGrey;
		if ($square.hasClass("black-3c85d")) {
			background = blackSquareGrey;
		}

		$square.css("background", background);
	}

	function onDragStart(source, piece) {
		// do not pick up pieces if the game is over
		if (game.game_over()) return false;

		// or if it's not that side's turn
		if (
			(game.turn() === "w" && piece.search(/^b/) !== -1) ||
			(game.turn() === "b" && piece.search(/^w/) !== -1)
		) {
			return false;
		}
	}

	function onDrop(source, target) {
		undo_stack = [];
		removeGreySquares();

		// see if the move is legal
		var move = game.move({
			from: source,
			to: target,
			promotion: "q", // NOTE: always promote to a queen for example simplicity
		});

		// Illegal move
		if (move === null) return "snapback";

		globalSum = evaluateBoard(game, move, globalSum, "b");
		updateAdvantage();

		// Highlight latest move
		$board.find("." + squareClass).removeClass("highlight-white");

		$board.find(".square-" + move.from).addClass("highlight-white");
		squareToHighlight = move.to;
		colorToHighlight = "white";

		$board.find(".square-" + squareToHighlight).addClass("highlight-" + colorToHighlight);

		if (!checkStatus("black"));
		{
			// Make the best move for black
			window.setTimeout(function () {
				makeBestMove("b");
				window.setTimeout(function () {
					showHint();
				}, 250);
			}, 250);
		}
	}

	function onMouseoverSquare(square, piece) {
		// get list of possible moves for this square
		var moves = game.moves({
			square: square,
			verbose: true,
		});

		// exit if there are no moves available for this square
		if (moves.length === 0) return;

		// highlight the square they moused over
		greySquare(square);

		// highlight the possible squares for this piece
		for (var i = 0; i < moves.length; i++) {
			greySquare(moves[i].to);
		}
	}

	function onMouseoutSquare(square, piece) {
		removeGreySquares();
	}

	function onSnapEnd() {
		board.position(game.fen());
	}

	/**
	 * quit game API end call
	 */
	const handelQuitGame = async () => {
		let token =
			"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJnYW1lX2lkIjoxMywiYmF0dGxlX2lkIjoxLCJ1c2VyX2lkIjozMCwidXNlcl9uYW1lIjoiQWthc2giLCJwcm9maWxlX3BpY3R1cmUiOiJodHRwOi8vMy4xMzcuODYuMjM3OjUwMDAvcHJvZmlsZV9waG90by8xNjkxNTc0ODA0MDUwLWp1c3RnYW1lLnBuZyIsImJvdF9pZCI6bnVsbCwiYm90X25hbWUiOm51bGwsImVudHJ5X2ZlZSI6NTAsIndpbm5pbmdfYW1vdW50Ijo5OCwiaWF0IjoxNjkzMjA3NDk0LCJleHAiOjE3MjQ3NjUwOTR9.c3xwtN1FdVOLRVzBpsWe5R4KLrd_4dy0F6ru9Zf6pmU";
		const config = {
			headers: { Authorization: `Bearer ${token}` },
		};

		const bodyParameters = {
			key: "value",
		};

		axios
			.post("http://3.137.86.237:5000/api/v2/player-return", bodyParameters, config)
			.then((data) => {
				router.push("/");
			})
			.catch(() => {});
	};
	return (
		// <div className="board_container">
		// 	{" "}
		// 	<div
		// 		className="board_cont_inn"
		// 		style={{
		// 			width: "100%",
		// 			height: "100%",
		// 			display: "flex",
		// 			justifyContent: "space-between",
		// 		}}>
		// 		{/* <div className="ai_sidebar_suggestion">
		// 			{" "}
		// 			<div class="row text-align-center upper_txt mar-top">
		// 				<div class="col-md-12">
		// 					<h2>Advantage</h2>
		// 					<p>
		// 						<span id="advantageColor">Neither side</span> has the advantage (+
		// 						<span id="advantageNumber">0</span>).
		// 					</p>
		// 					<div class="progress">
		// 						<div
		// 							class="progress-bar bg-primary progress-bar-striped progress-bar-animated"
		// 							role="progressbar"
		// 							aria-valuenow="0"
		// 							style={{ width: "50%" }}
		// 							aria-valuemin="-2000"
		// 							aria-valuemax="4000"
		// 							id="advantageBar"></div>
		// 					</div>
		// 				</div>
		// 			</div>
		// 			<div class="row text-align-center upper_txt mar-top">
		// 				<div class="col-md-12">
		// 					<h2>Status</h2>
		// 					<p>
		// 						<span id="status">No check, checkmate, or draw.</span>
		// 					</p>
		// 				</div>
		// 			</div>
		// 		</div> */}
		// 		<div className="ai_chess_board">
		// 			<div class="col-md-6 col-sm-12">
		// 				<div id="myBoard"></div>
		// 				<div class="row my-3 text-align-center">
		// 					<div class="col-md-6 my-2 col-6">
		// 						<button class="btn btn-danger" id="undoBtn" onClick={handelUndoBtn}>
		// 							Undo
		// 						</button>
		// 					</div>
		// 					<div class="col-md-6 my-2 col-6">
		// 						<button class="btn btn-success" id="redoBtn" onClick={handelRedoBtn}>
		// 							Redo
		// 						</button>
		// 					</div>
		// 				</div>
		// 			</div>
		// 		</div>
		// 		{/* <div className="ai_sidebar_menu">
		// 			<nav className="main-menu">
		// 				<ul>
		// 					<div id="accordion">
		// 						<li>
		// 							<i className={`fa fa-gear  fa-2x `}></i>
		// 							<span className="nav-text">
		// 								{" "}
		// 								<div class="card">
		// 									<div class="card-header" id="settingsHeading">
		// 										<h2 class="text-align-center">
		// 											<button
		// 												class="btn btn-header no-outline"
		// 												data-toggle="collapse"
		// 												data-target="#settings"
		// 												aria-expanded="true"
		// 												aria-controls="settings">
		// 												Settings
		// 											</button>
		// 										</h2>
		// 									</div>
		// 								</div>{" "}
		// 								<div
		// 									id="settings"
		// 									class="collapse"
		// 									aria-labelledby="settingsHeading"
		// 									data-parent="#accordion">
		// 									<div class="card-body">
		// 										<div class="row align-items-center justify-content-center">
		// 											<div class="form-group">
		// 												<label for="search-depth">Search Depth (Black):</label>
		// 												<select id="search-depth">
		// 													<option value="1">1</option>
		// 													<option value="2">2</option>
		// 													<option value="3" selected>
		// 														3
		// 													</option>
		// 													<option value="4">4</option>
		// 													<option value="5">5</option>
		// 												</select>
		// 											</div>
		// 										</div>
		// 										<div class="row align-items-center justify-content-center">
		// 											<div class="form-group">
		// 												<label for="search-depth-white">Search Depth (White):</label>
		// 												<select id="search-depth-white">
		// 													<option value="1">1</option>
		// 													<option value="2">2</option>
		// 													<option value="3" selected>
		// 														3
		// 													</option>
		// 													<option value="4">4</option>
		// 													<option value="5">5</option>
		// 												</select>
		// 											</div>
		// 										</div>
		// 										<div class="row align-items-center justify-content-center">
		// 											<div class="form-group">
		// 												<input type="checkbox" id="showHint" name="showHint" value="showHint" />
		// 												<label for="showHint">Show Suggested Move (White)</label>
		// 											</div>
		// 										</div>
		// 									</div>
		// 								</div>
		// 							</span>
		// 						</li>

		// 						<li>
		// 							<i class="fa fa-map-marker fa-2x"></i>
		// 							<span className="nav-text">
		// 								{" "}
		// 								<div class="card">
		// 									<div class="card-header" id="openingPositionsHeading">
		// 										<h2 class="text-align-center">
		// 											<button
		// 												class="btn btn-header no-outline"
		// 												data-toggle="collapse"
		// 												data-target="#openingPositions"
		// 												aria-expanded="true"
		// 												aria-controls="openingPositions">
		// 												Opening Positions
		// 											</button>
		// 										</h2>
		// 									</div>
		// 								</div>
		// 								<div
		// 									id="openingPositions"
		// 									class="collapse"
		// 									aria-labelledby="openingPositionsHeading"
		// 									data-parent="#accordion">
		// 									<div class="card-body">
		// 										<div class="row my-3 text-align-center">
		// 											<div class="col-md-6 my-2">
		// 												<button class="btn btn-primary" id="ruyLopezBtn" onClick={handelruLopezBtn}>
		// 													Ruy Lopez
		// 												</button>
		// 											</div>
		// 											<div class="col-md-6 my-2">
		// 												<button class="btn btn-primary" id="italianGameBtn" onClick={handelItalianGameBtn}>
		// 													Italian Game
		// 												</button>
		// 											</div>
		// 										</div>
		// 										<div class="row my-3 text-align-center">
		// 											<div class="col-md-6 my-2">
		// 												<button
		// 													class="btn btn-primary"
		// 													id="sicilianDefenseBtn"
		// 													onClick={handelSicilianDefenseBtn}>
		// 													Sicilian Defense
		// 												</button>
		// 											</div>
		// 											<div class="col-md-6 my-2">
		// 												<button class="btn btn-primary" id="startBtn" onClick={handelStartBtn}>
		// 													Start Position
		// 												</button>
		// 											</div>
		// 										</div>
		// 									</div>
		// 								</div>
		// 							</span>
		// 						</li>
		// 						<li>
		// 							<i class="fa fa-desktop fa-2x"></i>
		// 							<span className="nav-text">
		// 								<div class="card">
		// 									<div class="card-header" id="compVsCompHeading">
		// 										<h2 class="text-align-center">
		// 											<button
		// 												class="btn btn-header no-outline"
		// 												data-toggle="collapse"
		// 												data-target="#compVsComp"
		// 												aria-expanded="true"
		// 												aria-controls="compVsComp">
		// 												Computer vs. Computer
		// 											</button>
		// 										</h2>
		// 									</div>
		// 								</div>
		// 								<div
		// 									id="compVsComp"
		// 									class="collapse"
		// 									aria-labelledby="compVsCompHeading"
		// 									data-parent="#accordion">
		// 									<div class="card-body">
		// 										<div class="row text-align-center">
		// 											<div class="col-md-6 my-2">
		// 												<button class="btn btn-success" id="compVsCompBtn" onClick={handelComVsComBtn}>
		// 													Start Game
		// 												</button>
		// 											</div>
		// 											<div class="col-md-6 my-2">
		// 												<button class="btn btn-danger" id="resetBtn" onClick={handelResetBtn}>
		// 													Stop and Reset
		// 												</button>
		// 											</div>
		// 										</div>
		// 									</div>
		// 								</div>
		// 							</span>
		// 						</li>
		// 					</div>
		// 				</ul>
		// 			</nav>
		// 		</div> */}
		// 	</div>
		// </div>
		<main>
			<div className="view_container">
				{/*<--start::play with player wrapper---->*/}
				<div className="play_wrapper">
					{/*<--start::bg screen---->*/}
					<div className="player_bg">
						{/*<--start::shadow overlay ---->*/}
						<div className="card_over_lay">
							{quitGame && (
								<div className="quit_game_bg">
									<div className="quit_game_wrapper">
										<div className="quit_game_text"></div>
										<div className="quit_game_btn">
											{" "}
											<button className="yes" onClick={() => handelQuitGame()}>
												Yes
											</button>
											<button className="no" onClick={() => setQuitGame(false)}>
												No
											</button>
										</div>
									</div>
								</div>
							)}

							{/*<--start:: top section ---->*/}
							<div className="top_sec_board">
								<div className="global_timer">
									<div className="quit_game" onClick={() => setQuitGame(true)}></div>
									<div className="g_timer_wrapper">
										<div className="g_timer_stopwatch"></div>
										<div className="g_timer_text">{moment.utc(timeRef.current * 1000).format("mm:ss")}</div>
									</div>
									<div className="sound_wrapper"></div>
								</div>
								<div className="palyer_profile">
									<div className="p_profile_wrapper">
										<div
											className="palyer_name"
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-end",
												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginRight: "3px",
											}}>
											{"Test 0"}
										</div>
										<div className="player_dp">
											{/* {appState.pl.id === appState.turnTime.current_player_id ? (
												<div
													className="progress_bar"
													style={{
														background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
															appState.turnTime.counter
														)}%, #cdc7c89c 0deg)`,
														position: "relative",
														width: "47px",
														height: "50px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Image
														src={player.image}
														width={20}
														height={20}
														alt="i"
														style={{ width: "40px", height: "40px", borderRadius: "10px" }}
													/>
												</div>
											) : (
												<Image
													src={player.image}
													width={20}
													height={20}
													alt="i"
													style={{
														width: "40px",
														height: "40px",
														border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)} */}
											<Image
												src={player.image}
												width={20}
												height={20}
												alt="i"
												style={{
													width: "40px",
													height: "40px",
													border: "2px solid #076aa2",
													borderRadius: "6px",
												}}
											/>
										</div>
									</div>
									<div className="vs_wrapper"></div>
									<div className="o_profile_wrapper">
										<div className="player_dp">
											{/* {false ? (
												<div
													className="progress_bar"
													style={{
														background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
															appState.turnTime.counter
														)}%, #cdc7c89c 0deg)`,
														position: "relative",
														width: "47px",
														height: "50px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Image
														src={opponent.image}
														width={20}
														height={20}
														alt="i"
														style={{ width: "40px", height: "40px", borderRadius: "10px" }}
													/>
												</div>
											) : (
												<Image
													src={opponent.image}
													width={20}
													height={20}
													alt="i"
													style={{
														width: "40px",
														height: "40px",
														border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)} */}
											<Image
												src={opponent.image}
												width={20}
												height={20}
												alt="i"
												style={{
													width: "40px",
													height: "40px",
													border: "2px solid #076aa2",
													borderRadius: "6px",
												}}
											/>
										</div>
										<div
											className="palyer_name"
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-start",

												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginLeft: "3px",
											}}>
											{"AI Bot"}
										</div>
									</div>
								</div>
							</div>
							{/*<--end:: top section ---->*/}
							{/*<--start:: buttom section ---->*/}
							<div className="buttom_sec_board">
								{/*<--start:: game board section ---->*/}
								<div className="boards">
									<div id="myBoard"></div>
									{/* <Chessboard
										width={320}
										position={chessMove.fen}
										onDrop={onDrop}
										onMouseOverSquare={onMouseoverSquare}
										onMouseOutSquare={onMouseoutSquare}
										boardStyle={{
											borderRadius: "5px",
											boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
										}}
										onSnapEnd={onSnapEnd}
										// squareStyles={squareStyles}
										// dropSquareStyle={dropSquareStyle}
										// onDragOverSquare={onDragOverSquare}
										onSquareClick={onSquareClick}
										onSquareRightClick={onSquareRightClick}
									/> */}
								</div>
								{/*<--start:: layer hide ---->*/}
								<nav
									className="main-menu"
									style={{ position: "absolute", top: -100, opacity: 0, height: "30px" }}>
									<ul>
										<div id="accordion">
											<li>
												<i className={`fa fa-gear  fa-2x `}></i>
												<span className="nav-text">
													{" "}
													<div class="card">
														<div class="card-header" id="settingsHeading">
															<h2 class="text-align-center">
																<button
																	class="btn btn-header no-outline"
																	data-toggle="collapse"
																	data-target="#settings"
																	aria-expanded="true"
																	aria-controls="settings">
																	Settings
																</button>
															</h2>
														</div>
													</div>{" "}
													<div
														id="settings"
														class="collapse"
														aria-labelledby="settingsHeading"
														data-parent="#accordion">
														<div class="card-body">
															<div class="row align-items-center justify-content-center">
																<div class="form-group">
																	<label for="search-depth">Search Depth (Black):</label>
																	<select id="search-depth">
																		<option value="1">1</option>
																		<option value="2">2</option>
																		<option value="3" selected>
																			3
																		</option>
																		<option value="4">4</option>
																		<option value="5">5</option>
																	</select>
																</div>
															</div>
															<div class="row align-items-center justify-content-center">
																<div class="form-group">
																	<label for="search-depth-white">Search Depth (White):</label>
																	<select id="search-depth-white">
																		<option value="1">1</option>
																		<option value="2">2</option>
																		<option value="3" selected>
																			3
																		</option>
																		<option value="4">4</option>
																		<option value="5">5</option>
																	</select>
																</div>
															</div>
															<div class="row align-items-center justify-content-center">
																<div class="form-group">
																	<input type="checkbox" id="showHint" name="showHint" value="showHint" />
																	<label for="showHint">Show Suggested Move (White)</label>
																</div>
															</div>
														</div>
													</div>
												</span>
											</li>

											<li>
												<i class="fa fa-map-marker fa-2x"></i>
												<span className="nav-text">
													{" "}
													<div class="card">
														<div class="card-header" id="openingPositionsHeading">
															<h2 class="text-align-center">
																<button
																	class="btn btn-header no-outline"
																	data-toggle="collapse"
																	data-target="#openingPositions"
																	aria-expanded="true"
																	aria-controls="openingPositions">
																	Opening Positions
																</button>
															</h2>
														</div>
													</div>
													<div
														id="openingPositions"
														class="collapse"
														aria-labelledby="openingPositionsHeading"
														data-parent="#accordion">
														<div class="card-body">
															<div class="row my-3 text-align-center">
																<div class="col-md-6 my-2">
																	<button class="btn btn-primary" id="ruyLopezBtn" onClick={handelruLopezBtn}>
																		Ruy Lopez
																	</button>
																</div>
																<div class="col-md-6 my-2">
																	<button
																		class="btn btn-primary"
																		id="italianGameBtn"
																		onClick={handelItalianGameBtn}>
																		Italian Game
																	</button>
																</div>
															</div>
															<div class="row my-3 text-align-center">
																<div class="col-md-6 my-2">
																	<button
																		class="btn btn-primary"
																		id="sicilianDefenseBtn"
																		onClick={handelSicilianDefenseBtn}>
																		Sicilian Defense
																	</button>
																</div>
																<div class="col-md-6 my-2">
																	<button class="btn btn-primary" id="startBtn" onClick={handelStartBtn}>
																		Start Position
																	</button>
																</div>
															</div>
														</div>
													</div>
												</span>
											</li>
											<li>
												<i class="fa fa-desktop fa-2x"></i>
												<span className="nav-text">
													<div class="card">
														<div class="card-header" id="compVsCompHeading">
															<h2 class="text-align-center">
																<button
																	class="btn btn-header no-outline"
																	data-toggle="collapse"
																	data-target="#compVsComp"
																	aria-expanded="true"
																	aria-controls="compVsComp">
																	Computer vs. Computer
																</button>
															</h2>
														</div>
													</div>
													<div
														id="compVsComp"
														class="collapse"
														aria-labelledby="compVsCompHeading"
														data-parent="#accordion">
														<div class="card-body">
															<div class="row text-align-center">
																<div class="col-md-6 my-2">
																	<button class="btn btn-success" id="compVsCompBtn" onClick={handelComVsComBtn}>
																		Start Game
																	</button>
																</div>
																<div class="col-md-6 my-2">
																	<button class="btn btn-danger" id="resetBtn" onClick={handelResetBtn}>
																		Stop and Reset
																	</button>
																</div>
															</div>
														</div>
													</div>
												</span>
											</li>
										</div>
									</ul>
								</nav>
								{/*<--end:: layer hide ---->*/}
								{/*<--end:: game board section ---->*/}
							</div>
							{/*<--end:: buttom section ---->*/}
						</div>
						{/*<--end::shadow overlay ---->*/}
					</div>
					{/*<--end::bg screen---->*/}
				</div>
				{/*<--end::play with player wrapper---->*/}
			</div>
		</main>
	);
}

export default AIboard;
