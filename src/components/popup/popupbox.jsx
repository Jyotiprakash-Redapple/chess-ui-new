import React from "react";
import Promoption from "./promotionbox";
import Satalement from "./satalement";
import Check from "./check";
import Winner from "./winner";
import { useAppContext } from "@/arbitar/context/Provider";

import { gameStatus } from "@/arbitar/context/reducer/constant";
import { app } from "@/config/appConfig";
function Popupbox() {
	const { appState, dispatch } = useAppContext();

	if (appState.checkStatus === gameStatus.w_check || appState.checkStatus === gameStatus.b_check) {
		return (
			<div
				className="popup--check"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Check />
			</div>
		);
	}
	if (appState.status === gameStatus.promoting) {
		return (
			<div
				className="popup--prompt"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Promoption />
			</div>
		);
	}
	if (appState.status === gameStatus.stalemet) {
		return (
			<div
				className="popup--stalemate"
				style={{
					transform: appState.opponent === "w" ? `rotate(${360}deg)` : `rotate(${0}deg)`,
				}}>
				<Satalement />
			</div>
		);
	}
	if (appState.status === gameStatus.insufficiant) {
		return (
			<div
				className="popup--stalemate"
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
