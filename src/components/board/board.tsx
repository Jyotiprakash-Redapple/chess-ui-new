import React from "react";
import "@/style/game.css";
import Pieces from "../pieces/pieces";
import { useAppContext } from "@/arbitar/context/Provider";

import { arbitar } from "@/arbitar/game/arbitar";
import { getKingPosition } from "@/arbitar/game/getMoves";
import Popupbox from "../popup/popupbox";
function Board() {
	const { appState } = useAppContext();

	const currentPosition = appState.position[appState.position.length - 1];
	const ranks = Array(8)
		.fill()
		.map((x, i) => 8 - i);
	const files = Array(8)
		.fill()
		.map((x, i) => i + 1);
	/**
	 * check every time king check or not by self invoking function
	 */
	const isChecked = (() => {
		const isChecked = arbitar.isPlayerChecked({
			positionAfterMove: currentPosition,
			player: appState.turn,
		});

		if (isChecked) {
			return getKingPosition(currentPosition, appState.turn);
		}
		return null;
	})();
	/**
	 * get class dynamically
	 */
	const getClassName = (i, j) => {
		let c = "tile";
		c += (i + j) % 2 === 0 ? " tile--dark " : " tile--light ";
		if (appState.candidateMove.find((m) => m[0] === i && m[1] === j)) {
			if (currentPosition[i][j]) {
				c += " attacking";
			} else {
				c += " highlight";
			}
		}

		if (isChecked && isChecked[0] == i && isChecked[1] == j) {
			c += " checked";
		}
		return c;
	};

	return (
		<>
			{" "}
			{/* <Rank rank={appState.opponent === "w" ? ranks.reverse() : ranks} /> */}
			<div className="tiles">
				{currentPosition.map((r, rank) =>
					r.map((f, file) => (
						<div key={file + "" + rank} className={`${getClassName(7 - rank, file)}`}>
							{/* */}
						</div>
					))
				)}
			</div>
			<Popupbox />
			<Pieces />
			{/* <File file={appState.opponent === "w" ? files.reverse() : files} /> */}
		</>
	);
}

export default Board;
