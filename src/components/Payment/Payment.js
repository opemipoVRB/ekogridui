import React, { Component } from 'react';
//import the library
import PaystackButton from 'react-paystack';
import axios from "axios";
import Cookies from 'js-cookie';
import {createBrowserHistory} from "history";
import {API_BASE_URL} from "../../constants/apiContants";
const history = createBrowserHistory({forceRefresh:true});



class Payment extends Component {
    constructor(props) {
    super(props);
      this.state = {
          user: Cookies.get("userID"),
          token: Cookies.get("token"),
          pub_key:  process.env.REACT_APP_PAYSTACK_PUBLIC_KEY, //PAYSTACK PUBLIC KEY
          secret_key: process.env.REACT_APP_PAYSTACK_SECRET_KEY,
          reference: null,
          message: null,
          unit : this.props.unit,
      };

   }
  componentDidMount(){
      this.setState({reference:this.getReference()});
  }

  callback = (response) => {


        this.verifyTransaction();
        console.log(response.message); // card charged successfully, get reference here



  };

    updateUnit =() =>{
        console.log("No of Units Bought ", this.props.unit);
        console.log("User ", this.state.user);
        const user_id = this.state.user;
        const stakeholder = this.props.stakeholder;
        const units_purchased = this.props.unit;
        const token = this.state.token;
        const reference= this.state.reference;
        const amount = this.props.amount;

        const params= {
            "description": 2,
            "reference": reference,
            "payment": amount,
            "unit_is_purchased": true,
            "units_purchased": units_purchased,
            "subscriber": user_id,
            "stakeholder": stakeholder
};
                console.log(params);

       axios(
           {
               headers: {
                   Authorization: `Token ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'post',
               url: API_BASE_URL +'gridtracker/api/create/transaction',
               data: params,
               withCredentials: false
            })
             .then((response) => {
                 console.log("Transact Response  ", response);
                 if (response.status === 201) {
                     console.log("Data ", response);
                     this.redirectToPaymentStatus();
                 }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });




    };


    redirectToPaymentStatus = () => {
        history.push("/payment-status");
    };


  verifyTransaction =()=>{
      Cookies.remove("transaction-status");
      const token = this.state.secret_key;
      const reference= this.state.reference;
       axios(
           {
               headers: {
                   Authorization: `Bearer ${token}`,
                   'Content-Type': 'application/json',
                   'Accept' : 'application/json',

               },
               method: 'get',
               url: 'https://api.paystack.co/transaction/verify/'+ reference,
               withCredentials: false
            })
             .then((response) => {
                 if (response.status === 200) {
                     console.log("Data ", response);
                     if (response.data.status === true) {
                         console.log("Data ", response.data.message);
                         this.setState({message:response.data.message});
                         Cookies.set("transaction-status", response.data.message);
                         this.updateUnit();
                     }
                else if (response.status === false) {
                    console.log("Data ", response)
                 }
                 }
            })
            .catch((error) => {
                if (error.response) {
                    console.log('Error', error.message);
                }
            });


  };




  close = () => {
    console.log("Payment closed");
  };

  getReference = () => {
    //you can put any unique reference implementation code here
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-.=";

    for (let i = 0; i < 15; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));

    return "PAYSTACK_" + text;
  };

  render() {
    return (
        <div   color="primary">
            <PaystackButton
                text="Pay"
                callback={this.callback}
                className="payButton button"
                close={this.close}
                // disabled={true}
                // embed={true}
                reference={this.state.reference}
                email={this.props.email}
                amount={this.props.amount * 100}
                paystackkey={this.state.pub_key}
                tag="button"
                />
      </div>


    );
  }
}

export default Payment;