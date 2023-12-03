"use client";
import React from "react";
import Board from "../../../components/board/board";
import Image from "next/image";
import { app } from "../../../config/appConfig";
function PlayWithPlayer() {
	const { player, opponent } = app;
	return (
		<main>
			<div className="view_container">
				{/*<--start::play with player wrapper---->*/}
				<div className="play_wrapper">
					<div className="play_player_bg">
						{/*<--start::profile  with player wrapper---->*/}
						<div className="profile">
							<div className="player_profile">
								<span className="player_name">AVIK</span>
								<Image
									src={player.image}
									width={100}
									height={100}
									alt="imahe"
									style={{
										width: "30%",
										height: "90%",
										borderRadius: "10px",
										border: "3px solid #131a50",
									}}
								/>
							</div>
							<div className="plyar_vs_op"></div>
							<div className="opponent_profile">
								<Image
									src={opponent.image}
									width={100}
									height={100}
									alt="imahe"
									style={{
										width: "30%",
										height: "90%",
										borderRadius: "10px",
										border: "3px solid #131a50",
									}}
								/>
								<span
									className="player_name"
									style={{ justifyContent: "flex-start", paddingInline: "5px" }}>
									{opponent.name}
								</span>
							</div>
						</div>
						{/*<--end::profile  with player wrapper---->*/}
						{/*<--start::game_board  with player wrapper---->*/}
						<div className="game_board">
							<Image
								src={"/game_play/fire 1.png"}
								className={"fire_left_top"}
								alt="l"
								width={80}
								height={80}
							/>
							<Image
								src={"/game_play/fire 1.png"}
								className={"fire_right_top"}
								alt="l"
								width={80}
								height={80}
							/>
							<Image
								src={"/game_play/fire 1.png"}
								className={"fire_right_btm"}
								alt="l"
								width={90}
								height={90}
							/>
							<Image
								src={"/game_play/fire 1.png"}
								className={"fire_left_btm"}
								alt="l"
								width={80}
								height={80}
							/>
							<Board />
						</div>
						{/*<--start::game_board  with player wrapper---->*/}
					</div>
				</div>
				{/*<--end::play with player wrapper---->*/}
			</div>
		</main>
	);
}

export default PlayWithPlayer;
