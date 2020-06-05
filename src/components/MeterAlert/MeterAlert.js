import './MeterAlert.css';
import React, {Component} from "react";
import  LCD from "../LCD/LCD";

import axios from "axios";
import {API_BASE_URL, WS_BASE_URL} from "../../constants/apiContants";
import Cookies from "js-cookie";
import MiniLCD from "../LCD/MiniLCD";
class MeterAlert extends Component {
    state = {
        user: Cookies.get("userID"),
        token: Cookies.get("token"),
        meter_no: "",
        threshold: 0,
        max: 0,
        min: 0,
        status: "Start",
        messages : [] ,
        ws: {},
        result: {},
        run: false

    };
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
                     let threshold;
                     let _result;
                     let status;
                     response.data.results.forEach(function (result) {
                         if (result.is_on === true){
                             if(result.is_active === true){
                                 threshold = result.threshold;
                                 _result = result;
                                 status = "Resume";

                             }
                         }
                         else{
                             status = "Start"
                         }
                     });
                     console.log(threshold);
                     this.setState({
                         threshold: threshold,
                         result: _result,
                         status: status,
                     });

                     console.log("Sub Alert ", response.data.results);
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
                    console.log("Unit Balance ", response.data.device.unit_balance);
                    console.log("Alert ", response.data.device.meter_no);
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
        console.log("Status  ...", this.state.status)

        if (this.state.status==="Resume"){
            this.setState({status: "Stop"});
        }
        else if (this.state.status==="Stop"){
            this.setState({status: "Start"});
        }


        if (this.state.status ==="Start"){
            const threshold =this.state.threshold;
            const token = this.state.token;
            const payload = {
            threshold: threshold,
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
            this.setState({status: "Resume"});

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
            console.log("Message", e.data["message"]);
            console.log("Message Type", typeof(e.data['message']) );

            if (JSON.parse(e.data)["type"]==="alert-notification") {
                alert(e.data["message"]);
            }
            else{
                let threshold =  JSON.parse(e.data)["message"]["unit-balance"];
                console.log("Threshold ",threshold);
                this.setState({threshold: parseInt(threshold)})

            }
        }
        }
    };






    render(){
        console.log("Threshold", this.state.threshold);
        console.log("Min Threshold", this.state.max);
        return(
            <div>
                <MiniLCD reading={ this.state.max}/>
                <LCD reading={ this.state.threshold }/>
                <fieldset>
                    <input
                        type="range"
                        name="rangeInput" min={this.state.min}
                        max={this.state.max}
                        value={this.state.threshold}
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