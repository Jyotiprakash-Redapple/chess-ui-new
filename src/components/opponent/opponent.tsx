import React, { useEffect, useState } from "react";
import style from "./opponent.module.css";
import Image from "next/image";
import { useAppContext } from "@/arbitar/context/Provider";
import { gameStatus } from "@/arbitar/context/reducer/constant";
import { useRouter } from "next/navigation";
type Props = {
	name: string | null | undefined;
	image: string | null;
	imageArray: string[];
};

function Opponent({ name, image, imageArray }: Props) {
	const [avtars, setAvtars] = useState(imageArray);
	const [nameOpponet, setNameOpponet] = useState(["avik", "ruhul", "lixa", "ebey"]);
	const { appState, dispatch } = useAppContext();
	// reverse the image array
	const router = useRouter();
	useEffect(() => {
		if (appState.status === gameStatus.pending) {
			const interval = setInterval(() => {
				setAvtars([...avtars.slice(1), avtars[0]]);
				setNameOpponet([...nameOpponet.slice(1), nameOpponet[0]]); // Rotate avatars
			}, 100);

			return () => clearInterval(interval);
		} else {
			if (appState.status === gameStatus.ongoing) {
				setTimeout(() => {
					router.push("/play-game/player", { scroll: false });
				}, 2000);
			}
		}
	}, [avtars]);

	return (
		<div className={style.opponent}>
			<div className={style.opponent_wrapper}>
				<div className={style.inner_wrapper}>
					<div className={style.image_wrapper}>
						{appState.status !== gameStatus.pending ? (
							<>
								<Image
									src={image}
									width={20}
									height={20}
									alt="image"
									style={{
										width: "100%",
										height: "100%",
										borderRadius: "5px",
									}}
								/>
							</>
						) : (
							<>
								{avtars.map((avatar, index) => (
									<div className="avatar_opponent" key={index}>
										<Image
											src={avatar}
											width={20}
											height={20}
											alt="image"
											style={{
												width: "100%",
												height: "100%",
												borderRadius: "5px",
											}}
										/>
									</div>
								))}
							</>
						)}
					</div>
					<div className={style.name_wrapper}>
						{appState.status !== gameStatus.pending ? (
							<span
								style={{
									fontWeight: 600,
									color: "#fff",
								}}>
								{name}
							</span>
						) : (
							<>
								{nameOpponet.map((el, idx) => {
									return (
										<div key={idx} className="name_opponent">
											<span
												style={{
													fontWeight: 600,
													color: "transparent",
													textShadow: "0 0 5px rgba(0,0,0,0.5)",
												}}>
												{el}
											</span>
										</div>
									);
								})}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}

export default Opponent;
