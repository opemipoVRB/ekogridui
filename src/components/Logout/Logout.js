import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as types from '../constants/actionTypes';

class Logout extends Component{


 componentWillMount() {
    this.props.dispatch({
      type: types.LOGOUT__REQUESTED
    })
  }

    render(){
        return(
            <div>
                Now loggedOut;
            </div>
        )
    }
}


export default connect()(Logout);