"use client";
import dynamic from "next/dynamic";

const Load = dynamic(() => import("@/components/loader/loder"), {
	ssr: false,
});
import React from "react";

function Page() {
	return (
		<>
			<Load />
		</>
	);
}

export default Page;
