"use client";
import React from "react";
import Board from "@/components/board/board";
import Image from "next/image";
function page() {
	return (
		<main>
			<div className="view_container">
				{/*<--start::match making wrapper---->*/}
				<div className="play_wrapper">
					<div className="play_player_bg">
						<div className="profile"></div>
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
					</div>
				</div>
				{/*<--end::match making wrapper---->*/}
			</div>
		</main>
	);
}

export default page;
