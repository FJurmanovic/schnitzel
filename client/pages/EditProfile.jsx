import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

@inject("EditProfileStore")
@observer
class EditProfile extends Component {
  componentWillMount() {
    this.props.EditProfileStore.currentData();
  }

    render() {
        return (
            <div>
            <form onSubmit={(e) => this.props.EditProfileStore.submitClick(e, this.props.history)}>
              {this.props.EditProfileStore.editAvatar
              ? <label>Image:<br />
                {this.props.EditProfileStore.userData.hasPhoto && <img src={`https://storage.googleapis.com/schnitzel/avatar/${this.props.EditProfileStore.userData.id}/${this.props.EditProfileStore.userData.id}${this.props.EditProfileStore.userData.photoExt}`} className="card-img-top" />}
                    <input type="file" onChange={(e) => this.props.EditProfileStore.imageChange(e.target.files[0])} />
                </label>
              : <span><a href="#" onClick={() => {this.props.EditProfileStore.editAvatar = true}}>Edit profile picture</a></span>
              }
                <br />
              {this.props.EditProfileStore.editUsername 
              ? <label>Username(max. 10):<br />
                <input type="text" value={this.props.EditProfileStore.usernameValue || ""} onChange={(e) => this.props.EditProfileStore.usernameChange(e.target.value)} /> <a href="#" onClick={() => {this.props.EditProfileStore.editUsername = false}}>Cancel</a>
                </label>
              : <span><input type="text" value={this.props.EditProfileStore.usernameValue || ""} disabled /> <a href="#" onClick={() => {this.props.EditProfileStore.editUsername = true}}>Edit username</a></span>
              }
                <br />
              {this.props.EditProfileStore.editEmail
              ? <label>Email:<br />
                <input type="email" value={this.props.EditProfileStore.emailValue || ""} onChange={(e) => this.props.EditProfileStore.emailChange(e.target.value)} /> <a href="#" onClick={() => {this.props.EditProfileStore.editEmail = false}}>Cancel</a>
                </label>
              : <span><input type="email" value={this.props.EditProfileStore.emailValue || ""} disabled /> <a href="#" onClick={() => {this.props.EditProfileStore.editEmail = true}}>Edit email</a></span>
              }
                <br />
              {this.props.EditProfileStore.editPassword
              ? <><label>New password:<br />
                <input type="password" value={this.props.EditProfileStore.passwordValue || ""} onChange={(e) => this.props.EditProfileStore.passwordChange(e.target.value)} />
                </label>
                <br />
                <label>Confirm password:<br />
                <input type="password" value={this.props.EditProfileStore.password2Value || ""} onChange={(e) => this.props.EditProfileStore.password2Change(e.target.value)} /> <a href="#" onClick={() => {this.props.EditProfileStore.editPassword = false}}>Cancel</a>
                </label></>
              : <span><a href="#" onClick={() => {this.props.EditProfileStore.editPassword = true}}>Edit password</a></span>
              }
                <br />
              {this.props.EditProfileStore.editPrivacy
              ? <><label>Profile privacy:<br />
                  <label>Private <input type="radio" value="private" checked={this.props.EditProfileStore.privacyValue === "private"} onChange={(e) => this.props.EditProfileStore.privacyChange(e.target.value)}/></label>
                  <label>Public <input type="radio" value="public" checked={this.props.EditProfileStore.privacyValue === "public"} onChange={(e) => this.props.EditProfileStore.privacyChange(e.target.value)}/></label>
                  <br />
                </label></>
              : <span><a href="#" onClick={() => {this.props.EditProfileStore.editPrivacy = true}}>Edit privacy</a></span>

              }
                <br />
              {(this.props.EditProfileStore.editUsername || this.props.EditProfileStore.editEmail || this.props.EditProfileStore.editPassword || this.props.EditProfileStore.editPrivacy || this.props.EditProfileStore.editAvatar) && 
                <input type="submit" value="Submit" />
              }

              {
                <>
                {
                  this.props.EditProfileStore.err.map((error, key) => {
                    return <React.Fragment key={key}>
                      <div>{error}</div>
                    </React.Fragment>
                  })
                }
                </>
              }
                
            </form>
            <br/><br/>
          </div>
        );
    }
}

export default withRouter(EditProfile);