import React from "react";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    CardText,
    Col,
    Row, Table
} from "reactstrap";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import ReactPaginate from "react-paginate";
import {Link} from "react-router-dom";


class MessageManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            offset: 0,
            subscribers: [],
            token:Cookies.get('token'),
            perPage: 10,
            currentPage: 0,
            selectedSubscriber: '',
            chat: [],
            chatIsLoading: false,
            subscriberIsLoading:true
        };

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
                    console.log(results);
                    const slice = results.slice(this.state.offset, this.state.offset + this.state.perPage);
                    const subscriberData = slice.map((result, index) =>
                        <React.Fragment>
                            <tr>

                                <td>{index + 1 }</td>
                                <td><Link to={"/stakeholder/userprofile/"+result.subscriber.user.id}>{result.subscriber.user.first_name}</Link></td>
                                <td><Link to={"/stakeholder/userprofile/"+result.subscriber.user.id}>{result.subscriber.user.last_name}</Link></td>
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


    render(){
        return(
            <>
            <Row>
                        <Col md="4">
                            <Card className="card-user">
                                <CardHeader>
                                    <h5 className="title">Subscribers</h5>
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
                     <th>First Name</th>
                     <th>Last Name</th>
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
                        <Col md="4">
                        </Col>
                    </Row>
            </>
        );
    }

}



export default MessageManagement;


