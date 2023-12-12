import React from "react";
import { gameStatus } from "@/arbitar/context/reducer/constant";
import { newGameStart } from "@/arbitar/context/reducer/move";
import { useAppContext } from "@/arbitar/context/Provider";
import { updateGameStatus } from "@/arbitar/context/reducer/move";
function Check() {
	const { appState, dispatch } = useAppContext();
	if (appState.status === gameStatus.ongoing || appState.status === gameStatus.promoting)
		return null;

	if (appState.turn === "w") {
		setTimeout(() => {
			dispatch(updateGameStatus());
		}, 2500);
		return (
			<div className="check_shadow">
				<div className="w_check">
					<p>Oops, White in check !</p>
				</div>
			</div>
		);
	}
	if (appState.turn === "b") {
		setTimeout(() => {
			dispatch(updateGameStatus());
		}, 2500);
		return (
			<div className="check_shadow">
				<div className="b_check">
					<p>Oops, Black in check !</p>
				</div>
			</div>
		);
	}
	return null;
}

export default Check;
