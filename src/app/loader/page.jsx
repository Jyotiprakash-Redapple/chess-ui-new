"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
function Loadeing() {
    const gameMode = localStorage.getItem('game_mode')
	console.log(gameMode)
	const widthRef = React.useRef(0)
	 const [loadingWidth, setLoadingWidth] = React.useState(2);
    const router = useRouter()
	React.useEffect(() => {
		// loading bar
		let timer = 0;
		const loader = () => {
		
			 timer = setInterval(() => {
				 widthRef.current = widthRef.current + 1
				 setLoadingWidth(widthRef.current)
				
				if (widthRef.current === 100) {
					widthRef.current = 97
					if (gameMode === 'offline') {
						router.push("/play-game/ai", { scroll: false });
					} else if (gameMode === "online") {
						router.push('/play-game/player', { scroll: false });
					}
					clearInterval(timer);
				}
			}, 600);
		};
	
		const handleLoadPage = () => {
			loader();
		};
	
		handleLoadPage();
	
		return () => {
			// cleanup function to clear interval if component unmounts
			clearInterval(timer);
		};
	}, [widthRef.current , gameMode, router]);;

	// fix loder active bar image 

	return (
		<main>
			<div className="view_container">
				<div className="load_wrapper">
					<div className="load_background">
						<div className="inner_wrapper">
							<div className="loadeing_text"></div>
							<div className="loadeing_bg">
								<img
									key={widthRef.current}
									src="/loding/loding bar.png"
									width={20}
									height={30}
									alt="load"
									style={{
										width: `${loadingWidth}%`,
										objectFit: "cover",
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



