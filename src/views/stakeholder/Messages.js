import React from "react";
import Messenger from "../../components/MessageManagement/Messenger";


class Messages extends React.Component {


        render(){
            return(
                <>
                    <div className="content">
                        <Messenger/>
                    </div>
                </>
            );
        }
}



export default Messages;