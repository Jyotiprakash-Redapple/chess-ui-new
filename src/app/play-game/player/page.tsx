"use client";
import React from "react";
import Board from "@/components/board/board";
import Image from "next/image";
import { app } from "@/config/appConfig";
function PlayWithPlayer() {
	const { player, opponent } = app;
	return (
		<main>
			<div className="view_container">
				{/*<--start::play with player wrapper---->*/}
				<div className="play_wrapper">
					{/*<--start::bg screen---->*/}
					<div className="player_bg">
						{/*<--start::shadow overlay ---->*/}
						<div className="card_over_lay">
							{/*<--start:: top section ---->*/}
							<div className="top_sec_board">
								<div className="global_timer">
									<div className="quit_game"></div>
									<div className="g_timer_wrapper">
										<div className="g_timer_stopwatch"></div>
										<div className="g_timer_text">2.59</div>
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
											}}>
											{player.name}
										</div>
										<div className="player_dp">
											<Image
												src={player.image}
												width={20}
												height={20}
												alt="i"
												style={{ width: "40px", height: "40px", border: "3px solid green" }}
											/>
										</div>
									</div>
									<div className="vs_wrapper"></div>
									<div className="o_profile_wrapper">
										<div className="player_dp">
											<Image
												src={opponent.image}
												width={20}
												height={20}
												alt="i"
												style={{ width: "40px", height: "40px", border: "3px solid green" }}
											/>
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
											{opponent.name}
										</div>
									</div>
								</div>
							</div>
							{/*<--end:: top section ---->*/}
							{/*<--start:: buttom section ---->*/}
							<div className="buttom_sec_board">
								{/*<--start:: game board section ---->*/}
								<div className="boards">
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
