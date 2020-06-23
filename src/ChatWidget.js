import React from "react";
import {addLinkSnippet, addResponseMessage, addUserMessage, setQuickButtons, Widget} from "react-chat-widget";
import 'react-chat-widget/lib/styles.css';
import "ChatWidget.css"
import axios from "axios";
import {API_BASE_URL} from "./constants/apiContants";
import Cookies from "js-cookie";

class ChatWidget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            nestedModal:false,
            closeAll:false,
            token:Cookies.get('token'),
            user:Cookies.get('userID'),
            stakeholder:"",
        };


    }

    componentDidMount (){
        addResponseMessage('Welcome to this awesome chat!');
        this.getPreviousMessages();
        this.getStakeholderInfo();
    };


    getStakeholderInfo=()=>{
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
                 let stakeholder = response.data.device.stakeholder;
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
                           console.log(message.text)
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
        const payload = {
                text: "",
                sent_by_subscriber: (sender === "subscriber"),
                chat_bot_response: (sender === "chat-bot"),
                name: null,
                stakeholder: null,

            };
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
         addResponseMessage('Ok wesome chat!');
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


