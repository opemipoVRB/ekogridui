import React from "react";
import Payment from "../../components/Payment/Payment";
import { Card, CardBody, CardHeader, CardTitle, Col, FormGroup, Input, Label, Row} from "reactstrap";
import { Doughnut } from "react-chartjs-2";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import PastPayment from "../../components/Payment/PastPayment";




class Bills extends React.Component {

constructor(props) {
    super(props);
    this.state = {
        user: Cookies.get("userID"),
        unit: 0.0,
        rate: null,
        price: 0.0,
        unitBalance:0.0,
        paymentData: {},
        stakeholder: "",
        email: Cookies.get('email'),
        token:Cookies.get('token'),
        data: {
            labels: ['Balance', 'Used'],
            datasets: [{
                data: [],
                backgroundColor: ['#1978DC', '#053278'],
                hoverBackgroundColor: ['#1978DC', '#053278',],
                borderWidth: 0.5,
                borderColor: "#d048b6",
                borderDashOffset: 0.5,
            },]
        },
        options: {
            maintainAspectRatio: false
        },
        legend: {
            display: false
        },
    };
}



  componentDidMount() {
     this.getRate();
     this.getUnitBalance();
    window.addEventListener('load', this.UnitCalculator);
 }

 getUnitBalance =()=>{
    const user_id = this.state.user;
    const token = this.state.token;
    axios(
        {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
            },

            method: 'get',
            url: API_BASE_URL +'gridtracker/api/update/subscriber/transaction/'+ user_id,
            withCredentials: true

        })
        .then((response) => {
            if (response.status === 200) {
                let stakeholder = response.data.device.stakeholder;
                this.setState({stakeholder:stakeholder});
                }

        })
        .catch((error) => {
            if (error.response) {
                console.log('Error', error.message);
            }
        });

 };


 getRate=()=> {
    const user_id = this.state.user;
    const token = this.state.token;
    axios(
        {
            headers: {
                Authorization: `Token ${token}`,
                'Content-Type': 'application/json',
                'Accept' : 'application/json',
            },

            method: 'get',
            url: API_BASE_URL +'gridtracker/api/subscriber/'+ user_id,
            withCredentials: true

        })
        .then((response) => {
            if (response.status === 200) {
                if(response.data.device.assigned_bills){

                    // Get Billing Rate
                    response.data.device.assigned_bills.forEach((bill, index, array)=>{
                       if (bill.rate_applicable ===true){
                           this.setState({rate: bill.rate_per_kilowatts})
                       }
                    });

                }
                let data = this.state.data;
                let unitBalance = response.data.new_balance - response.data.device.unit_balance;
                this.setState({unitBalance:unitBalance});
                data.datasets[0].data = [unitBalance,  response.data.device.unit_balance];
                this.setState(({data: data}));
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log('Error', error.message);
            }
        });
};




   handleChange =(e)=> {
      const value = e.target.value;
      this.setState({
          ...this.state,
          [e.target.name]: value
      });
        this.UnitCalculator();
  };



     updatePrice =(price, unit)=> {
        this.setState({price: price, unit:unit})


    };




  UnitCalculator =()=> {
      let rate = this.state.rate;
      let src = document.getElementById("unit"),
          dst = document.getElementById("unit-price");
      src.addEventListener('input', function() {
        dst.value = src.value * rate;
    });
      this.updatePrice(dst.value, src.value);
};





  render() {

    return (
      <>
        <div className="content">
          <Row>
            <Col lg="6">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Current Power Usage</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-user-run text-primary" />{" "}
                    {/*₦2,500*/}
                      {this.state.unitBalance} Kwh
                  </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Doughnut data={this.state.data} options={this.state.options} legend={this.state.legend} />
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col lg="6">
              <Card className="card-chart">
                <CardHeader>
                  <h5 className="card-category">Make Payment</h5>
                  <CardTitle tag="h3">
                    <i className="tim-icons icon-coins text-primary" />{" "}
                                    Enter Units
                                    </CardTitle>
                </CardHeader>
                <CardBody>
                  <div className="chart-area">
                    <Col className="pl-md-1" md="4">
                      <FormGroup>
                          <Label>
                                <h4>Kw</h4>
                        </Label>
                          <Input id ="unit"
                                 placeholder="Enter number of Units"
                                 type="number"
                                 onChange={this.handleChange}
                          />

                      </FormGroup>
                    </Col>
                    <Col className="pr-md-1" md="5">
                      <FormGroup>
                        <Label>
                                <h4>₦</h4>
                        </Label>
                          {"  "}

                          <Input id ="unit-price"
                                 disabled
                                 type="number"
                                 value={this.state.price}
                                 onChange={this.handleChange}
                          />
                          <span className="form-check-sign"><span className="check" />
                          </span>
                        <Payment  email={this.state.email} amount={this.state.price} unit ={this.state.unit} stakeholder={ this.state.stakeholder}/>
                      </FormGroup>
                    </Col>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col lg="12" md="12">
              <Card>
                <CardHeader>
                  <CardTitle tag="h4">Past Payments</CardTitle>
                </CardHeader>
                <CardBody>
                <PastPayment/>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>


      </>


    );
  }

}



export default Bills;