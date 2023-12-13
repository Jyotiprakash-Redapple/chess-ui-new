"use client";
import React, { useEffect, useState } from "react";
// pages/index.js
import dynamic from "next/dynamic";
const Board = dynamic(() => import("@/components/board/board"), {
	ssr: false,
});
import Image from "next/image";
import { app } from "@/config/appConfig";
import { useAppContext } from "@/arbitar/context/Provider";
import { useRouter } from "next/navigation";
import moment from "moment";
import { IoMdHeart } from "react-icons/io";
import { FaHeartBroken } from "react-icons/fa";
import Popupbox from "@/components/popup/popupbox";
function PlayWithPlayer() {
	const [quitGame, setQuitGame] = useState(false);
	const { player, opponent } = app;
	const router = useRouter();
	const { appState, dispatch } = useAppContext();
	const handelQuitGame = () => {
		if (appState.socket) {
			appState.socket.emitDisConnect();
		}
	};
	/**
	 * function for calculkate progress bar
	 */

	function updateProgressBar(time) {
		let remainingTime = appState.totalTurnTime - Number(time);
		let percentageComplete = 100 - (remainingTime / appState.totalTurnTime) * 100;
		let strokeDashOffsetValue = 100 - percentageComplete;

		// console.log("Percentage Complete:", percentageComplete, "%");
		// console.log("Remaining Time:", remainingTime, "seconds");

		if (isCloseToOne(percentageComplete, 0.000001)) {
			percentageComplete = 0;
		}
		let colour = percentageComplete < 30 ? "#EF4040" : "#A6FF96";
		return `radial-gradient(closest-side, #bb404000 0px, transparent 77%, transparent 80%), conic-gradient(${colour} ${percentageComplete}%, #0062cc 0deg)`;
	}

	// Function to check if a number is close to one (within a small epsilon)
	function isCloseToOne(value, epsilon) {
		return Math.abs(1 - value) < epsilon;
	}

	useEffect(() => {
		// Check if the socket is not connected.
		if (!appState.socket) {
			router.push("/internet-disconnect");
		} else {
		}
	}, []);
	const options = ["q", "r", "b", "n"];
	return (
		<main>
			<div className="view_container">
				{/*<--start::play with player wrapper---->*/}
				<div className="play_wrapper">
					{/*<--start::bg screen---->*/}
					<div className="player_bg">
						{/*<--start::shadow overlay ---->*/}
						<div className="card_over_lay">
							{quitGame && (
								<div className="quit_game_bg">
									<div className="quit_game_wrapper">
										<div className="quit_game_text"></div>
										<div className="quit_game_btn">
											{" "}
											<button className="yes" onClick={() => handelQuitGame()}>
												Yes
											</button>
											<button className="no" onClick={() => setQuitGame(false)}>
												No
											</button>
										</div>
									</div>
								</div>
							)}

							{/*<--start:: top section ---->*/}
							<div className="top_sec_board">
								<div className="global_timer">
									<div className="quit_game" onClick={() => setQuitGame(true)}></div>
									<div className="g_timer_wrapper">
										<div className="g_timer_stopwatch"></div>
										<div className="g_timer_text">
											{moment.utc(appState?.gameTime * 1000).format("mm:ss")}
										</div>
									</div>
									<div className="sound_wrapper"></div>
								</div>
								<div className="palyer_profile">
									<div className="p_profile_wrapper">
										<div
											className="palyer_name"
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-end",
												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginRight: "3px",
											}}>
											{appState.pl.user_name}
										</div>
										<div style={{ position: "absolute", top: "13px", left: 0 }}>
											{appState.pl.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)}
										</div>
										<div className="player_dp">
											{appState.pl.id === appState.turnTime.current_player_id && appState.turnTime.life ? (
												<div
													className="progress_bar"
													style={{
														background: updateProgressBar(appState.turnTime.counter),
														position: "relative",

														width: "46px",
														height: "46px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														transition: "background 0.3s ease-in-out",
													}}>
													<Image
														src={appState?.pl.profile}
														width={20}
														height={20}
														alt="i"
														style={{
															width: "40px",
															height: "40px",
															borderRadius: "6px",
														}}
													/>
												</div>
											) : (
												<Image
													src={appState.pl.profile}
													width={20}
													height={20}
													alt="i"
													style={{
														width: "40px",
														height: "40px",
														// border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)}
										</div>
									</div>
									<div className="vs_wrapper"></div>
									<div className="o_profile_wrapper">
										<div className="player_dp">
											{appState.op.id === appState.turnTime.current_player_id && appState.turnTime.life ? (
												<div
													className="progress_bar"
													style={{
														background: updateProgressBar(appState.turnTime.counter),
														position: "relative",
														width: "46px",
														height: "46px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
														transition: "background 0.3s ease-in-out",
													}}>
													<Image
														src={appState.op.profile}
														width={20}
														height={20}
														alt="i"
														style={{
															width: "40px",
															height: "40px",
															borderRadius: "6px",
														}}
													/>
												</div>
											) : (
												<>
													<Image
														src={appState.op.profile}
														width={20}
														height={20}
														alt="i"
														style={{
															width: "40px",
															height: "40px",
															// border: "2px solid #076aa2",
															borderRadius: "6px",
														}}
													/>
												</>
											)}
										</div>
										<div
											className="palyer_name"
											style={{
												width: "70%",
												display: "flex",
												justifyContent: "flex-start",

												color: "#fff",
												fontSize: "15px",
												fontWeight: "500",
												marginLeft: "3px",
											}}>
											{appState.op.user_name}
										</div>
										<div style={{ position: "absolute", top: "13px", right: 0 }}>
											{appState.op.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)}
										</div>
									</div>
								</div>
							</div>
							{/*<--end:: top section ---->*/}
							{/*<--start:: buttom section ---->*/}
							<div className="buttom_sec_board">
								{/*<--start:: game board section ---->*/}
								<div
									className="boards"
									style={{
										transform: appState.opponent === "w" ? `rotate(${180}deg)` : `rotate(${0}deg)`,
									}}>
									<div
										className="board_bg"
										style={{
											transform: appState.opponent === "w" ? `rotate(${180}deg)` : `rotate(${0}deg)`,
											top: appState.opponent === "w" ? "-31px" : "-56px",
											left: appState.opponent === "w" ? "-20px" : "-26px",
										}}></div>
									<Board />
									<Popupbox />
								</div>
								{/*<--end:: game board section ---->*/}
							</div>

							{/*<--end:: buttom section ---->*/}
							{/* <Popupbox /> */}
						</div>
						{/*<--end::shadow overlay ---->*/}
					</div>
					{/*<--end::bg screen---->*/}
				</div>
				{/*<--end::play with player wrapper---->*/}
			</div>
		</main>
	);
}

export default PlayWithPlayer;
