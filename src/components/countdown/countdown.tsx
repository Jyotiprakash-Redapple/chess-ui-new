import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/arbitar/context/Provider";

import "@/style/countdown.css";
function Countdown() {
	const [time, setTime] = useState<number>(30);

	// const auth_token = localStorage.getItem("auth_token");
	const countRef = React.useRef(30);
	const { appState, dispatch } = useAppContext();
	const router = useRouter();

	const handelBack = () => {
		console.log(appState.position);
		if (!Object.keys(appState.position).length) {
			// router.push(`/?auth_token=${auth_token}`, { scroll: false });
			router.push("/", { scroll: false });
			appState.socket.onQueueLeave();
		}
	};

	React.useEffect(() => {
		const timer = window.setInterval(() => {
			if (countRef.current === 0) return;
			let currentTime = countRef.current;
			countRef.current = Number(currentTime) - 1;
			setTime(currentTime);
		}, 1000);

		return () => {
			window.clearInterval(timer);
		};
	}, []);

	React.useEffect(() => {
		if (countRef.current === 0) {
			handelBack();
		}
	}, [time]);

	// Optionally, you can use another useEffect to reset the timer when the position is found.
	React.useEffect(() => {
		if (Object.keys(appState.position).length) {
			countRef.current = 0;
		}
	}, [appState.position]);
	return (
		<div className="_cont">
			<div className="_spinner"></div>
			<span className="_number">{time}</span>
		</div>
	);
}

export default Countdown;
