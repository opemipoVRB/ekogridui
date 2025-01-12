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
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

// reactstrap components
import {
  Button,
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

import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";


class SubscriberDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        bigChartData: "data1",
        labels: [],
        data: [],
        pLabels: [],
        pData: [],
        totalPower: 0,
        alert_data:[],
        alert_labels:[],
        alertData:[],
        alertLabels:[],
        token:Cookies.get('token'),
        lastAlert: 0,
        subscription_data:[],
        subscription_labels:[],
        subscriptionData:[],
        subscriptionLabels:[],
        lastSubscription: 0,
    };
  }
  componentDidMount(){
        this.getEnergyLevels();
        this.getAlerts();
        this.getPastSubscription();
  }




     getPastSubscription=()=> {
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'get',
                url: API_BASE_URL +'gridtracker/api/view/transactions',
                withCredentials: true

            })
            .then((response) => {
                if (response.status === 200){
                                        const data = response.data.results;
                    const labels =[];
                    const dataArray=[];
                    const paymentArray=[];
                    data.forEach(packet=>{
                         labels.push(this.getFormatDate(new Date(packet["date"])));
                         dataArray.push(parseFloat(packet["units_purchased"]));
                         paymentArray.push(parseFloat(packet["payment"]));
                     });

                    this.setState({ subscription_data:dataArray, subscription_labels:labels, lastSubscription: this.last(paymentArray, 1)[0],   subscriptionData:this.last(dataArray, 6), subscriptionLabels:this.last(labels, 6)})



                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


    };

  last =(array, n)=> {
      if (array == null)
          return void 0;
      if (n == null)
          return array[array.length - 1];
      return array.slice(Math.max(array.length - n, 0));
  };


  getAlerts =()=>{
         const token = this.state.token;
         axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },
                method: 'get',
                url: API_BASE_URL +'gridtracker/api/alerts/',
                withCredentials: true
            })
            .then((response) => {
                if (response.status === 200) {
                    const data = response.data.results;
                    const labels =[];
                    const dataArray=[];
                    data.forEach(packet=>{
                         labels.push(this.getFormatDate(new Date(packet["completed_at"])));
                         dataArray.push(parseFloat(packet["threshold"]));
                     });
                    this.setState({ alert_data:dataArray, alert_labels:labels, lastAlert: this.last(dataArray, 1)[0],   alertData: this.last(dataArray, 6), alertLabels:this.last(labels, 6)})

                }
            })
             .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

     };


  getFormatDate = (date) => {
      // const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    return (
        date.getDate() + "/" + date.getMonth() + "/" + date.getFullYear()
        // months[date.getMonth()]
    );
  };


  getEnergyLevels = ()=> {
      const token = this.state.token;
      axios(
          {
              headers: {
                  Authorization: `Token ${token}`,
                  'Content-Type': 'application/json',
                  'Accept' : 'application/json',
              },
               method: 'get',
               url: API_BASE_URL +'gridtracker/monitoring/telemetry',
               withCredentials: true
            })
          .then((response) => {
                 if (response.status === 200) {
                     const data = response.data.results;
                     const labels =[];
                     const dataArray=[];
                     data.forEach(packet=>{
                         labels.push(this.getFormatDate(new Date(packet["published_date"])));
                         dataArray.push(parseFloat(packet["power_consumption"]));
                     });
                     let totalPower = Math.round(dataArray.reduce(function(a, b){
                         return a + b }, 0));
                     console.log("Power Consumed ", dataArray);

                     this.setState({ data:dataArray, labels:labels, totalPower:totalPower, pData:this.last(dataArray, 6), pLabels:this.last(labels, 6)})
                 }
             })
          .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };

  setBgChartData = name => {
    this.setState({
      bigChartData: name
    });

  };


    addCommas = (nStr)=> {
     nStr += '';
     let x = nStr.split('.');
     let x1 = x[0];
     let x2 = x.length > 1 ? '.' + x[1] : '';
     let rgx = /(\d+)(\d{3})/;
     while (rgx.test(x1)) {
      x1 = x1.replace(rgx, '$1'.concat(',' , '$2'));
     }
     return x1 + x2;
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
      let powerConsumption = {
          data1: canvas => {
              let ctx = canvas.getContext("2d");
              let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
              gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
              gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
              gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
        labels: this.state.labels,
        datasets: [
            {
                label: "Power Consumed in Kwh",
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
                data: this.state.data,
            }
            ]
    };
          },
          options: chart1_2_options
      };


      let chartExample2 = {
          data: canvas => {
              let ctx = canvas.getContext("2d");

              let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);
              gradientStroke.addColorStop(1, "rgba(29,140,248,0.2)");
              gradientStroke.addColorStop(0.4, "rgba(29,140,248,0.0)");
              gradientStroke.addColorStop(0, "rgba(29,140,248,0)"); //blue colors

    return {
        labels: this.state.pLabels,
        datasets: [
            {
                label: "Recent Power Consumed in Kwh",
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
                data: this.state.pData
        }
      ]
    };
  },
  options: chart1_2_options
};


          let alertChart = {
       data: canvas => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(66,134,121,0.15)");
    gradientStroke.addColorStop(0.4, "rgba(66,134,121,0.0)"); //green colors
    gradientStroke.addColorStop(0, "rgba(66,134,121,0)"); //green colors

    return {
      labels: this.state.alertLabels,
      datasets: [
        {
          label: "Alert thresholds",
          fill: true,
          backgroundColor: gradientStroke,
          borderColor: "#00d6b4",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          pointBackgroundColor: "#00d6b4",
          pointBorderColor: "rgba(255,255,255,0)",
          pointHoverBackgroundColor: "#00d6b4",
          pointBorderWidth: 20,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 15,
          pointRadius: 4,
          data: this.state.alertData,
        }
      ]
    };
  },
  options: {
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
            suggestedMin: 50,
            suggestedMax: 125,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }
      ],

      xAxes: [
        {
          barPercentage: 1.6,
          gridLines: {
            drawBorder: false,
            color: "rgba(0,242,195,0.1)",
            zeroLineColor: "transparent"
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }
      ]
    }
  }
    };

          let pastPayment = {
  data: canvas => {
    let ctx = canvas.getContext("2d");

    let gradientStroke = ctx.createLinearGradient(0, 230, 0, 50);

    gradientStroke.addColorStop(1, "rgba(72,72,176,0.1)");
    gradientStroke.addColorStop(0.4, "rgba(72,72,176,0.0)");
    gradientStroke.addColorStop(0, "rgba(119,52,169,0)"); //purple colors

    return {
      labels: this.state.subscriptionLabels,
      datasets: [
        {
          label: "Unit Power in Kwh",
          fill: true,
          backgroundColor: gradientStroke,
          hoverBackgroundColor: gradientStroke,
          borderColor: "#d048b6",
          borderWidth: 2,
          borderDash: [],
          borderDashOffset: 0.0,
          data: this.state.subscriptionData,
        }
      ]
    };
  },
  options: {
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
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent"
          },
          ticks: {
            suggestedMin: 60,
            suggestedMax: 120,
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }
      ],
      xAxes: [
        {
          gridLines: {
            drawBorder: false,
            color: "rgba(225,78,202,0.1)",
            zeroLineColor: "transparent"
          },
          ticks: {
            padding: 20,
            fontColor: "#9e9e9e"
          }
        }
      ]
    }
  }
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
                    <h5 className="card-category">Power Consumption</h5>
                      <CardTitle tag="h2">Energy Levels</CardTitle>
                    </Col>
                  </Row>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={powerConsumption[this.state.bigChartData]}
                      options={powerConsumption.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>


          </Row>
          <Row>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Power Consumption</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-bulb-63 text-info" />{" "}
                      {(this.state.totalPower)?this.addCommas(this.state.totalPower): 0} Kwh
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={chartExample2.data}
                      options={chartExample2.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Last Subscription</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                    ₦ {(this.state.lastSubscription)?this.addCommas(this.state.lastSubscription): 0}
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Bar
                      data={pastPayment.data}
                      options={pastPayment.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="4">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Completed Alerts</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-send text-success" /> {(this.state.lastAlert) ? this.addCommas(this.state.lastAlert): 0} Kwh
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Line
                      data={alertChart.data}
                      options={alertChart.options}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col xs="12">
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

export default SubscriberDashboard;
