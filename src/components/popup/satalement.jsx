import React from "react";
import { gameStatus } from "@/arbitar/context/reducer/constant";
import { newGameStart } from "@/arbitar/context/reducer/move";
import { useAppContext } from "@/arbitar/context/Provider";
function Satalement() {
	const {
		appState: { status },
		dispatch,
	} = useAppContext();

	if (status === gameStatus.ongoing || status === gameStatus.promoting) return null;

	const handelNewGame = () => {
		dispatch(newGameStart());
	};

	const isWin = status.endsWith("wins");
	return (
		<div className="popup--inner popup--inner__center">
			<h1>{isWin ? status : "Draw"}</h1>
			<p>{!isWin && status}</p>
			<div className={`${status}`} />
			{/* <button className='new_game_btn' onClick={() => handelNewGame()}>
				New Game
			</button> */}
		</div>
	);
}

export default Satalement;
