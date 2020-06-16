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

// reactstrap components

import {
    Button,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col, Alert, Table
} from "reactstrap";
import Label from "reactstrap/es/Label";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import {Link} from "react-router-dom";

class Device extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        token: Cookies.get('token'),
        deviceID: this.props.match.params.deviceID,
        status:null,
        bills: null,
        successMessage: null,
        color:null,
        visible: false,
    };

   }


    componentDidMount(){
        this.getStatus();
        this.getBills();

    }

     onDismiss =()=> {
        this.setState({visible: !this.state.visible})
    };

    formatDate = (date) => {
       date = new Date(date);
       let year = date.getFullYear();
       let month = date.getMonth()+1;
       let dt = date.getDate();
       if (dt < 10) {
           dt = '0' + dt;
       }
       if (month < 10) {
           month = '0' + month;
       }
       return year+'-' + month + '-'+dt;



    };


    getStatus =()=>{
        const deviceID = this.state.deviceID;
        const token = this.state.token;
        axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'get',
               url: API_BASE_URL +'gridtracker/api/device/'+ deviceID,
               withCredentials: true
            })
             .then((response) => {
                 if (response.status === 200) {
                     console.log("Device ", response.data.assigned_bills);
                     const assigned_bills = response.data.assigned_bills.map((result, index) =>
                         result.billing_type ?
                        <React.Fragment>
                            <tr>
                                <td>{index + 1 }</td>
                                <td>{result.billing_type}</td>
                                <td className="text-center">
                                    {(result.rate_applicable===true)? "Yes" : "No"}
                                </td>

                            </tr>
                    </React.Fragment>
                         : console.log("Damn ",result.billing_type)

                    );

                     let device_state;
                     if (response.data.state ===1){
                         device_state = "Running"
                     }
                     else if (response.data.state ===2){
                         device_state = "Hibernated"
                     }
                     else if (response.data.state ===3){
                         device_state = "Shutdown"
                     }

                     this.setState({
                         assigned_bills: assigned_bills,
                         created_at :response.data.created_at,
                         is_online:response.data.is_online,
                         meter_no: response.data.meter_no,
                         device_state:device_state,
                         unit_balance: response.data.unit_balance,

                     })
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

    };

    getBills =()=> {
        const token = this.state.token;
        axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',
               },
               method: 'get',
               url: API_BASE_URL +'gridtracker/api/billings/',
               withCredentials: true
            })
             .then((response) => {
                 if (response.status === 200) {
                     let arrayOfData = response.data.results;
                      let options = arrayOfData.map((data) =>
                          (data.is_approved===true)?
                          <option
                              key={data.id}
                              value={data.id}
                          >
                              {data.billing_type}
                              </option>
                          : null
                      );

                      this.setState({
                        options: options
                    });


                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


    };


    updateDevice  = (e) =>  {
        e.preventDefault();
        let status=  this.state.status;
        let bills = this.state.bills;
        console.log("Status ", status);
        console.log("Bills ", bills);
        const deviceID = this.state.deviceID;
        const token = this.state.token;

        const params= {
           'state': status,
           'assigned_bills': bills,
        };

        axios(
            {
                 headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',
               },
                method: 'put',
                url: API_BASE_URL +'gridtracker/api/update/device/'+ deviceID,
                data: params
            })
            .then((response) => {

                const assigned_bills = response.data.assigned_bills.map((result, index) =>
                         result.billing_type ?
                        <React.Fragment>
                            <tr>
                                <td>{index + 1 }</td>
                                <td>{result.billing_type}</td>
                                <td className="text-center">
                                    {(result.rate_applicable===true)? "Yes" : "No"}
                                </td>

                            </tr>
                    </React.Fragment>
                         : console.log("Damn ",result.billing_type)

                    );

                  let device_state;
                     if (response.data.state ===1){
                         device_state = "Running"
                     }
                     else if (response.data.state ===2){
                         device_state = "Hibernated"
                     }
                     else if (response.data.state ===3){
                         device_state = "Shutdown"
                     }
                this.setState({
                    successMessage:'Device Updated',
                    color: 'success',
                    device_state: device_state,
                    assigned_bills: assigned_bills,
                });
                      this.onDismiss();

            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };



    handleChange = (e) => {
    const { id, value } = e.target;
    this.setState(prevState => ({
      ...prevState,
      [id]: value
    }))
  };

    handleMultiSelectChange = (e) => {
    let options = e.target.options;
    let value = [];
    let id = e.target.id;
    for (let i = 0, l = options.length; i < l; i++) {
        if (options[i].selected) {
            value.push(options[i].value);
        }
    }

    this.setState(prevState => ({
      ...prevState,
      [id]: value
    }))

  };

  render() {
    return (
      <>
        <div className="content">
             <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                  <span>{this.state.successMessage}</span>
              </Alert>
          <Row>
            <Col md="8">
              <Card className="card-user">
                <CardHeader>
                  <h5 className="title">Update Device </h5>
                </CardHeader>
                <CardBody>
                    <CardText />
                    <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                  </div>
                  <Form>
                    <Row>
                      <Col className="pr-md-1" md="5">
                        <FormGroup>
                            <Col className="px-md-1" md="3">
                                <Label for="exampleSelectMulti">Assign Bills</Label>
                            </Col>
                            <Input type="select" name="selectMulti" id="bills" multiple onChange={this.handleMultiSelectChange}>
                                {this.state.options}
                              </Input>
                        </FormGroup>
                      </Col>
                        <Col className="px-md-1" md="3">
                            {" "}
                        </Col>
                        <Col className="px-md-1" md="3">
                          <FormGroup>
                              <Col className="px-md-1" md="3">
                                  <Label for="exampleSelect">Select Device State{" "}</Label>
                              </Col>
                              <Input type="select" name="select" id="status" onChange={this.handleChange}>
                                  <option>Select a state...</option>
                                  <option value={1}>On</option>
                                  <option value={2} >Hibernate</option>
                                  <option value={3}>Shutdown</option>
                              </Input>
                          </FormGroup>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
                <CardFooter>
                    {" "}
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                  <Button className="btn-fill" color="primary" type="submit" onClick={ this.updateDevice}>
                    Update
                  </Button>
                </CardFooter>
              </Card>
            </Col>
              <Col md="4">
              <Card className="card-user">
                <CardBody>
                  <CardText />
                  <div className="author">
                    <div className="block block-one" />
                    <div className="block block-two" />
                    <div className="block block-three" />
                    <div className="block block-four" />
                    <a href="#pablo" onClick={e => e.preventDefault()}>

                        <h5 className="title"><i>Meter No </i>: {this.state.meter_no} </h5>
                    </a>
                      <p className="description"><i>Unit Balance </i> : {this.state.unit_balance}</p>
                  </div>
                  <div className="card-description">
                      <p className="description"><i>Date Enrolled </i> : {this.formatDate(this.state.created_at)}</p>
                      <i>Online Availability :</i> {(this.state.is_online)? "Online": "Offline"}
                      <br/>
                      <i>Device Status :</i> {(this.state.device_state)}
                       <h5><b>Assigned Bills </b></h5>
                       <Table className="tablesorter" responsive>
                           <thead className="text-primary">
                           <tr>
                               <th>S/N</th>
                               <th>Bill Type</th>
                               <th className="text-center">Rate Applicable</th>
                           </tr>
                           </thead>
                           <tbody>
                  {this.state.assigned_bills}
                 </tbody>
             </Table>
                  </div>
                </CardBody>
                <CardFooter>

                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Device;
