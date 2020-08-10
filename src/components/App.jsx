import React, { useState, useEffect } from "react";
import StockChart from "./StockChart";
import InteractionContainer from "./InteractionContainer";
import Navbar from "./Navbar";

function App() {
	const [period, setPeriod] = useState("week");
	const [times, setTimes] = useState();

	useEffect(() => {
		const min = Math.floor(Date.now() / 1000) - getTimeDifference(period);
		const max = Math.floor(Date.now() / 1000);
		setTimes({
			min: min,
			max: max
		});
		console.log(min, max);
	}, [period]);

	function getTimeDifference(currentPeriod) {
		switch (currentPeriod) {
			case "day":
				return 86400 * 3;
			case "week":
				return 604800;
			case "month":
				return 2629743;
			case "year":
				return 31556926;
			default:
				return 604800;
		}
	}

	function getResolution(currentPeriod) {
		switch (currentPeriod) {
			case "day":
				return "1";
			case "week":
				return "5";
			case "month":
				return "60";
			case "year":
				return "D";
			default:
				return "15";
		}
	}

	return (
		<>
			<Navbar />
			<InteractionContainer setPeriod={setPeriod} period={period} />
			<StockChart
				times={times}
				period={period}
				resolution={getResolution(period)}
			/>
		</>
	);
}

export default App;
