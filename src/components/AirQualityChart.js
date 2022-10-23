import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";

var airQualityChart;

export default function AirQualityChart(props) {
  const chartRef = useRef(null);

  let option = {
    title: {
      text: "Air Quality",
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#283b56",
        },
      },
    },
    //   legend: {
    //     data: ["最新成交价"]
    //   },
    toolbox: {
      show: true,
      feature: {
        dataView: { readOnly: true },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "slider",
        // start: 50,
        // end: 100
      },
      // , {
      //     start: 50,
      //     end: 100
      // }
    ],
    xAxis: [
      {
        type: "category",
        boundaryGap: true,
        markPoint: {
          label: {
            normal: {
              textStyle: {
                color: "#fff",
              },
            },
          },
          data: [
            {
              type: "max",
              name: "最大值",
            },
            {
              type: "min",
              name: "最小值",
            },
          ],
        },
        data: (function () {
          var now = new Date();
          var res = [];
          var len = 10;
          while (len--) {
            res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
            now = new Date(now - 2000);
          }
          return res;
        })(),
      },
    ],
    yAxis: [
      {
        type: "value",
        scale: true,
        name: "CO2 (ppm)",
        max: 1300,
        min: 200,
        // boundaryGap: [0.2, 0.2]
        boundaryGap: [0, "100%"],
      },
    ],
    series: [
      {
        name: "Air Quality",
        type: "line",
        data: (function () {
          var res = [];
          var len = 0;
          while (len < 10) {
            //res.push((Math.random() * 10 + 5).toFixed(1) - 0);
            res.push(props.data);
            len++;
          }
          return res;
        })(),
      },
    ],
  };

  useEffect(() => {
    if (
      airQualityChart != null &&
      airQualityChart != "" &&
      airQualityChart != undefined
    ) {
      airQualityChart.dispose();
    }
    airQualityChart = echarts.init(chartRef.current);
    airQualityChart.setOption(option);
    setInterval(() => {
      var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");

      var data0 = option.series[0].data;
      //data0.shift();
      //data0.push((Math.random() * 10 + 5).toFixed(1) - 0);
      data0.push(props.data);

      //option.xAxis[0].data.shift();
      option.xAxis[0].data.push(axisData);

      airQualityChart.setOption(option);
    }, 2100);
  });

  return (
    <div>
      test realtime charts
      <div
        ref={chartRef}
        style={{
          width: "500px",
          height: "300px",
        }}
      ></div>
    </div>
  );
}
