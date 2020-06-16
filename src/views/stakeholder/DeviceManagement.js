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
import Label from "reactstrap/es/Label";


class DeviceManagement extends React.Component {
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
            deviceMessage: "",
            deviceWarning:"",
            deviceValidity:false,
            successMessage: null,
            offset: 0,
            subscribers: [],
            token:Cookies.get('token'),
            perPage: 5,
            currentPage: 0,
            meter_no: null
        };

        this.toggle = this.toggle.bind(this);
        this.toggleNested=this.toggleNested.bind(this);
        this.toggleAll=this.toggleAll.bind(this);
        this.setNestedModal=this.setNestedModal.bind(this);
        this.setCloseAll=this.setCloseAll.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
    }


    componentDidMount (){
        this.getAllDevices()

    };

    getAllDevices = () =>{
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'get',
                url: API_BASE_URL +'gridtracker/api/devices/',
                withCredentials: true

            })
            .then((response) => {
                if (response.status === 200){
                    // const results = response.data.results.filter((obj)=>obj);
                    const results = response.data.results;
                    console.log(results);
                    const slice = results.slice(this.state.offset, this.state.offset + this.state.perPage);
                    const deviceState =["", "running", "hibernated", "shutdown"];
                    const subscriberData = slice.map((result, index) =>
                        <React.Fragment>
                            <tr>

                                <td>{index + 1 }</td>
                                <td>{(result.subscriber !== null) ? "Owned" : "Not Owned"}</td>
                                <td><Link to={"/stakeholder/device/"+result.id}>{result.meter_no}</Link></td>
                                <td>{result.unit_balance}</td>
                                <td className="text-center">
                                    {deviceState[result.state]}</td>

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



     createNewDevice =()=>{
         const meter_no = this.state.meter_no;
         const token = this.state.token;
         const params= {
            "meter_no": meter_no,
            "state": 3,
            "unit_balance": 0.0
};
       axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'post',
               url: API_BASE_URL +'gridtracker/api/create/device/',
               data: params,
               withCredentials: false
            })
             .then((response) => {
                 console.log("Transact Response  ", response);
                 if (response.status === 201) {
                      this.setState({
                          successMessage:'Device Created',
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
                                <ModalHeader toggle={this.toggle}>Add New Device</ModalHeader>
                                <Alert color={this.state.color} isOpen={this.state.visible} toggle={this.onDismiss}>
                                    <span>{this.state.successMessage}</span>
                                </Alert>
                                <ModalBody>
                                    <Form>
                                         <Row>
                                          <Col md="12">
                                                  <FormGroup>
                                                      <Input
                                                          id="meter_no"
                                                          value={this.state.meter_no}
                                                          placeholder="Meter No"
                                                          type="text"
                                                          onChange={this.handleChange}
                                                      />
                                                  </FormGroup>
                                          </Col>
                                        </Row>
                                        <ModalFooter>
                                               <Button color="primary" onClick={this.createNewDevice}>Create Device</Button>{' '}

                                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                                        </ModalFooter>
                                    </Form>
                                </ModalBody>
                            </Modal>
                            <Button className="btn-fill" color="primary" onClick={this.toggle}>
                            Add New Device
                            </Button>
                            <Card className="card-user">
                                <CardHeader>
                                    <h5 className="title">Devices</h5>
                                </CardHeader>
                                <CardBody>
                                     <CardText />
                                    <div className="author">
                                        <div className="block block-one" />
                                        <div className="block block-two" />
                                        <div className="block block-three" />
                                        <div className="block block-four" />
                                    </div>
                                    <Table className="tablesorter" responsive>
                 <thead className="text-primary">
                 <tr>
                     <th>S/N</th>
                     <th>Ownership Status</th>
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


export default DeviceManagement;