import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import dayjs from "dayjs";

import finnHubToken from "../secrets";

function StockChart(props) {
	const risingColors = { fill: "#46CB54", bg: "#39EF76" };
	const droppingColors = { fill: "#FC7474", bg: "#D32323" };

	const [chartReady, setChartReady] = useState(false);

	const [options, setOptions] = useState({
		chart: {
			type: "area",
			zoom: {
				enabled: false
			},
			height: "100%",
			toolbar: false
		},
		colors: [risingColors.fill],
		dataLabels: {
			enabled: false
		},
		grid: {
			borderColor: "rgba(255, 255, 255, 0.3)"
		},
		stroke: {
			curve: "straight"
		},
		xaxis: {
			type: "categories",
			axisTicks: {
				show: true,
				color: "rgba(255, 255, 255, 0.3)"
			},
			tickPlacement: "on",
			labels: {
				show: true,
				style: {
					colors: "#d8d8d8",
					fontSize: "11"
				},
				rotate: 0
			},
			axisBorder: {
				show: false
			},
			tooltip: {
				enabled: false
			}
		},
		yaxis: {
			tickAmount: 4,
			labels: {
				formatter: function (val) {
					return "$" + (val < 100 ? val : Math.round(val));
				},
				style: {
					colors: "#d8d8d8"
				}
			},
			axisTicks: {
				show: false
			}
		},
		fill: {
			colors: [risingColors.bg],
			type: "gradient",
			gradient: {
				shade: "dark",
				shadeIntensity: 0,
				opacityFrom: 0.45,
				opacityTo: 0.15,
				stops: [30, 120]
			}
		},
		tooltip: {
			theme: "dark",
			y: {
				title: {}
			},
			x: {
				show: false
			},
			marker: {
				show: false
			}
		},
		responsive: [
			{
				breakpoint: 1000,
				options: {
					chart: {
						height: 280
					}
				}
			}
		]
	});
	const [series, setSeries] = useState([
		{
			name: "Closing Price",
			data: []
		}
	]);

	function formatTime(time) {
		switch (props.period) {
			case "day":
				return dayjs(time).format("ddd HH:mm");
			case "week":
				return dayjs(time).format("ddd HH:mm");
			case "month":
				return dayjs(time).format("MMM DD");
			case "year":
				return dayjs(time).format("YYYY MMM DD");
			default:
				return "date:";
		}
	}

	useEffect(() => {
		if (props.times === undefined) return;
		axios
			.get(
				`https://finnhub.io/api/v1/stock/candle?symbol=${props.symbol}&resolution=${props.resolution}&from=${props.times.min}&to=${props.times.max}&token=${finnHubToken}&adjusted=false`
			)
			.then(res => {
				if (res.data.s === "no_data") {
					throw new Error("No data received");
				}

				setChartReady(false);

				setSeries(prev => {
					prev[0].data = res.data.c;
					return prev;
				});
				setOptions(prev => {
					prev.xaxis.categories = res.data.t.map(time => time * 1000);

					prev.tooltip.y.title.formatter = function (
						value,
						{ dataPointIndex }
					) {
						const time = options.xaxis.categories[dataPointIndex];
						return formatTime(time);
					};

					prev.xaxis.labels.formatter = function (value) {
						const index = prev.xaxis.categories.indexOf(value);
						return index === 0 ||
							index === prev.xaxis.categories.length - 1 ||
							index === Math.round(prev.xaxis.categories.length / 2)
							? formatTime(value)
							: "";
					};

					const isRising =
						res.data.c[0] < res.data.c[res.data.c.length - 1];

					props.setIsRising(isRising);

					prev.colors = [
						isRising ? risingColors.fill : droppingColors.fill
					];

					prev.fill.colors = [
						isRising ? risingColors.bg : droppingColors.bg
					];

					return prev;
				});
				setChartReady(true);
			})
			.catch(err => {
				console.log(err);
				alert("There was an unexpected error.");
			});
	}, [props.times, props.symbol]);

	return (
		<div className="chart-container">
			{!chartReady ? null : (
				<Chart
					options={options}
					series={series}
					type="area"
					height={options.chart.height}
				/>
			)}
		</div>
	);
}

export default StockChart;
