import React from "react";

type Props = {
	file: string | number | undefined | null;
	rank: string | number | undefined | null;
	piece: string | number | undefined | null;
};
function piece({ file, rank, piece }: Props) {
	return (
		<div
			className={`piece ${piece} p-${"b"}${file}${rank}`}
			// 		draggable={true}
			// 		onDragStart={handelDragStart}
			// 		onDragEnd={handelDragEnd}
			//   onClick={handelClick}
		>
			{file}-{rank}
		</div>
	);
}

export default piece;
