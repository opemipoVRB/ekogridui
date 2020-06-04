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
         visible: false,
    };
     this.onDismiss = this.onDismiss.bind(this);
     this.PowerButton = this.PowerButton.bind(this)
     this.powerOn = this.powerOn.bind(this)
   }
       componentDidMount (){
        this.getStatus();
    }

    getStatus =()=>{
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
                     if (response.data.state === 1){
                         console.log("Data ", response.data);
                         this.setState({status: 'on' });
                     }
                     else if(response.data.state === 2){
                         console.log("Data ", response.data);
                         this.setState({status: 'off' });
                      }
                     else if(response.data.state === 3){
                         console.log("Data ", response.data);
                         this.setState({status: 'disabled' });
                         this.setState({visible: !this.state.visible})

                     }
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

    };

   onDismiss(){
    this.setState({visible: !this.state.visible})
    }
    powerOn  = () =>  {

        const user_id = this.state.user;
        let state ;
        let status = this.state.status;
        const token = Cookies.get('token');
        console.log("Stat", status);
        if (status === "off"){
            state = 1 //if off turn on
        }
        else if(status === "on"){
            state = 2 //if on turn off
        }
        const params= {
           'state': state
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
                console.log("Update ", response.data.state);
                 if (response.data.state === 1){
                     this.setState({status:"on"});
                 }
                 else if(response.data.state === 2){
                     this.setState({status:"off"});
                 }
                 else if(response.data.state === 3){
                     this.setState({status:"disabled"});
                     this.onDismiss()
                 }
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
         if (this.state.status !=="disabled") {
             element.classList.toggle("on");
             this.powerOn()

         }
         else{
             element.className= "off";
             let powerButton= document.getElementById("power-pad");
             powerButton.disabled=true;


         }

    };


  render() {
         console.log("Really ", this.state.status);
    return (
        <div className="content">
             <section id="power-section">
                 <fieldset id="power-pad">
                     <span  id="power-button" onClick={this.PowerButton}  className={this.state.status}> &#xF011;</span>
                     <span></span>
                 </fieldset>

             </section>

            <Alert color="warning" isOpen={this.state.visible} toggle={this.onDismiss}>
                <span>Your device has been disabled, contact your disco.</span>
            </Alert>
      </div>

    )

  }
}

export default PowerButton;