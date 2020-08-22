import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {Link} from 'react-router-dom';

const NotLoggedLink = () =>
    <>
      <div className="header-item">
        <Link to="/login" className="header-link py-5px">
          Login
        </Link>
      </div>
      <div className="header-item">
        <Link to="/register" className="header-link py-5px">
          Register
        </Link>
      </div>
    </>

  const LoggedLink = ({userData}) =>
    <>
      <div className="header-item mr-5">
          <Link to="/explore" className="btn btn-white btn-rounder explore-btn">Explore</Link>
      </div>
      <div className="header-item">
        <details className="header-dropdown" id="profile">
          <summary className="btn btn-default px-7 header-button"><span>{userData.username}</span><i className="arrow"></i><div className="sml-photo mx-auto text-center">{userData.hasPhoto ? <img src={`https://storage.googleapis.com/schnitzel/avatar/${userData.id}/${userData.id}${userData.photoExt}`} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />}</div></summary>
          <ul className="header-dropdown-menu dropdown-menu-dark">
            <Link to="/profile" className="dropdown-item">View Profile</Link>
            <Link to="/profile/edit" className="dropdown-item">Edit Profile</Link>
            <li className="dropdown-divider"/>
            <Link to="/logout" className="dropdown-item">Logout</Link>
          </ul>
        </details>
      </div>
    </>

@inject("AuthStore")
@observer
class Navbar extends Component {
    render() {
        return (
            <header className="header border-bottom border-black p-5 f4">
                <div className={this.props.AuthStore.isAuth ? "header-item--full" : "header-item--full"}>
                    <Link to="/">Home</Link>
                </div>
                { this.props.AuthStore.isAuth ? <LoggedLink userData={this.props.AuthStore.userData} /> : <NotLoggedLink /> }
            </header>
        );
    }
}

export default Navbar;