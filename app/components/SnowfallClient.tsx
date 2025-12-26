"use client";

import Snowfall from "react-snowfall";

export default function SnowfallClient() {
	return (
		<Snowfall
			snowflakeCount={30}
			style={{
				position: "absolute",
				pointerEvents: "none",
				width: "100%",
				height: "100%",
				zIndex: 9998,
			}}
		/>
	);
}
