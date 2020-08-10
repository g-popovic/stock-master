import React, { useState } from "react";

function InteractionContainer(props) {
	const [timePanelOpen, setTimePanelOpen] = useState(false);

	function formatPeriod(currentPeriod) {
		switch (currentPeriod) {
			case "day":
				return "1 DAY";
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
				setTimePanelOpen(false);
			}
		};
	}, []);

	return (
		<div className="interaction-container">
			<div className="controls-container">
				<div className="search-company">
					<img
						src={require("../Icons/Search Icon.svg")}
						alt="search icon"
					/>
					<input type="text" placeholder="Search Company" />
				</div>
				<div className="time-period">
					<p className="time-label">Period</p>
					<div className="time-period-btn-dropdown">
						<button
							id="toggle-period-dropdown"
							onClick={() => setTimePanelOpen(prev => !prev)}>
							<p>{formatPeriod(props.period)}</p>
							<img
								src={require("../Icons/Dropdown Icon.svg")}
								alt="dropdown icon"
							/>
						</button>
						<div
							className={
								"dropdown" + (timePanelOpen ? "" : " hidden")
							}>
							<p onClick={() => props.setPeriod("day")}>1 DAY</p>
							<p onClick={() => props.setPeriod("week")}>1 WEEK</p>
							<p onClick={() => props.setPeriod("month")}>1 MONTH</p>
							<p onClick={() => props.setPeriod("year")}>1 YEAR</p>
						</div>
					</div>
				</div>
			</div>
			<div className="labels-container">
				<h1>TSLA</h1>
				<h2>
					Current: <span className="price price-drop">$1,440</span>
				</h2>
			</div>
		</div>
	);
}

export default InteractionContainer;
