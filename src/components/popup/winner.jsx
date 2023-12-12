import React from "react";
import { gameStatus } from "@/arbitar/context/reducer/constant";
import { useAppContext } from "@/arbitar/context/Provider";
function Winner() {
	const { appState, dispatch } = useAppContext();

	if (appState.status === gameStatus.ongoing || appState.status === gameStatus.promoting)
		return null;

	const isWin = appState.status.endsWith("wins");

	const getClassName = () => {
		if (isWin) {
			if (appState.status === gameStatus.white) {
				if (appState.opponent === "w") {
					return "defect";
				} else {
					return "wins";
				}
			} else {
				if (appState.status === gameStatus.black) {
					if (appState.opponent === "w") {
						return "wins";
					} else {
						return "defect";
					}
				}
			}
		}
	};

	return (
		<>
			{" "}
			<div className={`popup--inner`}>
				<div className={getClassName()}> </div>
			</div>
		</>
	);
}

export default Winner;
