import React from 'react';
import { Link } from 'react-router-dom';
import img from './assets/images/404.gif';
import Image from "./components/Home/elements/Image";
import {Button} from "reactstrap";


class NotFoundPage extends React.Component{
    render(){
        return(
            <div className="container">
                <p className="centered">

                    <Link to="/">
                        <Button>
                            Go to Home
                        </Button>
                    </Link>
                </p>
                <Image
                    img src={img} alt="404-NotFound"
                    height={2500}
                    width={1500}
                    style={{ alignSelf: 'center' }}
                />
          </div>

            )

    }
}

export default NotFoundPage;