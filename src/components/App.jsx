import React, { useState, useEffect } from "react";
import StockChart from "./StockChart";
import InteractionContainer from "./InteractionContainer";
import Navbar from "./Navbar";
import axios from "axios";

import finnHubToken from "../secrets";

function App() {
	const [period, setPeriod] = useState("week");
	const [times, setTimes] = useState();
	const [symbol, setSymbol] = useState("TSLA");

	const [currentPrice, setCurrentPrice] = useState("00.00");

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
				return 2629743 + 604800 * 2;
			case "year":
				return 31556926;
			default:
				return 604800;
		}
	}

	function getResolution(currentPeriod) {
		switch (currentPeriod) {
			case "day":
				return "15";
			case "week":
				return "60";
			case "month":
				return "D";
			case "year":
				return "D";
			default:
				return "15";
		}
	}

	useEffect(() => {
		axios
			.get(
				`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${finnHubToken}`
			)
			.then(res => setCurrentPrice(res.data.c))
			.catch(err => console.log(err));
	});

	return (
		<>
			<Navbar />
			<InteractionContainer
				setPeriod={setPeriod}
				period={period}
				setSymbol={setSymbol}
				symbol={symbol}
				currentPrice={currentPrice}
			/>
			<StockChart
				times={times}
				period={period}
				resolution={getResolution(period)}
				symbol={symbol}
			/>
		</>
	);
}

export default App;
