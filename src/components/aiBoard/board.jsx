"use client";
import "@/style/game.css";
import { useEffect, useState, useRef } from "react";
import React from "react";
import { Chess } from "@/arbitar/lib/chess";
import Chessboard from "chessboardjsx";
import { updateProgressBar, isImageUrl, IconPices, pst_b, pst_w, weights } from "../../arbitar/helper/helper";

import Image from "next/image";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/navigation";
function AIboard() {
	//! call use hook
	let game_auth_token = localStorage.getItem("offline_auth_token");
	const boardRef = useRef();
	const router = useRouter();
	let globalSum = useRef(0);

	//! global variable game
	var STACK_SIZE = 50;
	var positionCount;
	var pstOpponent = { w: pst_b, b: pst_w };
	var pstSelf = { w: pst_w, b: pst_b };

	//!handel game state
	const [time, setTime] = useState("");
	const [parentWidth, setParentWidth] = useState(0);
	const [parentHeight, setParentHeight] = useState(0);
	const [quitGame, setQuitGame] = useState(false);
	const [state, setState] = useState({
		fen: "start",
		dropSquareStyle: {},
		squareStyles: {},
		pieceSquare: "",
		square: "",
		history: [],
		game: null,
		validmove: [],
	});

	//! call when your component mount
	useEffect(() => {
		setState((prevState) => {
			return { ...prevState, game: new Chess() };
		});
	}, []);

	/**
	 * info: remove highlight from chess board sqour
	 */
	const removeHighlightSquare = () => {
		setState((prevState) => ({
			...prevState,
			squareStyles: {},
			// squareStyles: squareStyling({
			// 	pieceSquare: prevState.pieceSquare,
			// 	history: prevState.history,
			// }),
		}));
	};

	/**
	 * info: highlight chessboardSqour | style of single sqour
	 */
	const highlightSquare = (sourceSquare, squaresToHighlight) => {
		const highlightStyles = [sourceSquare, ...squaresToHighlight].reduce((a, c) => {
			return {
				...a,
				...{
					[c]: {
						background: "rgba(255, 255, 0, 0.4)",
						// background: "#85a832",
						// border: "2px solid #a83232",
						//  background: "radial-gradient(circle, #fffc00 36%, transparent 40%)",
						// borderRadius: "50%",
					},
				},
				// ...squareStyling({
				// 	history: state.history,
				// 	pieceSquare: state.pieceSquare,
				// }),
			};
		}, {});

		setState((prevState) => ({
			...prevState,
			squareStyles: { ...highlightStyles },
		}));
	};
	const squareStyling = ({ pieceSquare, history }) => {
		const sourceSquare = history && history.length && history[history.length - 1].from;
		const targetSquare = history && history.length && history[history.length - 1].to;

		return {
			[pieceSquare]: { backgroundColor: "rgba(255, 255, 0, 0.4)" },
			...(history &&
				history.length && {
					[sourceSquare]: {
						backgroundColor: "rgba(255, 255, 0, 0.4)",
					},
				}),
			...(history &&
				history.length && {
					[targetSquare]: {
						backgroundColor: "rgba(255, 255, 0, 0.4)",
					},
				}),
		};
	};

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
			//Kings can never be captured
			else if (move.captured === "k") {
				move.captured = "k_e";
			}
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
		try {
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
		} catch (e) {
			console.log(e, "line No");
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
			var [childBestMove, childValue] = minimax(game, depth - 1, alpha, beta, !isMaximizingPlayer, newSum, color);

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
		if (!state.game) return;

		if (state.game.in_checkmate()) {
			// dispatch(dectactCheckmate(color[0] === "w" ? "b" : "w"));
		} else if (state.game.insufficient_material()) {
			// dispatch(dectactInSufficiantMatarial());
		} else if (state.game.in_threefold_repetition()) {
		} else if (state.game.in_stalemate()) {
			// dispatch(dectactStalemet());
		} else if (state.game.in_draw()) {
			// dispatch(dectactStalemet());
		} else if (state.game.in_check()) {
			// dispatch(updateCheckStatus(color[0]));
			return false;
		} else {
			// $("#status").html(`No check, checkmate, or draw.`);
			return false;
		}
		return true;
	}

	const [cpaturePicesBlack, setcapturePicesBlack] = useState({ p: 0, n: 0, b: 0, r: 0, q: 0 });
	const [capturePicesWhite, setCapturePicesWhite] = useState({ p: 0, n: 0, b: 0, r: 0, q: 0 });
	function get_captured_pieces(game, color) {
		const captured = { p: 0, n: 0, b: 0, r: 0, q: 0 };

		for (const move of game.history({ verbose: true })) {
			if (move.hasOwnProperty("captured") && move.color !== color[0]) {
				captured[move.captured]++;
			}
		}

		return captured;
	}

	function updateAdvantage() {
		if (globalSum.current > 0) {
			// $("#advantageColor").text("Black");
			// $("#advantageNumber").text(globalSum);
		} else if (globalSum.current < 0) {
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
			var depth = 2; // 3 is temp
		} else {
			var depth = 3;
		}

		var d = new Date().getTime();
		var [bestMove, bestMoveValue] = minimax(game, depth, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY, true, currSum, color);
		var d2 = new Date().getTime();
		var moveTime = d2 - d;
		var positionsPerS = (positionCount * 1000) / moveTime;

		// $("#position-count").text(positionCount);
		// $("#time").text(moveTime / 1000);
		// $("#positions-per-s").text(Math.round(positionsPerS));

		return [bestMove, bestMoveValue];
	}

	/*
	 * Makes the best legal move for the given color.
	 */

	function checkPicesCapture(x, y) {
		return JSON.stringify(x) === JSON.stringify(y);
	}
	let __play = 0;

	function makeBestMove(color) {
		console.log("BEST MOVE COLOR", color);

		if (!state.game) return;
		if (color === "b") {
			console.log("colore", color, state.game, globalSum.current);
			var move = getBestMove(state.game, color, globalSum.current)[0];
			console.log(move, "current move ");
		} else {
			var move = getBestMove(state.game, color, -globalSum.current)[0];
		}

		if (color === "b") {
			setTimeout(() => {
				globalSum.current = evaluateBoard(state.game, move, globalSum.current, "b");
				updateAdvantage();

				state.game.move(move);

				// let mute = soundManager.getMute();

				// if (mute !== "1") {
				// 	// soundManager.playSound(ChessPicesMoveSound, false, 0);

				// 	soundManager.playChessPicesMoveSound();
				// }

				let capture = get_captured_pieces(state.game, "white");

				setState((prevState) => {
					return { ...prevState, fen: state.game.fen() };
				});

				// soundManager.pauseSound();
				setCapturePicesWhite(capture);

				setState((prevState) => ({
					...prevState,
					// squareStyles: squareStyling({
					// 	pieceSquare: move.to,
					// 	history: prevState.history,
					// }),
					pieceSquare: move.to,
				}));
				checkStatus("white");
			}, 4000);
		} else {
			checkStatus("white");

			setState((prevState) => ({
				...prevState,
				// squareStyles: squareStyling({
				// 	pieceSquare: move.to,
				// 	history: prevState.history,
				// }),
				pieceSquare: move.to,
			}));
		}
	}

	var undo_stack = [];
	// const playMoveSound = () => {
	// 	try {
	// 		var soundPlay = true;
	// 		if (soundPlay) {
	// 			soundPlay = !soundPlay;
	// 			let soundSource = ChessPicesMoveSound;
	// 			let audio = new Audio(soundSource);
	// 			audio.play();
	// 			audio.onended = () => {
	// 				soundPlay = true;
	// 			};
	// 		}
	// 	} catch (e) {
	// 		console.log(e);
	// 	}
	// };

	const onSquareClick = (square = undefined) => {
		// if (isPlaying && isSupported) {
		// 	pause();
		// }
		if (!state.game) return;
		let __play = 1;
		if ("b" === "w") {
			// flagForBlackPicesMovement.current = 1;
			// window.setTimeout(function () {
			// 	makeBestMove("b");
			// 	window.setTimeout(function () {
			// 		// showHint();
			// 	}, 250);
			// }, 3000);
		} else {
			if (state.validmove.length >= 1) {
				let validSqoure = state.validmove[0];
				let _to = validSqoure.to;
				let _form = validSqoure.form;
				let checkValidity = state.game.move({
					from: _to,
					to: square,
					promotion: "q",
				});
				if (checkValidity === null) {
					let checkValidMoves = state.game.moves({
						square: square,
						verbose: true,
					});

					if (checkValidMoves.length === 0) return;

					removeHighlightSquare();

					highlightSquare(
						square,
						checkValidMoves.map((el) => el.to)
					);
					setState((prevState) => {
						return {
							...prevState,
							validmove: [{ to: square, from: checkValidMoves.map((el) => el.to) }],
						};
					});
				} else {
					removeHighlightSquare();

					let capture = get_captured_pieces(state.game, "black");

					// let mute = soundManager.getMute();
					// if (mute !== "1") {
					// 	// soundManager.playSound(ChessPicesMoveSound, false, 0);

					// 	soundManager.playChessPicesMoveSound();
					// }
					setState((prevState) => ({
						...prevState,
						fen: state.game.fen(),
						// history: state.game.history({ verbose: true }),
						pieceSquare: "",
						validmove: [],
					}));

					setcapturePicesBlack(capture);

					// dispatch(
					// 	makeNewMove({
					// 		newPosition: [],
					// 		newMove: [],
					// 	})
					// );
					removeHighlightSquare();

					// soundManager.pauseSound();
					// if (__play == 1) {
					// 	exposedDataKill.pause();
					// } else {
					// 	exposedDataMove.pause();
					// }
					globalSum.current = evaluateBoard(state.game, checkValidity, globalSum.current, "b");
					updateAdvantage();

					if (!checkStatus("black"));
					{
						// Make the best move for black
						window.setTimeout(function () {
							makeBestMove("b");
							window.setTimeout(function () {
								// showHint();
							}, 250);
						}, 3000);
					}
				}
			} else {
				let checkValidMoves = state.game.moves({
					square: square,
					verbose: true,
				});

				if (checkValidMoves.length === 0) return;
				removeHighlightSquare();

				highlightSquare(
					square,
					checkValidMoves.map((el) => el.to)
				);
				setState((prevState) => {
					return {
						...prevState,
						validmove: [{ to: square, from: checkValidMoves.map((el) => el.to) }],
					};
				});
			}
		}
	};

	/**
	 * quit game API end call
	 */
	const handelQuitGame = async () => {
		// if (appState.socket) {
		// 	// let mute = soundManager.getMute();
		// 	// if (mute != "1") {
		// 	// 	// soundManager.playSound(BtnClickSound, false, 0);
		// 	// 	soundManager.playBtnClickSound();
		// 	// }
		// 	appState.socket.emitDisConnect();
		// }
		try {
			const { data } = await axios.post(
				"http://3.137.86.237:5000/api/v2/player-return",
				{},
				{
					headers: {
						"Content-Type": "application/x-www-form-urlencoded",
						Authorization: `Bearer ${game_auth_token}`,
					},
				}
			);
		} catch (e) {}
	};

	function handelResize() {
		const boardElement = boardRef.current;
		if (boardElement) {
			const { width, height } = boardElement.getBoundingClientRect();
			console.log("Parent width:", width);
			console.log("Parent height:", height);
			setParentWidth(width);
			setParentHeight(height);
			// Use width and height as needed
		}
	}

	useEffect(() => {
		window.addEventListener("resize", handelResize);

		const boardElement = boardRef.current;
		if (boardElement) {
			const { width, height } = boardElement.getBoundingClientRect();
			console.log("Parent width:", width);
			console.log("Parent height:", height);
			setParentWidth(width);
			setParentHeight(height);
			// Use width and height as needed
		}

		return () => {
			window.removeEventListener("resize", handelResize);
		};
	}, []);

	/**
	 * Global time Function
	 */

	const [username, setUserName] = useState("--");
	const [profilePicture, setProfilePicture] = useState("/default.png");

	useEffect(() => {
		try {
			let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9asdf";
			const fetch = async () => {
				const data = await axios.get("http://3.137.86.237:5000/api/v2/game-setting?game_id=25", {
					headers: { Authorization: `Bearer ${token}` },
				});
				console.log(data, "dataS");
				let _time = data?.data?.data?.game_setting?.GAMETIME || 600;
				setTime(_time);
			};

			const verifyGameToken = async () => {
				const data = await axios.post(
					"http://3.137.86.237:5000/api/v2/verify-game-token",
					{
						token:
						game_auth_token,
					},
					{
						headers: {
							"Content-Type": "application/x-www-form-urlencoded",
							Authorization: `Bearer ${game_auth_token}`,
						},
					}
				);
				console.log(data, "datadddddS");

				setUserName(data?.data?.data?.user_name);

				setProfilePicture(data?.data?.data?.profile_picture);
			};

			verifyGameToken();

			fetch();
		} catch (e) {}
	}, []);

	/**
	 * call back execute page loading
	 */
	useEffect(() => {
		const intervalId = setInterval(() => {
			if (time === 0) {
				handelQuitGame();
				return;
			}
			setTime((prevTime) => Number(prevTime) - 1);
		}, 1000); // (1000 ms = 1 second)

		return () => clearInterval(intervalId);
	}, []);
	return (
		<main>
			<div className='view_container'>
				{/*<--start::play with player wrapper---->*/}
				<div className='play_wrapper'>
					{/*<--start::bg screen---->*/}
					<div className='player_bg'>
						{/*<--start::shadow overlay ---->*/}
						<div className='card_over_lay'>
							{quitGame && (
								<div className='quit_game_bg'>
									<div className='quit_game_wrapper'>
										<div className='quit_game_text'></div>
										<div className='quit_game_btn'>
											{" "}
											<button className='yes' onClick={() => handelQuitGame()}>
												Yes
											</button>
											<button className='no' onClick={() => setQuitGame(false)}>
												No
											</button>
										</div>
									</div>
								</div>
							)}
							{/*<--start:: top section ---->*/}
							<div className='top_sec_board'>
								<div className='global_timer'>
									<div className='quit_game' onClick={() => setQuitGame(true)}></div>
									<div className='g_timer_wrapper'>
										<div className='g_timer_stopwatch'></div>
										<div className='g_timer_text'>{moment.utc(time * 1000).format("mm:ss")}</div>
									</div>
									<div className='sound_wrapper'></div>
								</div>
								<div className='palyer_profile'>
									<div className='p_profile_wrapper'>
										<div
											className='palyer_name'
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-end",
												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginRight: "3px",
											}}>
											<p
												style={{
													whiteSpace: "nowrap",
													width: "60%",
													overflow: "hidden",
													textOverflow: "ellipsis",
												}}>
												{username}
											</p>
											{/* {"text0"} */}
										</div>
										{/* <div style={{ position: "absolute", top: "13px", left: 0 }}>
											{appState.pl.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)}
										</div> */}
										<div className='player_dp'>
											{0 ? (
												// <div
												// 	className='progress_bar'
												// 	style={{
												// 		background: updateProgressBar(appState.turnTime.counter),
												// 		position: "relative",

												// 		width: "46px",
												// 		height: "46px",
												// 		borderRadius: "10px",
												// 		display: "flex",
												// 		alignItems: "center",
												// 		justifyContent: "center",
												// 		transition: "background 0.3s ease-in-out",
												// 	}}>
												<Image
													src={profilePicture}
													width={20}
													height={20}
													alt='i'
													style={{
														width: "40px",
														height: "40px",
														borderRadius: "6px",
													}}
												/>
											) : (
												// </div>
												<Image
													src={profilePicture}
													width={20}
													height={20}
													alt='i'
													style={{
														width: "40px",
														height: "40px",
														// border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)}
										</div>
									</div>
									<div className='vs_wrapper'></div>
									<div className='o_profile_wrapper'>
										<div className='player_dp'>
											{0 ? (
												// <div
												// 	className='progress_bar'
												// 	style={{
												// 		background: updateProgressBar(appState.turnTime.counter),
												// 		position: "relative",
												// 		width: "46px",
												// 		height: "46px",
												// 		borderRadius: "10px",
												// 		display: "flex",
												// 		alignItems: "center",
												// 		justifyContent: "center",
												// 		transition: "background 0.3s ease-in-out",
												// 	}}>
												<Image
													src={"/default.png"}
													width={20}
													height={20}
													alt='i'
													style={{
														width: "40px",
														height: "40px",
														borderRadius: "6px",
													}}
												/>
											) : (
												// </div>
												<>
													<Image
														src={"/default.png"}
														width={20}
														height={20}
														alt='i'
														style={{
															width: "40px",
															height: "40px",
															// border: "2px solid #076aa2",
															borderRadius: "6px",
														}}
													/>
												</>
											)}
										</div>
										<div
											className='palyer_name'
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-start",

												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginLeft: "3px",
											}}>
											<p
												style={{
													whiteSpace: "nowrap",
													width: "60%",
													overflow: "hidden",
													textOverflow: "ellipsis",
												}}>
												{"Bot"}
											</p>
										</div>
										<div style={{ position: "absolute", top: "13px", right: 0 }}>
											{/* {appState.op.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)} */}
										</div>
									</div>
								</div>
							</div>
							{/*<--end:: top section ---->*/}
							{/*<--start:: buttom section ---->*/}
							<div className='buttom_sec_board'>
								{/*<--start:: game board section ---->*/}
								<div
									className='boards'
									ref={boardRef}
									// style={{
									// 	transform: appState.opponent === "w" ? `rotate(${180}deg)` : `rotate(${0}deg)`,
									// }}
								>
									<div
										className='board_bg'
										style={{
											// transform: appState.opponent === "w" ? `rotate(${180}deg)` : `rotate(${0}deg)`,
											// top: appState.opponent === "w" ? "-31px" : "-56px",
											// left: appState.opponent === "w" ? "-20px" : "-26px",
											top: "-56px",
											left: "-26px",
										}}></div>
									<Chessboard
										id='humanVsHuman'
										width={parentWidth}
										// height={382}
										allowDrag={() => false}
										position={state.fen}
										// onDrop={onDrop}
										// onMouseOverSquare={onMouseOverSquare}
										// onMouseOutSquare={onMouseOutSquare}
										boardStyle={{
											backgroundColor: "transparent",
											position: "absolute",
											// width: "100%",
											// height: "100%",
											borderRadius: "5px",

											boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
										}}
										// onSquareRightClick={onSquareRightClick}
										showNotation={false}
										pieces={{
											// wK: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wk.png"} alt={"wK"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
											// wQ: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wq.png"} alt={"wQ"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
											// wR: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wr.png"} alt={"wR"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
											// wB: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wb.png"} alt={"wB"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
											// wN: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wn.png"} alt={"wN"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,
											// wP: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/wp.png"} alt={"wP"} style={{ width: "100%", height: "100%", objectFit: "contain" }} />,

											wK: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/wk.png"}
													alt={"wK"}
													data-piece='wK'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "30%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											wQ: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/wq.png"}
													alt={"wQ"}
													data-piece='wQ'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "35%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											wR: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/wr.png"}
													alt={"wR"}
													data-piece='wR'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "40%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											wB: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/wb.png"}
													alt={"wB"}
													data-piece='wB'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "37%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											wN: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/wn.png"}
													alt={"wN"}
													data-piece='wN'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "43%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											wP: ({ squareWidth, isDragging }) => <img src={"/game_play/wp.png"} alt={"wP"} style={{ width: "90%", height: "90%", objectFit: "contain" }} />,

											bK: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/bk.png"}
													alt={"bK"}
													data-piece='bK'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "30%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											bQ: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/bq.png"}
													alt={"bQ"}
													data-piece='bQ'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "35%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											bR: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/br.png"}
													alt={"bR"}
													data-piece='bR'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "40%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											bB: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/bb.png"}
													alt={"bB"}
													data-piece='bB'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "37%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											bN: ({ squareWidth, isDragging }) => (
												<img
													src={"/game_play/bn.png"}
													alt={"bN"}
													data-piece='bN'
													style={{
														objectFit: "contain",
														position: "absolute",
														top: "43%",
														left: "50%",
														transform: "translate(-50%,-50%)",
													}}
												/>
											),
											bP: ({ squareWidth, isDragging }) => <img src={"/game_play/bp.png"} alt={"bP"} style={{ width: "90%", height: "90%", objectFit: "contain" }} />,

											// bK: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/bk.png"} alt={"bK"} style={{ width: "100%", height: "100%" }} />,
											// bQ: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/bq.png"} alt={"bQ"} style={{ width: "95%", height: "95%" }} />,
											// bR: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/br.png"} alt={"bR"} style={{ width: "85%", height: "85%" }} />,
											// bB: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/bb.png"} alt={"bB"} style={{ width: "90%", height: "90%" }} />,
											// bN: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/bn.png"} alt={"bN"} style={{ width: "87%", height: "87%" }} />,
											// bP: ({ squareWidth, isDragging }) => <img src={"/asset/game_play/bp.png"} alt={"bP"} style={{ width: "98%", height: "98%" }} />,
										}}
										draggable={false}
										squareStyles={state.squareStyles}
										dropSquareStyle={state.dropSquareStyle}
										// onDragOverSquare={onDragOverSquare}
										onSquareClick={onSquareClick}
									/>
								</div>
								{/*<--end:: game board section ---->*/}
							</div>
							{/* <nav
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
							</nav> */}
							{/*<--end:: layer hide ---->*/}
							{/*<--end:: buttom section ---->*/}
							{/* <Popupbox /> */}
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
