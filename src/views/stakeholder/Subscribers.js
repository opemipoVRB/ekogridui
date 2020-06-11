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
    Form, FormFeedback,
    FormGroup,
    Input,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Row, Table
} from "reactstrap";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";



class Subscribers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            color: null,
            modal: false,
            nestedModal:false,
            closeAll:false,
            first_name: "",
            last_name: "",
            email: "",
            password1: "",
            password2: "",
            address: "",
            phone_number: "",
            device: "",
            deviceWarning:"",
            deviceValidity:false,
            successMessage: null,
            offset: 0,
            subscribers: [],
            token:Cookies.get('token'),
            perPage: 5,
            currentPage: 0,
        };

        this.toggle = this.toggle.bind(this);
        this.toggleNested=this.toggleNested.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.setNestedModal=this.setNestedModal.bind(this);
        this.setCloseAll=this.setCloseAll.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }


    componentDidMount (){
        this.getAllSubscribers()

    };

    getAllSubscribers = () =>{
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'get',
                url: API_BASE_URL +'gridtracker/api/stakeholder-subscriber-list/',
                withCredentials: true

            })
            .then((response) => {
                if (response.status === 200){
                    const results = response.data.results.filter((obj)=>obj);
                    console.log("Wow", results);
                    const slice = results.slice(this.state.offset, this.state.offset + this.state.perPage);
                    console.log("Damn ",slice);
                    const deviceState =["", "running", "hibernated", "shutdown"];
                    const subscriberData = slice.map((result, index) =>
                        <React.Fragment>
                            <tr>

                                <td>{index + 1 }</td>
                                <td><Link to={"/userprofile/"+result.subscriber.user.id}>{result.subscriber.user.first_name}</Link></td>
                                <td><Link to={"/userprofile/"+result.subscriber.user.id}>{result.subscriber.user.last_name}</Link></td>
                                <td><Link to={"/userprofile/"+result.subscriber.user.id}>{result.subscriber.user.email}</Link></td>
                                <td><Link to={"/device/"+result.meter_no}>{result.meter_no}</Link></td>
                                <td>{result.unit_balance}</td>
                                <td className="text-center">{deviceState[result.state]}</td>

                            </tr>
                    </React.Fragment>

                    );


                    this.setState({
                        pageCount: Math.ceil(results.length/ this.state.perPage),
                        subscribers: subscriberData
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



    onDismiss = ()=> {
          setTimeout(() => {
                   this.setState({visible: !this.state.visible})
           }, 2000);
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
    sendDetailsToServer = () => {
        if (this.state.email.length && this.state.password1.length) {
            const payload = {
                "first_name": this.state.first_name,
                "last_name": this.state.last_name,
                "email": this.state.email,
                "password1": this.state.password1,
                "password2": this.state.password2,
                "address": this.state.address,
                "phone_number": this.state.phone_number,
                "device": this.state.device
              };
      axios.post(API_BASE_URL + 'rest-auth/subscriber/registration/', payload)
        .then((response) => {
          if (response.data.code === 201) {
            this.setState({
                successMessage: 'Registration successful.',
                color: 'success'
            });
          }
              this.toggle();
        }
        )
        .catch((error) => {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx


            if (error.response.status === 400){
                console.log("Got this response data", error.response.data);
                console.log("Got this response status", error.response.status);
                let _errorObj= error.response.data;
                let errorArr= [];
                let errorMessage = "";

               Object.keys(_errorObj).forEach((field, index, arr)=> {
                    errorArr.push(index.toString() +". " +_errorObj[field][0]);
                    console.log(errorArr);
                    errorMessage = errorArr.join("\n");
                   console.log(errorMessage);
                });



                this.setState({
                    successMessage: errorMessage,
                    color: 'warning'
                });

          }

          } else if (error.request) {
            // The request was made but no response was received
            // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            // http.ClientRequest in node.js
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    } else {
            this.setState({
                successMessage:'Please enter valid username and password',
                color: 'warning'
            });
    }

  };


     handleSubmitClick = (e) => {
         e.preventDefault();
         if (this.state.password1 === this.state.password2) {
             this.sendDetailsToServer();

         }
         else if (this.state.password1 !== this.state.password2){
             this.setState({
                 successMessage:'Passwords do not match',
                 color: 'warning'
             });
         }

         this.onDismiss();

     };


    render(){
        console.log("Nooo ", this.state.subscribers);
        return(
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Modal isOpen={this.state.modal} toggle={this.toggle}  size="lg">
                                <ModalHeader toggle={this.toggle}>Create New Subscriber</ModalHeader>
                                <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                                    <span>{this.state.successMessage}</span>
                                </Alert>
                                <ModalBody>
                                    <Form>
                                        <Row>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="first_name"
                                                   value={this.state.first_name}
                                                   placeholder="First Name"
                                                   type="text"
                                                   onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                              <Input
                                                  id="last_name"
                                                  value={this.state.last_name}
                                                  placeholder="Last Name"
                                                  type="text"
                                                  onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                                 <Input
                                                  id="phone_number"
                                                  value={this.state.phone_number}
                                                  placeholder="Phone Number"
                                                  type="text"
                                                  onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                                <Input
                                                    id="email"
                                                    value={this.state.email}
                                                    placeholder="Email Address"
                                                    type="email"
                                                    aria-describedby="emailHelp"
                                                    onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                          <Col className="pr-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="password1"
                                                   value={this.state.password1}
                                                   placeholder="Password"
                                                   type="password"
                                                   onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                          <Col className="pl-md-1" md="6">
                                            <FormGroup>
                                               <Input
                                                   id="password2"
                                                   value={this.state.password2}
                                                   placeholder="Confirm Password"
                                                   type="password"
                                                   onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                          <Col md="12">
                                            <FormGroup>
                                              <Input
                                                  id="address"
                                                  value={this.state.address}
                                                  placeholder="Home Address"
                                                  type="text"
                                                  onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                       <Row>
                                          <Col className="pr-md-2" md="8">
                                            <FormGroup>
                                               <Input
                                                   id="device"
                                                   value={this.state.device}
                                                   placeholder="Enter The S/N on your Meter"
                                                   type="text"
                                                   onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <ModalFooter>
                                            <Button className="btn-fill" color="primary" type="submit"  onClick={this.handleSubmitClick}>
                                                Register
                                            </Button>{' '}

                                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                        </ModalFooter>

                                    </Form>

                                    <br/>
                            <Button color="success" onClick={this.toggleNested}>Add Device</Button>
                            <Modal isOpen={this.state.nestedModal} toggle={this.toggleNested} onClosed={this.state.closeAll ? this.toggle : undefined}>
                                <ModalHeader>Nested Modal title</ModalHeader>
                                <ModalBody>Stuff and things</ModalBody>
                                <ModalFooter>
                                    <Button color="primary" onClick={this.toggleNested}>Done</Button>{' '}
                                    <Button color="secondary" onClick={this.toggleAll}>All Done</Button>
                                </ModalFooter>
                            </Modal>
                        </ModalBody>
                    </Modal>
                            <Button className="btn-fill" color="primary" onClick={this.toggle}>
                            Create new subscriber
                            </Button>
                            <Card>
                                <CardHeader>
                                    <h5 className="title">Subscribers</h5>
                                </CardHeader>
                                <CardBody>
                                    <Table className="tablesorter" responsive>
                 <thead className="text-primary">
                 <tr>
                     <th>S/N</th>
                     <th>First Name</th>
                     <th>Last Name</th>
                     <th>Email</th>
                     <th>Meter No</th>
                     <th>Unit Balance</th>
                     <th className="text-center">Device Status</th>
                 </tr>
                 </thead>
                 <tbody>
                  {this.state.subscribers}
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



export default Subscribers;


