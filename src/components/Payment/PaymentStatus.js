import React from "react";
import Cookies from 'js-cookie';
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import {Link} from "react-router-dom";

class PaymentStatus extends React.Component {
        constructor(props){
            super(props);
            this.state={
                message: Cookies.get("transaction-status")
        };

        }

        componentDidMount(){
            console.log("This ",  this.state.message);

        }




    render(){
        return(
            <>
                <div className="content">
                     <div className="card">
            <Row className="centered-body">
                <Col className="pr-md-1" md="5">
                    <Card className="card-user">
                        <CardBody>
                            <div className="author">
                                <div className="block block-one"/>
                                <div className="block block-two"/>
                                <div className="block block-three"/>
                                <div className="block block-four"/>
                            </div>
                            <p className="description centered">Payment {this.state.message}</p>
                            <Link to='/subscriber/dashboard' className="centered">
                                <Button>
                                    Go To Dashboard
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>



                </div>
            </>


        );
    }

}



export default PaymentStatus;