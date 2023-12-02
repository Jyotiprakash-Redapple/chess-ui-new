"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { app } from "@/config/appConfig";
import { _localStorage } from "@/typo/typo";
export default function SplashScreen() {
	const router = useRouter();

	// check query string
	const checkQuery = async () => {
		const search = window.location.search;

		if (search) {
			const searchParams = await new URLSearchParams(search);
			// game mode online
			console.log("execute");
			if (searchParams.get("auth_token")) {
				let queryVar = searchParams.get("auth_token") as _localStorage;
				localStorage.setItem("auth_token", queryVar);
				router.push("/search-player", { scroll: false });
			} else {
				// game mode offlien
				if (searchParams.get("mode")) {
					let queryVar = searchParams.get("mode") as localStorage;
					localStorage.setItem("game-mode", queryVar);
				}
			}
		} else {
			console.log(
				"%cAuthentication Faild",
				"background-color: white; color: red; font-size: larger; font-weight: 700"
			);
		}
	};

	/* run when component mount in dom */
	useEffect(() => {
		let timer = setTimeout(() => {
			checkQuery();
		}, 1000);
		return () => {
			window.clearTimeout(timer);
		};
	}, []);
	/* run when component mount in dom */
	return (
		<main>
			<div className="view_container">
				<div className="splash_wrapper">
					<div className="splash_background"></div>
					<div className="splash_logo"></div>
				</div>
			</div>
		</main>
	);
}
