"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
const loader = 96;
function Loadeing() {
    const gameMode = localStorage.getItem('game_mode')
    console.log(gameMode)
	const [loadeingWidth, setLoadeingWidth] = React.useState(2);
    const router = useRouter()
	React.useEffect(() => {
		// loadeing bar
		const loder = () => {
			console.log("loader");
			const timer = window.setInterval(() => {
				setLoadeingWidth(loadeingWidth + 1);
				if (loadeingWidth === loader) {
                    setLoadeingWidth(97);
                    if (gameMode === 'offline') {
                        router.push('/play-game/player', { scroll: false })
                    } else {
                        if (gameMode === "online") {
                            router.push("/play-game/ai", { scroll: false });
                        }
                    }
				}
			}, 400);
			return () => {
				window.clearInterval(timer);
			};
		};
		const handelLoadPage = () => {
		
			loder();
		};

        handelLoadPage();
        return ()=>{}
	}, []);

	return (
		<main>
			<div className="view_container">
				<div className="load_wrapper">
					<div className="load_background">
						<div className="inner_wrapper">
							<div className="loadeing_text"></div>
							<div className="loadeing_bg">
								<Image
									src="/loding/loding bar.png"
									width={20}
									height={20}
									alt="load"
									style={{
										width: `${loadeingWidth}%`,
										objectFit: "contain",
										height: "100%",
										borderRadius: "10px",
									}}
								/>
							</div>
						</div>
					</div>
					<div className="splash_logo"></div>
				</div>
			</div>
		</main>
	);
}

export default Loadeing;
