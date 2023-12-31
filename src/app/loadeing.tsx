"use client";

import React from "react";
import Image from "next/image";
const loader = 96;
function Loadeing() {
	const [loadeingWidth, setLoadeingWidth] = React.useState(97);

	// React.useEffect(() => {
	// 	// loadeing bar
	// 	const loder = () => {
	// 		console.log("loader");
	// 		const timer = window.setInterval(() => {
	// 			setLoadeingWidth(loadeingWidth + 1);
	// 			if (loadeingWidth === loader) {
	// 				setLoadeingWidth(97);
	// 			}
	// 		}, 500);
	// 		return () => {
	// 			window.clearInterval(timer);
	// 		};
	// 	};
	// 	const handelLoadPage = () => {
	// 		console.log("execuer");
	// 		loder();
	// 	};

	// 	handelLoadPage();
	// }, []);

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
