import React, {Component} from "react";
import "assets/css/powerbutton/powerbutton.css";
import {API_BASE_URL} from "../../constants/apiContants";
import axios from "axios";
import Cookies from "js-cookie";


class PowerButton extends Component {
    constructor(props) {
    super(props);
     this.state = {
        user: Cookies.get("userID")
    };
     this.PowerButton = this.PowerButton.bind(this)
     this.powerOn = this.powerOn.bind(this)
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
        element.classList.toggle("on");
        this.powerOn()
    };


  render() {
         console.log("Really ", this.props.state);
    return (
        <section id="power-section">
            {/*<span  id="power-button" onClick={this.PowerButton}  className={this.state._state}> &#xF011;</span>*/}
            <span  id="power-button" onClick={this.PowerButton}  className={this.props.state}> &#xF011;</span>
            <span></span>
        </section>
    )

  }
}

export default PowerButton;