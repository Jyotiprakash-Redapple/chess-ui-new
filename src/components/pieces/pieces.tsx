import React, { useRef } from "react";
import Piece from "../piece/piece";

import { useAppContext } from "@/arbitar/context/Provider";
import { getNewMoveNotation } from "@/arbitar/helper/helper";
import {
	makeNewMove,
	clearCandidates,
	clearPicesSqoureInfo,
	openPromotionBox,
	updateCastlingMove,
	dectactStalemet,
	dectactInSufficiantMatarial,
	dectactCheckmate,
	saveKillPices,
	updateAdvantage,
	updateGameStatus,
	updateCheckStatus,
} from "@/arbitar/context/reducer/move";
import { arbitar } from "@/arbitar/game/arbitar";
import PiecesDropSound from "@/audio/drop_chess.mp3";
import { getCastlingDir, evaluateBoard } from "@/arbitar/game/getMoves";
import { gameStatus } from "@/arbitar/context/reducer/constant";
function Pieces() {
	const { appState, dispatch } = useAppContext();
	const currentPosition = appState.position[appState.position.length - 1];

	const picesRef = useRef();

	/**
	 * get coordinate of parent virtual board
	 */
	const calculateCoords = (e) => {
		const { top, left, width } = picesRef.current.getBoundingClientRect();
		const size = width / 8;
		const y = appState.opponent === "b" ? Math.floor((e.clientX - left) / size) : 7 - Math.floor((e.clientX - left) / size);
		const x = appState.opponent === "b" ? 7 - Math.floor((e.clientY - top) / size) : Math.floor((e.clientY - top) / size);

		return { x, y };
	};

	/**
	 * open promotion box
	 */

	const handelOpenPromotionBox = ({ rank, file, x, y, piece }) => {
		dispatch(openPromotionBox({ rank: Number(rank), file: Number(file), x, y, piece }));
	};

	/**
	 * handel updated castling move
	 */

	const updateCastlingDir = ({ piece, rank, file }) => {
		const dir = getCastlingDir({
			castelDirection: appState.castlingdir,
			piece,
			rank,
			file,
		});
		if (dir) {
			dispatch(updateCastlingMove(dir));
		}
	};

	/**
	 * play sound
	 */
	const playSound = () => {
		try {
			var soundPlay = true;
			if (soundPlay) {
				soundPlay = !soundPlay;
				let soundSource = PiecesDropSound;
				let audio = new Audio(soundSource);
				audio.play();
				audio.onended = () => {
					soundPlay = true;
				};
			}
		} catch (e) {}
	};
	/**
	 * onDrop
	 */
	const onDrop = (e) => {
		try {
			if (appState.pieces_square_info) {
				// playSound();
				const { x, y } = calculateCoords(e);

				const [piece, rank, file] = appState.pieces_square_info.split(",");

				if (appState.candidateMove.find((m) => m[0] === x && m[1] === y)) {
					// Em pasant move when current poition empty
					const opponet = piece.startsWith("w") ? "b" : "w";
					// castelDirection
					const castelDirection = appState.castlingdir[`${piece.startsWith("w") ? "b" : "w"}`];

					// Open promotion box
					if ((piece === "wp" && x === 7 && appState.opponent === "b") || (piece === "bp" && x === 0 && appState.opponent === "w")) {
						handelOpenPromotionBox({ rank, file, x, y });
						return;
					}

					if (piece.endsWith("k") || piece.endsWith("r")) {
						updateCastlingDir({ piece, rank, file });
					}
					const newPosition = arbitar.checkAmove({
						position: currentPosition,
						x,
						y,
						rank,
						file,
						piece,
					});

					const newMove = getNewMoveNotation({
						piece,
						rank,
						file,
						x,
						y,
						position: currentPosition,
					});

					if (newMove.includes("x")) {
						dispatch(
							saveKillPices({
								prevPosition: appState.position[appState.position.length - 1],
								x,
								y,
							})
						);
					}

					const advantages = evaluateBoard({
						status: appState.status,
						piece: piece[1],
						prevSum: appState.advantage,
						opponent: appState.opponent,
						from_: `${String.fromCharCode(97 + Number(file))}${Number(rank) + 1}`,
						to_: `${String.fromCharCode(97 + y)}${x + 1}`,
						x,
						y,
						prevPosition: appState.position[appState.position.length - 1],
						promotion: null,
						opponentColor: appState.opponent,
						moveColor: piece[0],
						newMove,
					});

					const isChecked = arbitar.isPlayerChecked({
						positionAfterMove: newPosition,
						player: opponet,
					});
					console.log(isChecked, "dectate is check or not pices");

					dispatch(updateAdvantage(advantages));

					dispatch(
						makeNewMove({
							newPosition,
							newMove,
						})
					);
					if (arbitar.insufficientMaterial(newPosition)) {
						dispatch(dectactInSufficiantMatarial());
					} else if (arbitar.isStalemate(newPosition, opponet, castelDirection)) {
						dispatch(dectactStalemet());
					} else if (arbitar.isCheckMate(newPosition, opponet, castelDirection)) {
						dispatch(dectactCheckmate(piece[0]));
					} else if (isChecked) {
						console.log("function calll picess");
						let status = isChecked ? opponet : gameStatus.nietherSide;

						dispatch(updateCheckStatus(status));
					}
				}
				dispatch(clearCandidates());
				dispatch(clearPicesSqoureInfo());
			}
		} catch (e) {
			console.log(e, "error Occored");
		}
	};
	/**
	 * drop event handel
	 */
	const handelDrop = (e) => {
		onDrop(e);
	};

	/**
	 * darg over event handel
	 */
	const handeldargOver = (e) => {
		e.preventDefault();
	};

	/**
	 * drop click event handel
	 */
	const handelDropClick = (e) => {
		onDrop(e);
	};

	return (
		<>
			<div className='pieces' ref={picesRef} onClick={handelDropClick} onDrop={handelDrop} onDragOver={handeldargOver}>
				{currentPosition.map((r, rank) =>
					r.map((f, file) => (currentPosition[rank][file] ? <Piece key={rank + "-" + file} rank={rank} file={file} piece={currentPosition[rank][file]} /> : null))
				)}
			</div>
		</>
	);
}

export default Pieces;
