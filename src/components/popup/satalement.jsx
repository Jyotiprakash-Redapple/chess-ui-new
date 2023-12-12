import React from "react";
import { gameStatus } from "@/arbitar/context/reducer/constant";
import { newGameStart } from "@/arbitar/context/reducer/move";
import { useAppContext } from "@/arbitar/context/Provider";
function Satalement() {
	const { appState, dispatch } = useAppContext();
	if (appState.status === gameStatus.ongoing || appState.status === gameStatus.promoting)
		return null;
	if (appState.status === gameStatus.insufficiant) {
		return (
			<div className="insufficient">
				{" "}
				<h1>INSUFFICIENT MATING MATERIAL MATCH DRAW</h1>{" "}
			</div>
		);
	}
	if (appState.status === gameStatus.stalemet) {
		return (
			<div className="stalemate">
				<h1>STALEMATE MATCH DARW</h1> :
			</div>
		);
	}
	return null;
}

export default Satalement;
