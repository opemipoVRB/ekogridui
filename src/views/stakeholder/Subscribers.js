import React from "react";
import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    Col,
    Form,
    FormGroup,
    Input,
    Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from "reactstrap";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";



class Subscribers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
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
            successMessage: null,
        };

        this.toggle = this.toggle.bind(this);
        this.toggleNested=this.toggleNested.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.setNestedModal=this.setNestedModal.bind(this);
        this.setCloseAll=this.setCloseAll.bind(this);
    }

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
            // props.showError(null);
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
        .then(function (response) {
          if (response.data.code === 201) {
            this.setState(prevState => ({
              ...prevState,
              'successMessage': 'Registration successful. Redirecting to home page..'
            }));

          }
        })
        .catch(function (error) {
          if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.log("Got this response data", error.response.data);
            console.log("Got this response status", error.response.status);
            console.log("Got this response status", error.response.headers);
            alert(error.response.data["device"]);
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
      alert('Please enter valid username and password')
    }

  };


     handleSubmitClick = (e) => {
         e.preventDefault();
         if (this.state.password1 === this.state.password2) {
             this.sendDetailsToServer()
         } else {
             alert('Passwords do not match');
         }
     };


    render(){
        return(
            <>
                <div className="content">
                    <Row>
                        <Col md="12">
                            <Modal isOpen={this.state.modal} toggle={this.toggle}  size="lg">
                                <ModalHeader toggle={this.toggle}>Create New Subscriber</ModalHeader>
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
                                                   placeholder="Meter Number"
                                                   type="text"
                                                   aria-describedby="emailHelp" onChange={this.handleChange}
                                              />
                                            </FormGroup>
                                          </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-2" md="8">
                                                 <Button className="btn-fill" color="primary" type="submit"  onClick={this.handleSubmitClick}>
                                                    Register
                                               </Button>
                                          </Col>
                                        </Row>
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
                        <ModalFooter>
                            <Button color="primary" onClick={this.toggle}>Do Something</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>
                            <Button className="btn-fill" color="primary" onClick={this.toggle}>
                            Create new subscriber
                            </Button>
                            <Card>
                                <CardHeader>
                                    <h5 className="title">Subscribers</h5>
                                </CardHeader>
                                <CardBody>

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


