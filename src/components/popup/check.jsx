import React from "react";
import { useAppContext } from "@/arbitar/context/Provider";
import { updateCheckStatus } from "@/arbitar/context/reducer/move";
import { gameStatus } from "@/arbitar/context/reducer/constant";
let timeOutId;
function Check() {
	const { appState, dispatch } = useAppContext();

	if (appState.turn === "w") {
		window.setTimeout(() => {
			dispatch(updateCheckStatus(gameStatus.nietherSide));
		}, 4000);
		return (
			<div className="check_shadow">
				<div className="w_check">
					<p>Oops, White in check !</p>
				</div>
			</div>
		);
	}
	if (appState.turn === "b") {
		window.setTimeout(() => {
			dispatch(updateCheckStatus(gameStatus.nietherSide));
		}, 4000);
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
