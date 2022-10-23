import "./App.css";
import io from "socket.io-client";
import { useRef, useEffect, useState } from "react";
import * as echarts from "echarts";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Badge,
  Button,
  Modal,
  Form,
  Row,
  Col,
  Container,
} from "react-bootstrap";
import logo from "../src/logo.png";
import car from "../src/taxi.png";

const socket = io.connect("http://localhost:3001");
let airQualityChart;

function App() {
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
        max: 3000,
        min: 1500,
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
    let count = 0;
    if (slot1 === "empty") {
      count++;
    }
    if (slot2 === "empty") {
      count++;
    }
    if (slot3 === "empty") {
      count++;
    }
    setAvailability(count);
  }, [slot1, slot2, slot3]);

  useEffect(() => {
    //let temp;
    socket.on("availability", (data) => {
      let slot = data.split(":")[0];
      let status;
      if (data.split(":")[1] === "0") {
        status = "filled";
      } else if (data.split(":")[1] === "1") {
        status = "empty";
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
    <div className="App" style={{ padding: "20px" }}>
      <div className="heading">
        <div style={{ width: "30%" }} className="title">
          <img
            src={logo}
            alt="logo"
            style={{ width: "50px", height: "50px", marginRight: "10px" }}
          />
          City Square Car Park
        </div>

        <div
          style={{
            width: "70%",
            textAlign: "right",
            color: "white",

            float: "right",
          }}
        >
          <Button variant="dark" onClick={handleShow}>
            Login as Admin
          </Button>{" "}
        </div>
      </div>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Login Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                ref={emailRef}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                ref={pwRef}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogin}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      <Container style={{ marginTop: "50px" }}>
        <Row
          style={{
            height: "300px",
          }}
        >
          <Col
            style={{
              border: "solid",
              borderColor: "grey",
              borderWidth: "2px",
              paddingTop: "10px",
              fontWeight: "bolder",
            }}
          >
            <div style={{ height: "30%" }}>Slot One</div>
            <div>
              {slot1 === "filled" ? (
                <img
                  src={car}
                  alt="car"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
          <Col
            style={{
              border: "solid",
              borderColor: "grey",
              borderWidth: "2px",
              paddingTop: "10px",
              fontWeight: "bolder",
            }}
          >
            <div style={{ height: "30%" }}>Slot Two</div>
            <div>
              {slot2 === "filled" ? (
                <img
                  src={car}
                  alt="car"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
          <Col
            style={{
              border: "solid",
              borderColor: "grey",
              borderWidth: "2px",
              paddingTop: "10px",
              fontWeight: "bolder",
            }}
          >
            <div style={{ height: "30%" }}>Slot Three</div>
            <div>
              {slot3 === "filled" ? (
                <img
                  src={car}
                  alt="car"
                  style={{
                    width: "100px",
                    height: "100px",
                    marginRight: "10px",
                  }}
                />
              ) : (
                <></>
              )}
            </div>
          </Col>
        </Row>
      </Container>

      <div
        style={{
          marginTop: "20px",
          fontSize: "20px",
        }}
      >
        Available Parking Slots:
        {availability > 0 ? (
          <Badge bg="success" style={{ marginLeft: "5px" }}>
            {availability}
          </Badge>
        ) : (
          <Badge bg="danger">FULL</Badge>
        )}
      </div>

      {isAdmin ? (
        <div
          ref={chartRef}
          style={{
            width: "1200px",
            height: "500px",
            display: "block",
            marginTop: "100px !important",
            marginLeft: "120px !important",
          }}
        ></div>
      ) : (
        <div
          ref={chartRef}
          style={{
            width: "1200px",
            height: "500px",
            display: "none",
          }}
        ></div>
      )}
      {/* <div
        ref={chartRef}
        style={{
          width: "1200px",
          height: "500px",
        }}
      ></div> */}
    </div>
  );
}

export default App;
