"use client";
// import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import NextNProgress from "nextjs-progressbar";
const inter = Inter({ subsets: ["latin"] });

// export const metadata: Metadata = {
// 	title: "just game",
// 	description: "Generated by create next app",
// };
import Provider from "@/arbitar/context/Provider";

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="UTF-8"></meta>
				<meta name="keywords" content="chess, just Game, ai, multiplayer"></meta>
				<meta name="author" content="Jyoti prakash panigrahi" />
				{/* <meta http-equiv="refresh" content="30"></meta> */}
				<meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
				<link rel="shortcut icon" href="/appIcon/appIcon.png"></link>
				<link rel="preload" href="/bg.png" as="image" />
				<link rel="preload" href="/title.png" as="image" />
				<link rel="preload" href="/splashScreen/bg.png" as="image" />
				<link rel="preload" href="/splashScreen/title.png" as="image" />
				{/* match makeing */}
				<link rel="preload" href="/match_making/bg.png" as="image" />
				<link rel="preload" href="/match_making/banner.png" as="image" />
				<link rel="preload" href="/match_making/blue_flag.png" as="image" />
				<link rel="preload" href="/match_making/red_flag.png" as="image" />
				<link rel="preload" href="/match_making/VS.png" as="image" />
				<link rel="preload" href="/match_making/text.png" as="image" crossOrigin="anonymous" />

				<link rel="preload" href="/game_play/back.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/bg.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/VS.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/Right_player.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/left_player.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/black_layer.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/game_play/shadow.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/gameQuit/banner.png" as="image" crossOrigin="anonymous" />
				<link rel="preload" href="/gameQuit/layer.png" as="image" crossOrigin="anonymous" />
				<title>chess</title>
				{/* <!-- Bootstrap CSS --> */}
				{/* <link
					rel="stylesheet"
					href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css"
					integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh"
					crossOrigin="anonymous"
				/> */}

				{/* <!-- Google Icons (Material Design) --> */}
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/icon?family=Material+Icons"
					crossOrigin="anonymous"
				/>

				{/* <!-- Chessboard JS --> */}
				<link
					rel="stylesheet"
					href="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css"
					integrity="sha384-q94+BZtLrkL1/ohfjR8c6L+A6qzNH9R2hBLwyoAfu3i/WCvQjzL2RQJ3uNHDISdU"
					crossOrigin="anonymous"
				/>
				{/* <script
					defer
					src="https://unpkg.com/@chrisoakman/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"
					integrity="sha384-8Vi8VHwn3vjQ9eUHUxex3JSN/NFqUg3QbPyX8kWyb93+8AC/pPWTzj+nHtbC5bxD"
					crossOrigin="anonymous"></script> */}
				{/* <script defer src="/chessboard.js"></script> */}
				{/* <!-- Bootstrap JS --> */}
				<script
					defer
					src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.bundle.min.js"
					integrity="sha384-6khuMg9gaYr5AxOqhkVIODVIvm9ynTT5J4V1cfthmT+emCG6yVmEZsRHdxlotUnm"
					crossOrigin="anonymous"></script>
				{/* <!-- Chess JS (slightly modified) --> */}
				{/* <!-- <script defer src="/src/arbitar/chess.js"></script> --> */}
			</head>
			<body className={inter.className}>
				<Provider> {children}</Provider>
			</body>
		</html>
	);
}
