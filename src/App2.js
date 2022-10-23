import "./App.css";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import "bootstrap/dist/css/bootstrap.min.css";
import { Badge, Button, Modal, Form } from "react-bootstrap";
import logo from "../src/logo.png";

const socket = io.connect("http://localhost:3001");
let airQualityChart;

function App2() {
  const emailRef = useRef(null);
  const pwRef = useRef(null);
  const [slot1, setSlot1] = useState("empty");
  const [slot2, setSlot2] = useState("empty");
  const [slot3, setSlot3] = useState("empty");
  const [isAdmin, setIsAdmin] = useState(false);
  const chartRef = useRef(null);
  const [availability, setAvailability] = useState(3);
  const email = "ifn649demo@gmail.com";
  const pw = "12345678";

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleLogin = () => {
    if (emailRef.current.value === email && pwRef.current.value === pw) {
      setIsAdmin(true);
      handleClose();
    } else {
      setIsAdmin(false);
      alert("wrong login details!");
    }
  };

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
    toolbox: {
      show: true,
      feature: {
        //dataView: { readOnly: true },
        restore: {},
        saveAsImage: {},
      },
    },
    dataZoom: [
      {
        type: "slider",
      },
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
              name: "max",
            },
            {
              type: "min",
              name: "min",
            },
          ],
        },
        data: (function () {
          var now = new Date();
          var res = [];
          var len = 30;
          while (len--) {
            res.unshift(now.toLocaleTimeString().replace(/^\D*/, ""));
            now = new Date(now - 3000);
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
        max: 900,
        min: 400,
        // boundaryGap: [0.2, 0.2]
        boundaryGap: [0, "100%"],
      },
    ],
    series: [
      {
        name: "Air Quality",
        type: "line",
        data: (function (data) {
          var res = [];
          var len = 0;
          while (len < 30) {
            res.push(data);
            len++;
          }
          return res;
        })(),
      },
    ],
  };

  useEffect(() => {
    socket.on("availability", (data) => {
      let slot = data.split(":")[0];
      let status;
      if (data.split(":")[1] === "0") {
        status = "filled";
        let temp = availability;
        setAvailability(temp--);
      } else if (data.split(":")[1] === "1") {
        status = "empty";
        let temp = availability;
        setAvailability(temp++);
      }
      console.log(slot);
      console.log(status);
      if (slot === "slot1") {
        setSlot1(status);
      } else if (slot === "slot2") {
        setSlot2(status);
      } else if (slot === "slot3") {
        setSlot3(status);
      }
    });

    socket.on("air", (data) => {
      if (
        airQualityChart != null &&
        airQualityChart != "" &&
        airQualityChart != undefined
      ) {
        airQualityChart.dispose();
      }
      airQualityChart = echarts.init(chartRef.current);
      airQualityChart.setOption(option);

      var axisData = new Date().toLocaleTimeString().replace(/^\D*/, "");

      var data0 = option.series[0].data;
      data0.shift();
      data0.push(data);

      option.xAxis[0].data.shift();
      option.xAxis[0].data.push(axisData);

      airQualityChart.setOption(option);
    });
  }, [socket]);

  return (
    <div className="App">
      <table>
        <thead>
          <tr>
            <td>Slot 1</td>
            <td>Slot 2</td>
            <td>Slot 3</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{slot1}</td>
            <td>{slot2}</td>
            <td>{slot3}</td>
          </tr>
        </tbody>
      </table>

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

export default App2;
