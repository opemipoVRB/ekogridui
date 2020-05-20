import React , {Component} from "react";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import {Link} from "react-router-dom";
import {Button, Card, CardBody, Col, Row} from "reactstrap";
import "./AccountManagement.css"


class ConfirmEmail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: ""
    };

        this.confirmEmail = this.confirmEmail.bind(this)

    }

    componentDidMount (){
        this.confirmEmail();

    };


    confirmEmail = () => {
                const key = this.props.match.params;
        axios.post(API_BASE_URL + 'registration/verify-email/', key)
            .then((response) => {
                console.log("Confirm ", response.data);
                this.setState({message: response.data.detail});
             })
            .catch((error) => {
                if (error.response.status===404) {
                    console.log('Ok Error', error.response);
                    console.log('Ok Error', error.response.data.detail);
                    this.setState({message: error.response.data.detail})
                }
            });

    };


    render () {
                console.log("Made ", this.state.message);

        return (
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
                            <p className="description centered">{this.state.message}</p>
                            <Link to='/login' className="centered">
                                <Button>
                                    Go To Page Login
                                </Button>
                            </Link>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    )
    }

}

export default ConfirmEmail;
