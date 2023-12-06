import { copyPosition } from "../helper/helper";

let isPawnMove = ({ position, piece, rank, file, x, y }) => {
	const newPosition = copyPosition(position);
	if (!newPosition[x][y] && x !== rank && y !== file) {
		newPosition[rank][y] = "";
	}
	newPosition[Number(rank)][Number(file)] = "";

	newPosition[x][y] = piece;

	return newPosition;
};

let isNotPawnMove = ({ position, piece, rank, file, x, y }) => {
	const newPosition = copyPosition(position);

	const isKing = piece.endsWith("k");
	if (isKing && Math.abs(y - file) > 1) {
		const isWhite = piece.startsWith("w");
		if (y == 2) {
			newPosition[rank][0] = "";
			newPosition[rank][3] = isWhite ? "wr" : "br";
		}
		if (y == 6) {
			newPosition[rank][7] = "";
			newPosition[rank][5] = isWhite ? "wr" : "br";
		}
	}
	newPosition[Number(rank)][Number(file)] = "";

	newPosition[x][y] = piece;

	return newPosition;
};
export { isNotPawnMove, isPawnMove };
