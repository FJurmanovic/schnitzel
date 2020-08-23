import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class Landing extends Component {
    render() {
        return (
            <div className="welcome text-center">
                <div className="f1-light mb-n4 text-gray-darker">Welcome to</div>
                <div className="title-schn">Schnitzel</div>
                <div className="">
                    <div className="my-2"><Link to="/register" className="btn btn-blue f3 p-4 wlcm-reg">Get started</Link></div>
                    <div className="my-4"><Link to="/login" className="">Already have an account? Log in</Link></div>

                    <div><Link to="/demologin" className="text-bold">Log in with demo account</Link></div>
                </div>
            </div>
        );
    }
}

export default Landing;