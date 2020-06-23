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
    Col, Alert} from "reactstrap";
import Label from "reactstrap/es/Label";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import {createBrowserHistory} from "history";
const history = createBrowserHistory({forceRefresh:true});

class Bill extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        token: Cookies.get('token'),
        billID: this.props.match.params.billID,
        successMessage: null,
        color:null,
        visible: false,
        billing_type : null,
        customer_class:null,
        description : null,
        rate_applicable :null,
        rate_per_kilowatts: null,
        bill_charge : null,
        is_approved : null,
        charges:null
    };

   }


    componentDidMount(){
        this.getBill();

    }

     onDismiss =()=> {
        this.setState({visible: !this.state.visible})
    };

    getBill =()=>{
        const billID = this.state.billID;
        const token = this.state.token;
        axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'get',
               url: API_BASE_URL +'gridtracker/api/billing_settings/'+ billID,
               withCredentials: true
            })
             .then((response) => {
                 if (response.status === 200) {
                     console.log("Device ", response.data);
                     let billing_type = response.data.billing_type;
                     let customer_class= response.data.customer_class;
                     let description = response.data.description;
                     let rate_applicable = response.data.rate_applicable;
                     let rate_per_kilowatts= response.data.rate_per_kilowatts;
                     let bill_charge = response.data.bill_charge;
                     let is_approved= (response.data.is_approved===true) ? "Yes": "No";



                     this.setState({
                         billing_type : billing_type,
                         customer_class:customer_class,
                         description : description,
                         rate_applicable :rate_applicable,
                         rate_per_kilowatts: rate_per_kilowatts,
                         bill_charge : bill_charge,
                         is_approved : is_approved,
                     })
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

    };


    updateBill  = (e) =>  {
        e.preventDefault();
        const billID = this.state.billID;
        const token = this.state.token;
        let billing_type = this.state.billing_type;
        let customer_class= this.state.customer_class;
        let description = this.state.description;
        let rate_applicable = this.state.rate_applicable;
        let rate_per_kilowatts= (this.state.rate_applicable===true)?this.state.charges : this.state.rate_per_kilowatts;
        let bill_charge = (this.state.rate_applicable===false)?this.state.charges : this.state.bill_charge;

        const params= {
            "billing_type":billing_type,
            "customer_class": customer_class,
            "description": description,
            "rate_applicable": rate_applicable,
            "rate_per_kilowatts": rate_per_kilowatts,
            "bill_charge": bill_charge,
        };

        axios(
            {
                 headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',
               },
                method: 'put',
                url: API_BASE_URL +'gridtracker/api/update/billing_settings/'+ billID,
                data: params
            })
            .then((response) => {
                this.setState({
                         successMessage:'Bill Updated',
                         color: 'success',
                     })
                     this.onDismiss();

            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };

    deleteBill  = (e) =>  {
        e.preventDefault();
        const billID = this.state.billID;
        const token = this.state.token;

        axios(
            {
                 headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',
               },
                method: 'delete',
                url: API_BASE_URL +'gridtracker/api/delete/billing_settings/'+ billID,
            })
            .then((response) => {
                if (response.status === 204){
                    console.log(response)
                    this.setState({
                        successMessage:'Bill Deleted',
                        color: 'warning',
                    });
                    this.onDismiss();

                    setTimeout(function() {
                        history.push("/stakeholder/billing-management");
                        }, 2000);

                }
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

    handleCheckBox = (e) => {
         const id = e.target.id;
         const checked = e.target.checked;
         this.setState(prevState => ({
             ...prevState,
             [id]: checked
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
                  <h5 className="title">Update Bill </h5>
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
                               <Input
                                      id="billing_type"
                                      value={this.state.billing_type}
                                      placeholder="Billing Type"
                                      type="text"
                                      onChange={this.handleChange}
                               />
                        </FormGroup>
                      </Col>
                        <Col className="px-md-1" md="5">
                            <FormGroup>
                                <Input
                                      id="customer_class"
                                      value={this.state.customer_class}
                                      placeholder="Customer Class"
                                      type="text"
                                      onChange={this.handleChange}
                               />
                            </FormGroup>
                        </Col>
                    </Row>
<Row>
                      <Col className="pr-md-1" md="5">
                        <FormGroup>
                               <Input
                                      id="description"
                                      value={this.state.description}
                                      placeholder="Description"
                                      type="textarea"
                                      onChange={this.handleChange}
                               />
                        </FormGroup>
                      </Col>
                        <Col className="px-md-1" md="5">
                            <FormGroup>
                                <Input
                                      id="charges"
                                      value={this.state.charges}
                                      placeholder="Charge"
                                      type="number"
                                      onChange={this.handleChange}
                               />
                            </FormGroup>
                        </Col>
                    </Row>
                      <Row>
                            <Col>
                                                  <FormGroup check>
                                                      <Label check>
                                                          <Input
                                                              id = "is_rate_applicable"
                                                              type="checkbox"
                                                              value={this.state.is_rate_applicable}
                                                              onChange={this.handleCheckBox}
                                                          />{' '}
                                                      Is rate applicable?
                                                          <span className="form-check-sign">
                                                              <span className="check"></span>
                                                          </span>
                                                      </Label>
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
                  <Button className="btn-fill" color="primary" type="submit" onClick={ this.updateBill}>
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
                        <h5 className="title"><i>Billing Type </i>: {this.state.billing_type} </h5>
                  </div>
                  <div className="card-description">
                      <p className="description"><i>Customer Class </i> : {this.state.customer_class}</p>
                      <p className="description"><i>Description</i> : {this.state.description}</p>
                      <p className="description"><i> {(this.state.rate_applicable===true) ? "Rates Per Kilowatts": "Bill Charge"} : </i>
                         ₦{(this.state.rate_applicable===true) ? this.state.rate_per_kilowatts: this.state.bill_charge}</p>
                      <p className="description"><i>Approval Status :</i> {this.state.is_approved}</p>
                      <br/>
                  </div>


                </CardBody>
                <CardFooter>
                     <Button className="btn-fill" color="danger" type="submit" onClick={ this.deleteBill}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Bill;
