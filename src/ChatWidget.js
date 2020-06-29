import React from "react";
import {addLinkSnippet, addResponseMessage, addUserMessage, setQuickButtons, Widget} from "react-chat-widget";
import 'react-chat-widget/lib/styles.css';
import "ChatWidget.css"
import axios from "axios";
import {API_BASE_URL, WS_BASE_URL} from "./constants/apiContants";
import Cookies from "js-cookie";

class ChatWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            nestedModal:false,
            closeAll:false,
            token:Cookies.get('token'),
            userID:Cookies.get('userID'),
            stakeholder:"",
        };


    }

    componentDidMount (){
        addResponseMessage('Welcome to this awesome chat!');
        this.getPreviousMessages();
        this.getStakeholderInfo();
    };


    getStakeholderInfo=()=>{
         const user_id = this.state.userID;
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
                 let stakeholder = response.data.device.stakeholder;
                 console.log("HHHH", stakeholder);
                 this.setState({stakeholder:stakeholder});
            }
        })
        .catch((error) => {
            if (error.response) {
                console.log('Error', error.message);
            }
        });

    };

    getPreviousMessages =()=>{
        this.connect(this.state.userID);
        const token = this.state.token;
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },
                method: 'get',
                url: API_BASE_URL +'gridtracker/api/icontact-us/',
                withCredentials: true
            })
            .then((response) => {
                if (response.status === 200) {
                    console.log(response.data.results)
                    response.data.results.forEach((message, index)=>{
                        // chat_bot_response,sent_by_subscriber
                        // message.chat_bot_response ===false &&
                       if (message.sent_by_subscriber===false){
                           addResponseMessage(message.text);
                       }
                       else if(message.sent_by_subscriber===true){
                           addUserMessage(message.text)
                       }
                    });
                }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


    };

    saveChatMessage =(message, sender)=>{
        const token = this.state.token;
        const stakeholder = this.state.stakeholder;
        const userID = this.state.userID;
        const payload = {
                text: message,
                sent_by_subscriber: (sender === "subscriber"),
                chat_bot_response: (sender === "chat-bot"),
                name: userID,
                stakeholder: stakeholder,

            };
        console.log(" PAyload", payload);
        axios(
            {
                headers: {
                    Authorization: `Token ${token}`,
                    'Content-Type': 'application/json',
                    'Accept' : 'application/json',
                },

            method: 'post',
            url: API_BASE_URL +'gridtracker/api/create-message/icontact-us/',
            data: payload,
            withCredentials: true

        })
        .then((response) => {
            if (response.status === 201) {


            }
        })
        .catch((error) => {
            if (error.response) {
                console.log('Error', error.message);
            }
        });
    };




    handleNewUserMessage = (newMessage) => {
    console.log(`New message incoming! ${newMessage}`);
    // Now send the message throught the backend API
        const response = {
            title: 'My awesome link',
            link: 'https://github.com/Wolox/react-chat-widget',
            target: '_blank'
        };
        // addLinkSnippet(response)
        this.saveChatMessage(newMessage,"subscriber");
          this.realTimeChat(newMessage);
  };




     connect = (chat_room) =>{
            let ws = new  WebSocket(WS_BASE_URL+"gridtracker/chat/" + chat_room+"/" );
             console.log("WS 2 ", ws);
            this.setState({ws:ws});

     };



    realTimeChat = (message) =>{
       let ws = this.state.ws;
       console.log("WS ", ws);
        ws.onopen = () =>{


            };
        ws.send(JSON.stringify({
                'message': {
                    'subscriber': true,
                    text: message,
                }
            }));
        console.log("MEssage ", message);



        ws.onmessage = e =>{
            let data = JSON.parse(e.data);
            if(data.message.subscriber){
                console.log("Subscriber Message", data);


            }
            else if(data.message.stakeholder) {
                console.log("Stakeholder Message", data);
                addResponseMessage(data.message.text);
            }
        };
    };


    handleQuickButtonClicked = data => {
    console.log(data);
    const quickRes=[{label: "Help", value:"Help"},{label:"Who", value:"Who"}];
    setQuickButtons(quickRes.filter(button => button.value !== data));
  };





    render(){
        return(
                <div>
                     <Widget
                         handleNewUserMessage={this.handleNewUserMessage}
                         handleQuickButtonClicked={this.handleQuickButtonClicked}
                         title="GridBot"
                         subtitle=""
                         profileAvatar={require("assets/img/bot.png")}

                     />
                </div>
        );
    }

}



export default ChatWidget;


