import React, {Component} from "react";
import "assets/css/powerbutton/powerbutton.css";
import {API_BASE_URL} from "../../constants/apiContants";
import axios from "axios";
import Cookies from "js-cookie";
import {Alert} from "reactstrap";


class PowerButton extends Component {
    constructor(props) {
    super(props);
     this.state = {
        user: Cookies.get("userID"),
           visible: false
    };
     this.onDismiss = this.onDismiss.bind(this);
     this.PowerButton = this.PowerButton.bind(this)
     this.powerOn = this.powerOn.bind(this)
   }

   onDismiss(){
    this.setState({visible: !this.state.visible})
    }
    powerOn  = () =>  {

        const user_id = this.state.user;
        let status = this.props.state;
        const token = Cookies.get('token');
        console.log("Stat", status);
        if (status === "off"){
            status = 1 //if off turn on
        }
        else if(status === "on"){
            status = 2 //if on turn off
        }
        const params= {
           'state': status
        };
        console.log("Status ", status);

        axios(
            {
                 headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',
               },
                method: 'put',
                url: API_BASE_URL +'gridtracker/api/subscriber/device/controller/'+ user_id,
                data: params
            })
            .then((response) => {
                console.log(response.data)
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };



     PowerButton  = (e) =>  {
         e.preventDefault();
         let element = e.target;
         if (this.props.state !=="disabled") {
             element.classList.toggle("on");
             this.powerOn()

         }
         else{
             element.className= "off";
             var powerButton= document.getElementById("power-pad")
             powerButton.disabled=true;


         }

    };


  render() {
         console.log("Really ", this.props.state);
    return (
        <div className="content">
             <section id="power-section">
                 <fieldset id="power-pad">
                     <span  id="power-button" onClick={this.PowerButton}  className={this.props.state}> &#xF011;</span>
                     <span></span>
                 </fieldset>

             </section>

            <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                <span>Your device has been disabled contact your disco.</span>
            </Alert>
      </div>

    )

  }
}

export default PowerButton;