import React, { useState, useEffect } from "react";
import axios from "axios";

function InteractionContainer(props) {
	const [timeDropdownOpen, setTimeDropdownOpen] = useState(false);
	const [companyDropdownOpen, setCompanyDropdownOpen] = useState(false);

	const [company, setCompany] = useState("");
	const [symbolDataset, setSymbolDataset] = useState("loading");
	const [matches, setMatches] = useState([]);

	function formatPeriod(currentPeriod) {
		switch (currentPeriod) {
			case "day":
				return "3 DAYS";
			case "week":
				return "1 WEEK";
			case "month":
				return "1 MONTH";
			case "year":
				return "1 YEAR";
			default:
				return "INVALID";
		}
	}

	useState(() => {
		document.onclick = e => {
			if (!e.path.find(el => el.id === "toggle-period-dropdown")) {
				setTimeDropdownOpen(false);
				setCompanyDropdownOpen(false);
			}
		};

		axios
			.get(
				"https://finnhub.io/api/v1/stock/symbol?exchange=US&token=bsjt7inrh5rdj1numj1g"
			)
			.then(res => setSymbolDataset(res.data))
			.catch(err => console.log(err));
	}, []);

	async function handleChangeCompany(e) {
		setCompany(e.target.value);
		setCompanyDropdownOpen(!!e.target.value.length);
		if (e.target.value && symbolDataset !== "loading") {
			const result = symbolDataset.filter(val =>
				val.description
					.toLowerCase()
					.includes(e.target.value.toLowerCase())
			);
			setMatches(result);
		}
	}

	return (
		<div className="interaction-container">
			<div className="controls-container">
				<div className="search-company">
					<img
						src={require("../Icons/Search Icon.svg")}
						alt="search icon"
					/>
					<input
						type="text"
						placeholder="Search Company"
						onChange={handleChangeCompany}
						value={company}
					/>
					<div
						className={
							"dropdown" + (companyDropdownOpen ? "" : " hidden")
						}>
						{matches.slice(0, 6).map(match => {
							return (
								<p
									onClick={() => {
										props.setSymbol(match.symbol);
										setCompany("");
									}}>
									{match.description
										.toLowerCase()
										.split(" ")
										.reduce(
											(result, currentWord) =>
												result +
												" " +
												currentWord
													.charAt(0)
													.toUpperCase() +
												currentWord.slice(1),
											""
										)
										.trim()}
								</p>
							);
						})}
					</div>
				</div>
				<div className="time-period">
					<p className="time-label">Period</p>
					<div className="time-period-btn-dropdown">
						<button
							id="toggle-period-dropdown"
							onClick={() => setTimeDropdownOpen(prev => !prev)}>
							<p>{formatPeriod(props.period)}</p>
							<img
								src={require("../Icons/Dropdown Icon.svg")}
								alt="dropdown icon"
							/>
						</button>
						<div
							className={
								"dropdown" + (timeDropdownOpen ? "" : " hidden")
							}>
							<p onClick={() => props.setPeriod("day")}>3 DAYS</p>
							<p onClick={() => props.setPeriod("week")}>1 WEEK</p>
							<p onClick={() => props.setPeriod("month")}>1 MONTH</p>
							<p onClick={() => props.setPeriod("year")}>1 YEAR</p>
						</div>
					</div>
				</div>
			</div>
			<div className="labels-container">
				<h1>{props.symbol}</h1>
				<h2>
					Current:{" "}
					<span
						className={
							"price " +
							(props.isRising ? "price-rise" : "price-drop")
						}>
						${props.currentPrice}
					</span>
				</h2>
			</div>
		</div>
	);
}

export default InteractionContainer;
