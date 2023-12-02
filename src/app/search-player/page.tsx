"use client";
import React, { useEffect, useState } from "react";
import { app } from "@/config/appConfig";
import Player from "@/components/player/player";
import Opponent from "@/components/opponent/opponent";
function MatchMackeing() {
	const { player, opponent, imageArray } = app;
	return (
		<main>
			<div className="view_container">
				{/*<--start::match making wrapper---->*/}
				<div className="search_wrapper">
					{/*<--start::match making wrapper bg---->*/}
					<div className="search_banner_bg">
						<div className="inner_wrapper">
							{/*<--start::match making text box ---->*/}
							<div className="match_macking">
								{" "}
								<div className="match_macking_bg"></div>
								<div className="match_macking_logo"></div>
							</div>
							{/*<--end::match making text box ---->*/}
							{/*<--start::match making playr pic and op pic box ---->*/}
							<div className="match_make_player">
								<Player name={player.name} image={player.image} />
								<Opponent name={opponent.name} image={opponent.image} imageArray={imageArray} />
								<span className="player_vs_op"></span>
							</div>
							{/*<--end::match making playr pic and op pic box ---->*/}
						</div>
					</div>
					{/*<--end::match making wrapper bg---->*/}
				</div>
				{/*<--end::match making wrapper---->*/}
			</div>
		</main>
	);
}

export default MatchMackeing;
