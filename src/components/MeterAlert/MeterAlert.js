import './MeterAlert.css';
import React, {Component} from "react";
import LCD from "../LCD/LCD";
class MeterAlert extends Component {
    state = {
        value: 450,
        min: 0,
        max: 5000,

    };




     setValue =(e)=> {
         let element = e.target;
        let value = element.value;
        this.setState({value: value});
        };




    render(){
        return(
            <div>
                <LCD reading={this.state.value}/>
                <fieldset>
                    <input type="range" name="rangeInput" min={this.state.min} max={this.state.max} value={this.state.value} onChange={this.setValue}/>
                </fieldset>
                <span  onClick={""}  className="alert-start">start</span>


            </div>


        );

    }

}



export default MeterAlert;