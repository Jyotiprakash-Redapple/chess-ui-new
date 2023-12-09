import React from "react";
import Promoption from "./promotionbox";
import Satalement from "./satalement";
import Winner from "./winner";
import { useAppContext } from "@/arbitar/context/Provider";

import { gameStatus } from "@/arbitar/context/reducer/constant";
function Popupbox() {
	const { appState, dispatch } = useAppContext();

	if (appState.status === gameStatus.promoting) {
		return (
			<div
				className="popup"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Promoption />
			</div>
		);
	}
	if (appState.status === gameStatus.stalemet || appState.status === gameStatus.insufficiant) {
		return (
			<div
				className="popup"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Satalement />
			</div>
		);
	}

	if (appState.status === gameStatus.white || appState.status === gameStatus.black) {
		return (
			<div
				className="popup"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Winner />
			</div>
		);
	}

	return null;
}

export default Popupbox;
