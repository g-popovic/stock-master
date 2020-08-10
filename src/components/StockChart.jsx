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
				color: "#646464"
			},
			tickPlacement: "on",
			tickAmount: 5,
			labels: {
				show: false,
				formatter: function (time) {
					return dayjs(time).format("dd HH:mm");
				}
			},
			axisBorder: {
				show: false
			}
		},
		yaxis: {
			tickAmount: 4,
			labels: {
				formatter: function (val) {
					return String(val);
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
				formatter: function (
					value,
					{ series, seriesIndex, dataPointIndex }
				) {
					return "$" + series[0][dataPointIndex];
				},
				title: {
					formatter: function (
						value,
						{ series, seriesIndex, dataPointIndex }
					) {
						const time = options.xaxis.categories[dataPointIndex];
						return dayjs(time).format("ddd HH:mm ");
					}
				}
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

	useEffect(() => {
		if (props.times === undefined) return;
		axios
			.get(
				`https://finnhub.io/api/v1/stock/candle?symbol=TSLA&resolution=${props.resolution}&from=${props.times.min}&to=${props.times.max}&token=${finnHubToken}&adjusted=false`
			)
			.then(res => {
				setChartReady(false);
				setSeries(prev => {
					prev[0].data =
						props.period === "day"
							? res.data.c.slice(-380, -1)
							: props.period === "week"
							? res.data.c.filter((val, index) => index % 2 === 0)
							: res.data.c;
					return prev;
				});
				setOptions(prev => {
					prev.xaxis.categories =
						props.period === "day"
							? res.data.t.map(time => time * 1000).slice(-380, -1)
							: props.period === "week"
							? res.data.t.filter((val, index) => index % 2 === 0)
							: res.data.t.map(time => time * 1000);
					return prev;
				});
				setChartReady(true);
			})
			.catch(err => console.log(err));
	}, [props.times]);

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
