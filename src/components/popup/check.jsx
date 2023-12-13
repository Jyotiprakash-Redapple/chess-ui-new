import React from "react";
import { useAppContext } from "@/arbitar/context/Provider";
import { updateGameStatus } from "@/arbitar/context/reducer/move";
function Check() {
	const { appState, dispatch } = useAppContext();

	if (appState.turn === "w") {
		setTimeout(() => {
			dispatch(updateGameStatus());
		}, 4000);
		return (
			<div className='check_shadow'>
				<div className='w_check'>
					<p>Oops, White in check !</p>
				</div>
			</div>
		);
	}
	if (appState.turn === "b") {
		setTimeout(() => {
			dispatch(updateGameStatus());
		}, 4000);
		return (
			<div className='check_shadow'>
				<div className='b_check'>
					<p>Oops, Black in check !</p>
				</div>
			</div>
		);
	}
	return null;
}

export default Check;
