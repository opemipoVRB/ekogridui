import React, {Component, createRef} from "react";
import {findDOMNode} from "react-dom";
import "assets/css/powerbutton/powerbutton.css";



class PowerButton extends Component {
    constructor(props){
        super(props);
    }


  render() {
      function PowerButton(e){
      let element = e.target;
        element.classList.toggle("on");
    }


    return (
        <section id="power-section">
            <a href="#" id="power-button" onClick={PowerButton}  className="on"> &#xF011;</a>
            <span></span>
        </section>
    )

  }
}

export default PowerButton;