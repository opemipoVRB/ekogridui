/*!

=========================================================
* Black Dashboard React v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/black-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4
} from "variables/charts.js";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";


class StakeholderDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        bigChartData: "data1",
        token:Cookies.get('token'),
        dailyLabels: [],
        dailyData: [],
        weeklyData:[],
        weeklyLabels:[],
    };
  }

   componentDidMount(){
        this.getRevenue();
  }


    getFormatDate = (date) => {
    return (
        date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
    );
  };

  getMonthFormat = (date) => {
         const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return (
        months[date.getMonth()]
    );
  };


  getRevenue = ()=> {
      const token = this.state.token;

      axios(
          {
              headers: {
                  Authorization: `Token ${token}`,
                  'Content-Type': 'application/json',
                  'Accept' : 'application/json',
              },
               method: 'get',
               url: API_BASE_URL +'gridtracker/api/revenue/stakeholder/',
               withCredentials: true
            })
          .then((response) => {
                 if (response.status === 200) {

                     const data = response.data.results;
                     this.dailyRevenue(data);
                     this.weeklyRevenue(data);


                 }
             })
          .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };


  annuallyRevenue =(data)=>{
        const labels = [];
        const revenueArray = [];
        console.log(data);
        const revenueDateGroup = data.reduce((payment,revenue)=>{
        if (!payment[revenue.week]){
         payment[revenue.week] = [];
        }
        payment[revenue.week].push(revenue);
        return payment
        }, {}
        );

        for (let [week, payment] of Object.entries(revenueDateGroup)) {
        console.log("Weekly ", week, payment);
        let totalPayment = payment.reduce(function(a, b){
          return a + b.amount;
        },0);

        let month = this.getMonthFormat(new Date(payment[0]["date"]));
        console.log("Weekly ", week, month);

        labels.push("Week "+ week +" of "+ month);
        revenueArray.push(totalPayment);
        }



        this.setState({
        annuallyData:revenueArray,
        annuallyLabels:labels,
        })
  };


   monthlyRevenue =(data)=>{
        const labels = [];
        const revenueArray = [];
        console.log(data);
        const revenueDateGroup = data.reduce((payment,revenue)=>{
        if (!payment[revenue.week]){
         payment[revenue.week] = [];
        }
        payment[revenue.week].push(revenue);
        return payment
        }, {}
        );

        for (let [week, payment] of Object.entries(revenueDateGroup)) {
        console.log("Weekly ", week, payment);
        let totalPayment = payment.reduce(function(a, b){
          return a + b.amount;
        },0);

        let month = this.getMonthFormat(new Date(payment[0]["date"]));
        console.log("Weekly ", week, month);

        labels.push("Week "+ week +" of "+ month);
        revenueArray.push(totalPayment);
        }



        this.setState({
        monthlyData:revenueArray,
        monthlyLabels:labels,
        })
  };


  weeklyRevenue =(data)=>{
        const labels = [];
        const revenueArray = [];
        console.log(data);
        const revenueDateGroup = data.reduce((payment,revenue)=>{
        if (!payment[revenue.week]){
         payment[revenue.week] = [];
        }
        payment[revenue.week].push(revenue);
        return payment
        }, {}
        );

        for (let [week, payment] of Object.entries(revenueDateGroup)) {
        console.log("Weekly ", week, payment);
        let totalPayment = payment.reduce(function(a, b){
          return a + b.amount;
        },0);

        let month = this.getMonthFormat(new Date(payment[0]["date"]));
        console.log("Weekly ", week, month);

        labels.push("Week "+ week +" of "+ month);
        revenueArray.push(totalPayment);
        }



        this.setState({
        weeklyData:revenueArray,
        weeklyLabels:labels,
        })
  };

  dailyRevenue =(data)=>{
        const labels = [];
        const revenueArray = [];
        console.log(data);
        const revenueDateGroup = data.reduce((payment,revenue)=>{
        if (!payment[revenue.date]){
         payment[revenue.date] = [];
        }
        payment[revenue.date].push(revenue);
        return payment
        }, {}
        );

        for (let [date, payment] of Object.entries(revenueDateGroup)) {
        console.log("Okay", date, payment);
        let totalPayment = payment.reduce(function(a, b){
          return a + b.amount;
        },0);

        labels.push(date);
        revenueArray.push(totalPayment);
        }

        this.setState({
        dailyData:revenueArray,
        dailyLabels:labels,
        })

  };

  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });
  };
  render() {


            let chart1_2_options = {
          maintainAspectRatio: false,
          legend: {
              display: false
          },
          tooltips: {
              backgroundColor: "#f5f5f5",
              titleFontColor: "#333",
              bodyFontColor: "#666",
              bodySpacing: 4,
              xPadding: 12,
              mode: "nearest",
              intersect: 0,
              position: "nearest"
          },
          responsive: true,
          scales: {
              yAxes: [
                  {
                      barPercentage: 1.6,
                      gridLines: {
                          drawBorder: false,
                          color: "rgba(29,140,248,0.0)",
                          zeroLineColor: "transparent"
                      },
                      ticks: {
                          padding: 20,
                          fontColor: "#9a9a9a"
                      }
                  }
                  ],
              xAxes: [
                  {
                      barPercentage: 1.6,
                      gridLines: {
                          drawBorder: false,
                          color: "rgba(29,140,248,0.1)",
                          zeroLineColor: "transparent"
                      },
                      ticks: {
                          padding: 20,
                          fontColor: "#9a9a9a"
                      }
                  }
                  ]
          }
      };
      let paymentRevenue = {
          data1: canvas => {
              let ctx = canvas.getContext("2d");
              let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
              gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
              gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
              gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
        labels: this.state.dailyLabels,
        datasets: [
            {
                label: "Daily Revenue",
                fill: true,
                backgroundColor: gradientStroke,
                borderColor: "#1f8ef1",
                borderWidth: 2,
                borderDash: [],
                borderDashOffset: 0.0,
                pointBackgroundColor: "#1f8ef1",
                pointBorderColor: "rgba(255,255,255,0)",
                pointHoverBackgroundColor: "#1f8ef1",
                pointBorderWidth: 20,
                pointHoverRadius: 4,
                pointHoverBorderWidth: 15,
                pointRadius: 4,
                data: this.state.dailyData,
            }
            ]
    };
    },

          data2: canvas => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
      labels: this.state.weeklyLabels,
      datasets: [
        {
          label: "Weekly Revenue",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.state.weeklyData
        }
      ]
    };
  },
  data3: canvas => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
      labels: [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC"
      ],
      datasets: [
        {
          label: "Monthly Revenue",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [60, 80, 65, 130, 80, 105, 90, 130, 70, 115, 60, 130]
        }
      ]
    };
  },
    data4: canvas => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
    gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
    gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
      labels: [
        "2020",
        "2021",
        "2022",
        "2023",
        "2024",
        "2025",
        "2026",
        "2027",
        "2028",
        "2029",
        "2030",
        "2031"
      ],
      datasets: [
        {
          label: "Annual Revenue",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#1f8ef1",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#1f8ef1",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#1f8ef1",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: [800000, 1200000, 1050000, 1100000, 950000, 1050000, 900000, 1000000, 800000, 950000, 700000, 1200000]
        }
      ]
    };
  },

          options: chart1_2_options
      };
    return (
      <>
        <div className="content">
          <Row>
            <Col xs="12">
              <Card className="card-chart">
                <CardHeader>
                  <Row>
                    <Col className="text-left" sm="6">
                    <h5 className="card-category">Income</h5>
                      <CardTitle tag="h2">Revenue</CardTitle>
                    </Col>
                    <Col sm="6">
                      <ButtonGroup
                        className="btn-group-toggle float-right"
                        data-toggle="buttons"
                      >
                        <Button
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data1"
                          })}
                          color="info"
                          id="0"
                          size="sm"
                          onClick={() => this.setBgChartData("data1")}
                        >
                          <input
                            defaultChecked
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Daily
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-single-02" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="1"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data2"
                          })}
                          onClick={() => this.setBgChartData("data2")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Weekly
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                          <Button
                          color="info"
                          id="2"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data3"
                          })}
                          onClick={() => this.setBgChartData("data3")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Monthly
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-gift-2" />
                          </span>
                        </Button>
                        <Button
                          color="info"
                          id="3"
                          size="sm"
                          tag="label"
                          className={classNames("btn-simple", {
                            active: this.state.bigChartData === "data4"
                          })}
                          onClick={() => this.setBgChartData("data4")}
                        >
                          <input
                            className="d-none"
                            name="options"
                            type="radio"
                          />
                          <span className="d-none d-sm-block d-md-block d-lg-block d-xl-block">
                            Annual
                          </span>
                          <span className="d-block d-sm-none">
                            <i className="tim-icons icon-tap-02" />
                          </span>
                        </Button>
                      </ButtonGroup>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    {/*<Line*/}
                      {/*data={chartExample1[this.state.bigChartData]}*/}
                      {/*options={chartExample1.options}*/}
                    {/*/>*/}
                      {/**/}
                      <Line
                        data={paymentRevenue[this.state.bigChartData]}
                      options={paymentRevenue.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="4">

            </Col>
            <Col lg="4">

            </Col>
            <Col lg="4">

            </Col>
          </Row>
          <Row>
              <Col xs="12">
            {/*<Col lg="6" md="12">*/}
              <Card className="card-tasks">
                <CardHeader>
                  <h6 className="title d-inline">News Update</h6>
                  <p className="card-category d-inline"> today</p>
                  <UncontrolledDropdown>
                    <DropdownToggle
                      caret
                      className="btn-icon"
                      color="link"
                      data-toggle="dropdown"
                      type="button"
                    >
                      <i className="tim-icons icon-settings-gear-63" />
                    </DropdownToggle>
                    <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Another action
                      </DropdownItem>
                      <DropdownItem
                        href="#pablo"
                        onClick={e => e.preventDefault()}
                      >
                        Something else
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </CardHeader>
                <CardBody>
                  <div className="table-full-width table-responsive">
                    <Table>
                      <tbody>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Update the Documentation</p>
                            <p className="text-muted">
                              Dwuamish Head, Seattle, WA 8:47 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip636901683"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip636901683"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input
                                  defaultChecked
                                  defaultValue=""
                                  type="checkbox"
                                />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">GDPR Compliance</p>
                            <p className="text-muted">
                              The GDPR is a regulation that requires businesses
                              to protect the personal data and privacy of Europe
                              citizens for transactions that occur within EU
                              member states.
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip457194718"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip457194718"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Solve the issues</p>
                            <p className="text-muted">
                              Fifty percent of all respondents said they would
                              be more likely to shop at a company
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip362404923"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip362404923"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Release v2.0.0</p>
                            <p className="text-muted">
                              Ra Ave SW, Seattle, WA 98116, SUA 11:19 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip818217463"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip818217463"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Export the processed files</p>
                            <p className="text-muted">
                              The report also shows that consumers will not
                              easily forgive a company once a breach exposing
                              their personal data occurs.
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip831835125"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip831835125"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <FormGroup check>
                              <Label check>
                                <Input defaultValue="" type="checkbox" />
                                <span className="form-check-sign">
                                  <span className="check" />
                                </span>
                              </Label>
                            </FormGroup>
                          </td>
                          <td>
                            <p className="title">Arival at export process</p>
                            <p className="text-muted">
                              Capitol Hill, Seattle, WA 12:34 AM
                            </p>
                          </td>
                          <td className="td-actions text-right">
                            <Button
                              color="link"
                              id="tooltip217595172"
                              title=""
                              type="button"
                            >
                              <i className="tim-icons icon-pencil" />
                            </Button>
                            <UncontrolledTooltip
                              delay={0}
                              target="tooltip217595172"
                              placement="right"
                            >
                              Edit Task
                            </UncontrolledTooltip>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default StakeholderDashboard;
