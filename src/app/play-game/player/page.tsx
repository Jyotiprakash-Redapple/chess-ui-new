"use client";
import React, { useEffect, useState } from "react";

import Board from "@/components/board/board";
import Image from "next/image";
import { app } from "@/config/appConfig";
import { useAppContext } from "@/arbitar/context/Provider";
import { useRouter } from "next/navigation";
import moment from "moment";
import { IoMdHeart } from "react-icons/io";
import { FaHeartBroken } from "react-icons/fa";
function PlayWithPlayer() {
	const [quitGame, setQuitGame] = useState(false);
	const { player, opponent } = app;
	const router = useRouter();
	const { appState, dispatch } = useAppContext();

	/**
	 * function for calculkate progress bar
	 */
	const calculateProgress = (p: any) => {
		if (p === "0.00") return 0;
		return Number(p) * 3 + 10;
	};
	const handelQuitGame = () => {
		if (appState.socket) {
			appState.socket.emitDisConnect();
			router.push("/", { scroll: false });
		}
	};
	useEffect(() => {
		// Check if the socket is not connected.
		if (!appState.socket) {
			router.push("/", { scroll: false });
		} else {
			appState.socket.getUpdateDetailsFromServer(dispatch);
			appState.socket.onGmaeTime(dispatch);
			appState.socket.onTurnTimer(dispatch);
			appState.socket.onTurnChange(dispatch);
			appState.socket.onGameEnd(dispatch);
		}
	}, []);
	return (
		<main>
			<div className='view_container'>
				{/*<--start::play with player wrapper---->*/}
				<div className='play_wrapper'>
					{/*<--start::bg screen---->*/}
					<div className='player_bg'>
						{/*<--start::shadow overlay ---->*/}
						<div className='card_over_lay'>
							{quitGame && (
								<div className='quit_game_bg'>
									<div className='quit_game_wrapper'>
										<div className='quit_game_text'></div>
										<div className='quit_game_btn'>
											{" "}
											<button className='yes' onClick={() => handelQuitGame()}>
												Yes
											</button>
											<button className='no' onClick={() => setQuitGame(false)}>
												No
											</button>
										</div>
									</div>
								</div>
							)}

							{/*<--start:: top section ---->*/}
							<div className='top_sec_board'>
								<div className='global_timer'>
									<div className='quit_game' onClick={() => setQuitGame(true)}></div>
									<div className='g_timer_wrapper'>
										<div className='g_timer_stopwatch'></div>
										<div className='g_timer_text'>{moment.utc(appState.gameTime * 1000).format("mm:ss")}</div>
									</div>
									<div className='sound_wrapper'></div>
								</div>
								<div className='palyer_profile'>
									<div className='p_profile_wrapper'>
										<div
											className='palyer_name'
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
										<div style={{ position: "absolute", buttom: "0" }}>
											{appState.pl.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)}
										</div>
										<div className='player_dp'>
											{appState.pl.id === appState.turnTime.current_player_id && appState.turnTime.life ? (
												<div
													className='progress_bar'
													style={{
														background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
															appState.turnTime.counter
														)}%, #cdc7c89c 0deg)`,
														position: "relative",
														width: "47px",
														height: "50px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Image src={player.image} width={20} height={20} alt='i' style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
												</div>
											) : (
												<Image
													src={player.image}
													width={20}
													height={20}
													alt='i'
													style={{
														width: "40px",
														height: "40px",
														border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)}
										</div>
									</div>
									<div className='vs_wrapper'></div>
									<div className='o_profile_wrapper'>
										<div className='player_dp'>
											{appState.op.id === appState.turnTime.current_player_id && appState.turnTime.life ? (
												<div
													className='progress_bar'
													style={{
														background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
															appState.turnTime.counter
														)}%, #cdc7c89c 0deg)`,
														position: "relative",
														width: "47px",
														height: "50px",
														borderRadius: "10px",
														display: "flex",
														alignItems: "center",
														justifyContent: "center",
													}}>
													<Image src={opponent.image} width={20} height={20} alt='i' style={{ width: "40px", height: "40px", borderRadius: "10px" }} />
												</div>
											) : (
												<Image
													src={opponent.image}
													width={20}
													height={20}
													alt='i'
													style={{
														width: "40px",
														height: "40px",
														border: "2px solid #076aa2",
														borderRadius: "6px",
													}}
												/>
											)}
										</div>
										<div
											className='palyer_name'
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
										<div style={{ position: "absolute", buttom: "0", right: 0 }}>
											{appState.op.id === appState.turnTime.current_player_id && !appState.turnTime.life ? (
												<FaHeartBroken style={{ color: "#ED5AB3", fontSize: "23px" }} />
											) : (
												<IoMdHeart style={{ color: "#ED5AB3", fontSize: "23px" }} />
											)}
										</div>
									</div>
								</div>

								{/* {appState.opponent === "b" ? (
									<>
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
													}}>
													{appState.pl.user_name}
												</div>
												<div className="player_dp">
													{appState.pl.id === appState.turnTime.current_player_id ? (
														<div
															className="progress_bar"
															style={{
																background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
																	appState.turnTime.counter
																)}%, #cdc7c89c 0deg)`,
																position: "relative",
																width: "47px",
																height: "50px",
																borderRadius: "10px",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}>
															<Image
																src={player.image}
																width={20}
																height={20}
																alt="i"
																style={{ width: "40px", height: "40px", borderRadius: "10px" }}
															/>
														</div>
													) : (
														<Image
															src={player.image}
															width={20}
															height={20}
															alt="i"
															style={{ width: "40px", height: "40px" }}
														/>
													)}
												</div>
											</div>
											<div className="vs_wrapper"></div>
											<div className="o_profile_wrapper">
												<div className="player_dp">
													{appState.op.id === appState.turnTime.current_player_id ? (
														<div
															className="progress_bar"
															style={{
																background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
																	appState.turnTime.counter
																)}%, #cdc7c89c 0deg)`,
																position: "relative",
																width: "47px",
																height: "50px",
																borderRadius: "10px",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}>
															<Image
																src={opponent.image}
																width={20}
																height={20}
																alt="i"
																style={{ width: "40px", height: "40px", borderRadius: "10px" }}
															/>
														</div>
													) : (
														<Image
															src={opponent.image}
															width={20}
															height={20}
															alt="i"
															style={{ width: "40px", height: "40px" }}
														/>
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
													}}>
													{appState.op.user_name}
												</div>
											</div>
										</div>
									</>
								) : (
									<>
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
													}}>
													{appState.pl.user_name}
												</div>
												<div className="player_dp">
													{appState.pl.id === appState.turnTime.current_player_id ? (
														<>
															<div
																className="progress_bar"
																style={{
																	background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
																		appState.turnTime.counter
																	)}%, #cdc7c89c 0deg)`,
																	position: "relative",
																	width: "47px",
																	height: "50px",
																	borderRadius: "10px",
																	display: "flex",
																	alignItems: "center",
																	justifyContent: "center",
																}}>
																{" "}
																<Image
																	src={opponent.image}
																	width={20}
																	height={20}
																	alt="i"
																	style={{ width: "40px", height: "40px" }}
																/>
															</div>
														</>
													) : (
														<Image
															src={opponent.image}
															width={20}
															height={20}
															alt="i"
															style={{ width: "40px", height: "40px" }}
														/>
													)}
												</div>
											</div>
											<div className="vs_wrapper"></div>
											<div className="o_profile_wrapper">
												<div className="player_dp">
													{appState.op.id === appState.turnTime.current_player_id ? (
														<div
															className="progress_bar"
															style={{
																background: `radial-gradient(closest-side, white 0, transparent 77%, transparent 80%), conic-gradient(rgb(90 234 69) ${calculateProgress(
																	appState.turnTime.counter
																)}%, #cdc7c89c 0deg)`,
																position: "relative",
																width: "47px",
																height: "50px",
																borderRadius: "10px",
																display: "flex",
																alignItems: "center",
																justifyContent: "center",
															}}>
															{" "}
															<Image
																src={player.image}
																width={20}
																height={20}
																alt="i"
																style={{ width: "40px", height: "40px", border: "3px solid green" }}
															/>
														</div>
													) : (
														<Image
															src={player.image}
															width={20}
															height={20}
															alt="i"
															style={{ width: "40px", height: "40px", border: "3px solid green" }}
														/>
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
													}}>
													{appState.op.user_name}
												</div>
											</div>
										</div>
									</>
								)} */}
							</div>
							{/*<--end:: top section ---->*/}
							{/*<--start:: buttom section ---->*/}
							<div className='buttom_sec_board'>
								{/*<--start:: game board section ---->*/}
								<div
									className='boards'
									style={{
										transform: appState.opponent === "w" ? `rotate(${180}deg)` : `rotate(${0}deg)`,
									}}>
									<Board />
								</div>
								{/*<--end:: game board section ---->*/}
							</div>
							{/*<--end:: buttom section ---->*/}
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
