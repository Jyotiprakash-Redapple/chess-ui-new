// "use client";

// import React from "react";
// import Image from "next/image";
// function Loadeing() {
// 	const [loadeingWidth, setLoadeingWidth] = React.useState(10);
// 	React.useEffect(() => {
// 		// loadeing bar
// 		const loder = () => {
// 			console.log("loader");
// 			const timer = window.setTimeout(() => {
// 				setLoadeingWidth(97);
// 			}, 500);
// 			return () => {
// 				window.clearTimeout(timer);
// 			};
// 		};
// 		const handelLoadPage = () => {
// 			console.log("execuer");
// 			loder();
// 		};

// 		window.addEventListener("load", handelLoadPage);

// 		window.addEventListener("DOMContentLoaded", handelLoadPage);
// 		return () => {
// 			window.removeEventListener("load", handelLoadPage);
// 			window.removeEventListener("DOMContentLoaded", handelLoadPage);
// 		};
// 	}, []);
// 	console.log(loadeingWidth, "oaooo");
// 	return (
// 		<main>
// 			<div className="view_container">
// 				<div className="load_wrapper">
// 					<div className="load_background">
// 						<div className="inner_wrapper">
// 							<div className="loadeing_text"></div>
// 							<div className="loadeing_bg">
// 								<Image
// 									src="/loding/loding bar.png"
// 									width={20}
// 									height={20}
// 									alt="load"
// 									style={{
// 										width: `${loadeingWidth}%`,
// 										objectFit: "contain",
// 										height: "100%",
// 										borderRadius: "10px",
// 									}}
// 								/>
// 							</div>
// 						</div>
// 					</div>
// 					<div className="splash_logo"></div>
// 				</div>
// 			</div>
// 		</main>
// 	);
// }

// export default Loadeing;
