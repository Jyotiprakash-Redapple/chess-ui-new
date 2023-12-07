import {
	getRookMoves,
	getKingMoves,
	getKnightMoves,
	getQueenMoves,
	getPawnMoves,
	getBishopMoves,
	getPawnCapture,
	getCastlingMove,
	getEnemyPices,
	getKingPosition,
} from "./getMoves";

import { areSameColorTiles, findPieceCoords } from "../helper/helper";
import { isPawnMove, isNotPawnMove } from "./move";
let arbitar = {
	getRegularMove: function ({ position, rank, file, piece }) {
		if (piece.endsWith("n")) return getKnightMoves({ position, rank, file });
		if (piece.endsWith("b")) return getBishopMoves({ position, piece, rank, file });
		if (piece.endsWith("r")) return getRookMoves({ position, piece, rank, file });
		if (piece.endsWith("q")) return getQueenMoves({ position, piece, rank, file });
		if (piece.endsWith("k")) return getKingMoves({ position, piece, rank, file });
		if (piece.endsWith("p")) return [...getPawnMoves({ position, piece, rank, file })];
	},

	getValidMoves: function ({ position, castelDirection, prevPosition, piece, rank, file }) {
		let moves = this.getRegularMove({ position, piece, rank, file });
		const notInCheckMoves = [];

		if (piece.endsWith("p")) {
			moves = [
				...moves,
				...getPawnCapture({
					position,
					prevPosition,
					piece,
					rank,
					file,
				}),
			];
		}
		if (piece.endsWith("k")) {
			moves = [...moves, ...getCastlingMove({ position, castelDirection, piece, rank, file })];
		}

		moves.forEach(([x, y]) => {
			const positionAfterMove = this.checkAmove({
				position,
				piece,
				rank,
				file,
				x,
				y,
			});

			if (!this.isPlayerChecked({ positionAfterMove, position, player: piece[0] })) {
				notInCheckMoves.push([x, y]);
			}
		});
		return notInCheckMoves;
	},

	// check is pawn or not valid move
	checkAmove: function ({ position, piece, rank, file, x, y }) {
		const isPawn = piece.endsWith("p");
		if (isPawn) {
			return isPawnMove({ position, piece, rank, file, x, y });
		} else {
			return isNotPawnMove({ position, piece, rank, file, x, y });
		}
	},

	// check player check or not
	isPlayerChecked: function ({ positionAfterMove, position, player }) {
		const enemy = player.startsWith("w") ? "b" : "w";
		const kingPos = getKingPosition(positionAfterMove, player);
		const enemyPieces = getEnemyPices(positionAfterMove, enemy);

		const enemyMoves = enemyPieces.reduce(
			(acc, p) =>
				(acc = [
					...acc,
					...(p.piece.endsWith("p")
						? getPawnCapture({
								position: positionAfterMove,
								prevPosition: position,
								...p,
						  })
						: this.getRegularMove({
								position: positionAfterMove,
								...p,
						  })),
				]),
			[]
		);

		if (enemyMoves.some(([x, y]) => kingPos[0] === x && kingPos[1] === y)) return true;
		else return false;
	},

	// check is any stalemate or not

	isStalemate: function (position, player, castleDirection) {
		const isInCheck = this.isPlayerChecked({
			positionAfterMove: position,
			player,
		});

		if (isInCheck) return false;

		const pieces = getEnemyPices(position, player);
		const moves = pieces.reduce(
			(acc, p) =>
				(acc = [
					...acc,
					...this.getValidMoves({
						position,
						castleDirection,
						...p,
					}),
				]),
			[]
		);

		return !isInCheck && moves.length === 0;
	},

	// check for insufficient mating material
	insufficientMaterial: function (position) {
		const pieces = position.reduce((acc, rank) => (acc = [...acc, ...rank.filter((spot) => spot)]), []);

		// King vs. king
		if (pieces.length === 2) return true;

		// King and bishop vs. king
		// King and knight vs. king
		if (pieces.length === 3 && pieces.some((p) => p.endsWith("b") || p.endsWith("n"))) return true;

		// King and bishop vs. king and bishop of the same color as the opponent's bishop
		if (
			pieces.length === 4 &&
			pieces.every((p) => p.endsWith("b") || p.endsWith("k")) &&
			new Set(pieces).size === 4 &&
			areSameColorTiles(findPieceCoords(position, "wb")[0], findPieceCoords(position, "bb")[0])
		)
			return true;

		return false;
	},

	// checkmate
	isCheckMate: function (position, player, castleDirection) {
		const isInCheck = this.isPlayerChecked({
			positionAfterMove: position,
			player,
		});

		if (!isInCheck) return false;

		const pieces = getEnemyPices(position, player);
		const moves = pieces.reduce(
			(acc, p) =>
				(acc = [
					...acc,
					...this.getValidMoves({
						position,
						castleDirection,
						...p,
					}),
				]),
			[]
		);

		console.log(isInCheck && moves.length === 0);
		return isInCheck && moves.length === 0;
	},
};

export { arbitar };
