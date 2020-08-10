import React, { useState, useEffect } from "react";
import Chart from "react-apexcharts";
import axios from "axios";
import dayjs from "dayjs";

import finnHubToken from "../secrets";

function StockChart(props) {
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
		colors: ["#fC7474"],
		dataLabels: {
			enabled: false
		},
		stroke: {
			curve: "straight"
		},
		xaxis: {
			type: "categories",
			axisTicks: {
				show: false
			},
			tickPlacement: "on",
			tickAmount: 5,
			labels: {},
			axisBorder: {
				show: false
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
				color: "#ffff00"
			}
		},
		fill: {
			colors: ["#D32323"],
			type: "gradient",
			gradient: {
				shade: "dark",
				shadeIntensity: 0,
				opacityFrom: 0.5,
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
						height: 360
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
					prev.xaxis.labels.formatter = function (time, index) {
						return formatTime(index);
					};
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
