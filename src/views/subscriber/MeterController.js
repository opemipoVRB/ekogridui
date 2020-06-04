import React from "react";
import PowerButton from "../../components/PowerButton/PowerButton";

class MeterController extends React.Component {
    constructor(props) {
    super(props);
    this.state = {
    };

   }



    render(){
        return(
            <>
                <div className="content">
                     <PowerButton/>
                 </div>
            </>


        );
    }

}



export default MeterController;

