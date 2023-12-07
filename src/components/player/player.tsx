import React from "react";
import style from "./player.module.css";
import Image from "next/image";
type Props = {
	name: string | null | undefined;
	image: string | null;
};
function Player({ name, image }: Props) {
	return (
		<div className={style.player}>
			<div className={style.player_wrapper}>
				<div className={style.inner_wrapper}>
					<div className={style.image_wrapper}>
						<Image
							src={image}
							width={20}
							height={20}
							alt='image'
							style={{
								width: "100%",
								height: "100%",
								borderRadius: "5px",
							}}
						/>
					</div>
					<div className={style.name_wrapper}>
						<span
							style={{
								fontWeight: 600,
								color: "#fff",
							}}>
							{name}
						</span>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Player;
