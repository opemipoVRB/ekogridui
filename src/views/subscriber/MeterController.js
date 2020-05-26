import React from "react";
import PowerButton from "../../components/PowerButton/PowerButton";
import Cookies from "js-cookie";
import axios from "axios";
import {API_BASE_URL} from "../../constants/apiContants";
import { Alert } from 'reactstrap';

class MeterController extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
        _state: null,
        user: Cookies.get("userID"),
         visible: false
    };
     this.onDismiss = this.onDismiss.bind(this);
   }

   onDismiss(){
    this.setState({visible: !this.state.visible})
    }
    componentDidMount (){
       const user_id = this.state.user;
       const token = Cookies.get('token');
       axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'get',
               url: API_BASE_URL +'gridtracker/api/subscriber/device/controller/'+ user_id,
               withCredentials: true
            })
             .then((response) => {
                 if (response.status === 200) {
                     console.log("Data ", response.data)
                     if (response.data.state === 1){
                         this.setState({_state: 'on' });
                     }
                     else if(response.data.state === 2){
                         this.setState({_state: 'off' });
                      }
                     else if(response.data.state === 3){
                         this.setState({_state: 'disabled' });
                         this.setState({visible: !this.state.visible})

                     }
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    }

    render(){
        return(
            <>
                <div className="content">
                    <PowerButton state={this.state._state}/>
                    <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                        <span>Your device has been disabled contact your disco.</span>
                    </Alert>
                </div>
            </>


        );
    }

}



export default MeterController;

