import React from "react";
import {
    Alert,
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    Col,
    Form, FormGroup,
    Input,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Row, Table
} from "reactstrap";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";
import Label from "reactstrap/es/Label";


class BillingManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            color: null,
            modal: false,
            closeAll:false,
            successMessage: null,
            offset: 0,
            subscribers: [],
            token:Cookies.get('token'),
            perPage: 5,
            currentPage: 0,
            charges: 0,
            description:"",
            billing_type:"",
            customer_class:"",
            is_rate_applicable:false,
        };

        this.toggle = this.toggle.bind(this);
        this.toggleNested=this.toggleNested.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.setNestedModal=this.setNestedModal.bind(this);
        this.setCloseAll=this.setCloseAll.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }


    componentDidMount (){
        this.getBills()

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
                     const results = response.data.results;
                     const slice = results.slice(this.state.offset, this.state.offset + this.state.perPage);
                      let bills = slice.map((data, index) =>
                        <React.Fragment>
                            <tr>
                                <td>{index + 1 }</td>
                                <td>{data.billing_type}</td>
                                <td><Link to={"/stakeholder/bill/"+data.id}>{data.customer_class}</Link></td>
                                <td>{(data.is_approved===true)? "Yes" : "No"}</td>
                                <td>{(data.rate_applicable===true)? "Yes" : "No"}</td>
                                <td>{(data.rate_applicable===true)? "₦ "+data.rate_per_kilowatts: "Not Applicable"}</td>
                                <td>{(data.rate_applicable===true)?  "Not Applicable" : " ₦ " + data.bill_charge}</td>
                                <td className="text-center">
                                    {data.description}
                                </td>

                            </tr>

                    </React.Fragment>
                      );

                      this.setState({
                          bills: bills,
                          pageCount: Math.ceil(results.length/ this.state.perPage),

                    });


                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


    };


    handlePageClick = (e) => {
        const selectedPage = e.selected;
        const offset = selectedPage * this.state.perPage;

        this.setState({
            currentPage: selectedPage,
            offset: offset
        }, () => {
            this.getAllSubscribers()
        });

    };



    onDismiss =()=> {
        this.setState({visible: !this.state.visible})
     };




    toggle =()=>{
        this.setState({modal: !this.state.modal});
        console.log("Toggle ", !this.state.modal)
    };

    toggleNested = () => {
        this.setNestedModal(!this.state.nestedModal);
        this.setCloseAll(false);
    };

    toggleAll = () => {
        this.setNestedModal(!this.state.nestedModal);
        this.setCloseAll(true);
    };

    setNestedModal =(toggle)=>{
    this.setState({nestedModal: toggle })
  };


    setCloseAll =(toggle)=>{
        this.setState({closeAll:toggle})
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



     createNewBillingSettings =()=>{
         const billing_type = this.state.billing_type;
         const customer_class = this.state.customer_class;
         const description = this.state.description;
         const is_rate_applicable= this.state.is_rate_applicable;
         const charges= this.state.charges;
         const token = this.state.token;
         const params= {
             "billing_type": billing_type,
             "customer_class": customer_class,
             "description": description,
             "rate_applicable": is_rate_applicable,
             "rate_per_kilowatts": (is_rate_applicable===true)? charges:null,
             "bill_charge": (is_rate_applicable===true)? null : charges
         };


         console.log("PARAMS ", params);
       axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'post',
               url: API_BASE_URL +'gridtracker/api/create/billing_settings/',
               data: params,
               withCredentials: false
            })
             .then((response) => {
                 console.log("Transact Response  ", response);
                 if (response.status === 201) {
                      this.setState({
                          successMessage:'Billing Settings Created, Awaiting Approval',
                          color: 'success'
                      });
                      this.onDismiss();
                     this.toggleNested();
                 }
            })
            .catch((error) => {
                if (error.response) {
                    if (error.response.status === 400){
                         this.setState({
                          deviceMessage: error.response.data.meter_no[0],
                          color: 'warning'
                      });
                      this.onDismiss();
                 }
                 console.log('Error', error.message);
                }
            });



     };


    render(){
        return(
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Modal isOpen={this.state.modal} toggle={this.toggle}  size="lg">
                                <ModalHeader toggle={this.toggle}>Create New Billing Settings</ModalHeader>
                                <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                                    <span>{this.state.successMessage}</span>
                                </Alert>
                                <ModalBody>
                                    <Form>
                                         <Row>
                                          <Col md="12">
                                              <Row>
                                                  <Col className="px-md-1" md="6">
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

                                                   <Col className="px-md-1" md="6">
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
                                          </Col>
                                             <Col md="12">
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
                                             <Col md="12">
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
                                                    <Col className="pl-md-1" md="6">
                                                 <FormGroup>
                                                     <Input
                                                         id="charges"
                                                         value={this.state.charges}
                                                         placeholder="Charge/Rate Per Hour"
                                                         type="number"
                                                         onChange={this.handleChange}
                                                     />
                                                 </FormGroup>
                                                     </Col>
                                                 </Row>

                                          </Col>
                                        </Row>
                                        <ModalFooter>
                                               <Button color="primary" onClick={this.createNewBillingSettings}>Create Billing Settings</Button>{' '}

                                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                        </ModalFooter>
                                    </Form>
                                </ModalBody>
                            </Modal>
                            <Button className="btn-fill" color="primary" onClick={this.toggle}>
                           Create New Billing Settings
                            </Button>
                            <Card className="card-user">
                                <CardHeader>
                                    <h5 className="title">Devices</h5>
                                </CardHeader>
                                <CardBody className="p-0">
                                     <CardText />
                                    <div className="author">
                                        <div className="block block-one" />
                                        <div className="block block-two" />
                                        <div className="block block-three" />
                                        <div className="block block-four" />
                                    </div>
                                    <Table className="tablesorter  mb-0" responsive >
                 <thead className="text-primary">
                 <tr>
                      <th>S/N</th>
                     <th>Bill Type</th>
                     <th>Customer Class</th>
                     <th>Approved</th>
                     <th>Rate Applicable</th>
                     <th>Rate Per Kilo Watt</th>
                     <th>Bill Charge</th>
                     <th className="text-center">Description</th>
                 </tr>
                 </thead>
                 <tbody>
                  {this.state.bills}
                 </tbody>
             </Table>
               <ReactPaginate
                    previousLabel={"prev"}
                    nextLabel={"next"}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={this.state.pageCount}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={this.handlePageClick}
                    containerClassName={"pagination"}
                    subContainerClassName={"pages pagination"}
                    activeClassName={"active"}
                 />


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


export default BillingManagement;