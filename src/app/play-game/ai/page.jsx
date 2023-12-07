// pages/index.js
"use client";
import dynamic from "next/dynamic";

const Board = dynamic(() => import("@/components/aiBoard/board"), {
	ssr: false,
});
import React from "react";

function Page() {
	return (
		<>
			<Board />
		</>
	);
}

export default Page;
