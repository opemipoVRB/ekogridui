import './MeterAlert.css';
import React, {Component} from "react";
import  LCD from "../LCD/LCD";

import axios from "axios";
import {API_BASE_URL, WS_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import MiniLCD from "../LCD/MiniLCD";
import {Alert} from "reactstrap";
class MeterAlert extends Component {
     constructor(props) {
         super(props);
         this.state = {
             user: Cookies.get("userID"),
             token: Cookies.get("token"),
             meter_no: "",
             threshold: 0,
             trigger:0,
             max: 0,
             min: 0,
             status: "Start",
             messages : [] ,
             message: "",
             ws: {},
             result: {},
             run: false,
             pk: null,
             visible: false,
         };
         this.onDismiss = this.onDismiss.bind(this);
     }
     onDismiss(){
         this.setState({visible: !this.state.visible})
     }

    setValue =(e)=> {
        let element = e.target;
        let value = element.value;
        this.setState({threshold: value,
        });
    };


    componentDidMount () {
        this.getLimit();

    };

     componentDidUpdate (){
         if (this.state.run ===true){
             this.run();
         }
    }

     connect = (meter_no) =>{
            const ws= new  WebSocket(WS_BASE_URL+"gridtracker/telemetry/"+ meter_no);
            this.setState({ws:ws});
     };

     getAlert =()=>{
         const token = this.state.token;
         axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },
                method: 'get',
                url: API_BASE_URL +'gridtracker/api/alerts/',
                withCredentials: true
            })
            .then((response) => {
                if (response.status === 200) {
                     let threshold = this.state.threshold;
                     let _result = this.state.result;
                     let pk =this.state.pk;
                     let status =this.state.status;
                     let trigger = this.state.trigger;
                     let run = this.state.run;
                     response.data.results.forEach(function (result) {
                         if (result.is_on === true){
                             if(result.is_active === true){
                                 threshold = result.threshold;
                                 trigger = result.trigger;
                                 _result = result;
                                 pk = result.id;
                                 status = "Stop";
                                 run = true
                             }

                         }
                     });
                     this.setState({
                         threshold: threshold,
                         result: _result,
                         trigger: trigger,
                         status: status,
                         pk : pk,
                         run: run,
                     });
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

     };


     pauseAlert =(on, active)=>{
         const token = this.state.token;
         const pk = this.state.pk;
         const threshold = this.state.threshold;
         const payload ={
             is_on: on,
             is_active: active,
             threshold:threshold,
         };

         axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'put',
                url: API_BASE_URL +'gridtracker/api/update/alert/'+ pk,
                withCredentials: true,
                data: payload,
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log("Pause...", response.data);
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });

     };





    getLimit =()=>{
        const user_id = this.state.user;
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

                method: 'get',
                url: API_BASE_URL +'gridtracker/api/subscriber/'+ user_id,
                withCredentials: true
            })
            .then((response) => {
                if (response.status === 200) {
                    this.setState({max: response.data.device.unit_balance});
                    this.setState({meter_no: response.data.device.meter_no});
                    this.getAlert();
                    this.connect(response.data.device.meter_no);


                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });
    };

    setThreshold =()=>{
        console.log("Status  ...", this.state.status);
        if (this.state.status==="Resume"){
            this.setState({status: "Stop"});
        }
        else if (this.state.status==="Stop"){
            this.setState({status: "Start"});
        }


        if (this.state.status ==="Start"){
            const threshold =this.state.threshold;
            const trigger = this.state.max;
            const token = this.state.token;
            const payload = {
                threshold: threshold,
                trigger: trigger
            };
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

            method: 'post',
            url: API_BASE_URL +'gridtracker/api/create/alert/',
            data: payload,
            withCredentials: true

        })
        .then((response) => {
            if (response.status === 201) {
                console.log("Create Alert ", response.data);
                this.setState({threshold: threshold, status: "Stop"});
                this.setState({run: true});
                console.log("Payload ", payload);
                console.log("Payload ", typeof(threshold));
                console.log("Payload ", typeof(trigger));
                window.location.reload(false);
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log('Error', error.message);
            }
        });
        }
        else if (this.state.status ==="Stop"){
            alert("Stopping Alarm");
            let on = false;
            let active = false;
            this.pauseAlert(on, active);
            this.setState({status: "Resume"});
        }
        else if (this.state.status ==="Resume"){
            alert("Resume Alarm");
            let on = true;
            let active = true;
            this.pauseAlert(on, active);
            this.setState({status: "Stop"});
        }
    };


    run = () =>{
        let ws = this.state.ws;
        ws.onopen = () =>{
            //send any msg from Client if needed
            const message = {"message": {
                "process": "initialize",
                "meter_no": this.state.meter_no,
                "device_type": "monitor-controller",
                "message": "EkoGrid Smart Meter"
            }};
       ws.send(JSON.stringify(message));
       console.log("Initialize ", message);
       };
       //save whatever response from client
        if (this.state.result.is_active===true){
            ws.onmessage = e =>{

                let message=JSON.parse(e.data)["message"];
                if (message["type"]==="alert-notification") {
                    this.setState({message: message["message"]});
                    this.setState({visible: true});
                    console.log("Alert Message ", message["message"] )
                }
                else{
                    this.setState({visible: false});
                    let trigger =  message["unit-balance"];
                    console.log("Threshold ",trigger);
                    if (trigger <= this.state.threshold) {
                        window.location.reload(false);
                    }
                    else {
                        this.setState({trigger: parseInt(trigger)});
                    }
                }
            }
        }
    };






    render(){
        // console.log("LCD", this.state.threshold);
        // console.log("RUN", this.state.run);
        // console.log("Trigger", this.state.trigger);
        // console.log("Min LCD", this.state.max);
        return(
            <div>
                <MiniLCD reading={(this.state.run===false) ? parseInt(this.state.max) : parseInt(this.state.threshold)}/>
                <LCD reading={(this.state.run===true) ? parseInt(this.state.trigger) :parseInt(this.state.threshold)}/>
                <fieldset>
                    <Alert color="info" isOpen={this.state.visible} toggle={this.onDismiss}>
                        <span>{this.state.message}</span>
                    </Alert>
                    <input
                        type="range"
                        name="rangeInput" min={this.state.min}
                        max={this.state.max}
                        value={(this.state.run===true) ? this.state.trigger :this.state.threshold}
                        onChange={this.setValue}
                    />
                </fieldset>
                <button  onClick={this.setThreshold}  className="alert-start">{this.state.status}</button>

            </div>


        );

    }

}



export default MeterAlert;
// reading={ ( this.state.threshold===0)? parseInt(this.state.max) : this.state.threshold}
 // value={ (this.state.status==="Start")? parseInt(this.state.max) : this.state.threshold}