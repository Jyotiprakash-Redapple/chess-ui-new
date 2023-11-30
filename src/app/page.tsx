"use client";
import Image from "next/image";

export default function SplashScreen() {
	return (
		<main>
			<div
				className="w-screen h-screen md:flex items-center justify-center "
				style={{ backgroundColor: "black" }}>
				<div className="md:w-full md:h-full sm:w-full sm:h-full xs:w-full xs:h-full">
					{/* <div></div> */}
					<Image
						src={"/bg.png"}
						alt="Just Game"
						width={1080}
						height={1900}
						priority={true}
						className="h-full w-full object-contain"
					/>
					<Image
						src={"/title_art.png"}
						alt="Just Game"
						width={611}
						height={652}
						priority={true}
						className="w-2/12 object-contain"
						style={{
							position: "absolute",
							top: 0,
							right: 0,
						}}
					/>
				</div>
			</div>
		</main>
	);
}
