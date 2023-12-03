import React from "react";
import "@/style/game.css";
import Pieces from "../pieces/pieces";
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
function Board() {
	return (
		<>
			{" "}
			{/* <Rank rank={appState.opponent === "w" ? ranks.reverse() : ranks} /> */}
			<div className="tiles">
				{/* {createPosition().map((r, rank) =>
					r.map((f, file) => (
						<div key={file + "" + rank} className={`${getClassName(7 - rank, file)}`}>
							
						</div>
					))
				)} */}
			</div>
			{/* <Pupup /> */}
			<Pieces />
			{/* <File file={appState.opponent === "w" ? files.reverse() : files} /> */}
		</>
	);
}

export default Board;
