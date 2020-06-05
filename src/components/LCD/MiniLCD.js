import './MiniLCD.css';
import React, {Component} from "react";

class MiniLCD extends Component {

     constructor(props) {
         super(props);
         this.state = {
             digits: {
                 0: ['-', '|', '|', ' ', '|', '|', '-'],
                 1: [' ', ' ', '|', ' ', ' ', '|', ' '],
                 2: ['-', ' ', '|', '-', '|', ' ', '-'],
                 3: ['-', ' ', '|', '-', ' ', '|', '-'],
                 4: [' ', '|', '|', '-', ' ', '|', ' '],
                 5: ['-', '|', ' ', '-', ' ', '|', '-'],
                 6: ['-', '|', ' ', '-', '|', '|', '-'],
                 7: ['-', ' ', '|', ' ', ' ', '|', ' '],
                 8: ['-', '|', '|', '-', '|', '|', '-'],
                 9: ['-', '|', '|', '-', ' ', '|', '-'],
                 '-': [' ', ' ', ' ', '-', ' ', ' ', ' '],
             },
             number: "",
             scale:"",
         };
     }






    componentDidMount (){
        this.onLoad();
    };

    componentDidUpdate (){
        this.onLoad();
    };

    space =(scale)=> {

        let s = '';
        scale = 1;
        for(let i=0; i < scale; i++) {
            s += ' ';
        }
        return s;
    };


    r = (rid, number, scale)=> {
        let s="";
        for(let ni=0; ni < number.length; ni++) {
            let digit = number[ni];
            s += ' ';
            for(let i=0; i < scale; i++) {
                s+=this.state.digits[digit][rid];
            }
        s += ' ';

        s += this.space(scale);
      }
      s += '\n';

      return s;
    };


     c = (cid, number, scale)=> {
         let s="";
         for(let i=0; i < scale; i++) {
             for(let ni=0; ni < number.length; ni++) {
                 let digit = number[ni];
                 s+=this.state.digits[digit][cid];
                 for(let j=0; j < scale; j++) {
                     s+=' ';
                 }
                 s+=this.state.digits[digit][cid+1];

                 s += this.space(scale);
             }
             s+='\n';
         }
         return s;
     };

     lcd = (number, scale)=> {
         return this.r(0, number, scale) +
             this.c(1, number, scale) +
             this.r(3, number, scale) +
             this.c(4, number, scale) +
             this.r(6, number, scale) ;
     };


      refresh = (event)=> {
         let pre = document.getElementById('mini-lcd');
         let text = this.props.reading;  // Slider Value
         pre.textContent = this.lcd(text.toString(), 1);
         return false;
      };


       onLoad =() => {
          this.refresh();
      };







    render(){
        console.log("Waow ", this.props.reading);
        return(
            <div>
                <pre id="mini-lcd" >

                </pre>
            </div>
        );

    }

}



export default MiniLCD;