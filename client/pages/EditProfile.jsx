import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import {withRouter} from 'react-router-dom';

import {Switch} from '../components';
import {SwitchStore} from '../stores';

@inject("EditProfileStore")
@observer
class EditProfile extends Component {
  componentWillMount() {
    this.props.EditProfileStore.currentData();
  }

  componentWillUnmount() {
    this.props.EditProfileStore.toDefault();
  }

    render() {
        return (
            <div className="edit-profile">
            <form onSubmit={(e) => this.props.EditProfileStore.submitClick(e, this.props.history)} className="col-7 mx-auto">
              <div className="change-image">
                <label>
                  {this.props.EditProfileStore.userData.hasPhoto ? <img src={this.props.EditProfileStore.userData.url} className="img-edit" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="img-edit" />}
                  <div className={`image-overlay ${this.props.EditProfileStore.selectedFile ? "changed" : ""}`}>
                    {this.props.EditProfileStore.selectedFile
                    ? <span className="change">Image selected</span>
                    : <span className="change">Change image</span>
                    }
                  </div>
                  <input type="file" hidden onChange={(e) => this.props.EditProfileStore.imageChange(e.target.files[0])} />
                </label>
              </div>
              {this.props.EditProfileStore.selectedFile && 
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    this.props.EditProfileStore.selectedFile = null;
                  }}
                  className="btn btn-red"
                >Remove selected image</button>
              }
              
              <hr />
              <div className="lbl"><Switch store={new SwitchStore(this.props.EditProfileStore.editUsername, this.props.EditProfileStore.toggleUsername)} /><span>Change username</span></div>
                <input className="width-full py-3 f4" type="text" disabled={!this.props.EditProfileStore.editUsername} value={this.props.EditProfileStore.usernameValue || ""} onChange={(e) => this.props.EditProfileStore.usernameChange(e.target.value)} />
                <br />
                <div className="lbl"><Switch store={new SwitchStore(this.props.EditProfileStore.editEmail, this.props.EditProfileStore.toggleEmail)} /><span>Change e-mail</span></div>
                <input className="width-full py-3 f4" type="email" disabled={!this.props.EditProfileStore.editEmail} value={this.props.EditProfileStore.emailValue || ""} onChange={(e) => this.props.EditProfileStore.emailChange(e.target.value)} />
                <br />
              <div className="lbl"><Switch store={new SwitchStore(this.props.EditProfileStore.editPassword, this.props.EditProfileStore.togglePassword)} /><span>Change password</span></div>
              {this.props.EditProfileStore.editPassword
              && <><label>New password:<br />
                <input className="width-full py-3 f4" type="password" value={this.props.EditProfileStore.passwordValue || ""} onChange={(e) => this.props.EditProfileStore.passwordChange(e.target.value)} />
                </label>
                <br />
                <label>Confirm password:<br />
                <input className="width-full py-3 f4" type="password" value={this.props.EditProfileStore.password2Value || ""} onChange={(e) => this.props.EditProfileStore.password2Change(e.target.value)} />
                </label></>
              }
              <div className="lbl"><Switch store={new SwitchStore(this.props.EditProfileStore.editPrivacy, this.props.EditProfileStore.togglePrivacy)} /><span>Change privacy</span></div>
              {this.props.EditProfileStore.editPrivacy && <>
                <div className="btn-radio">
                  <input id="private" type="radio" value="private" checked={this.props.EditProfileStore.privacyValue === "private"} onChange={(e) => this.props.EditProfileStore.privacyChange(e.target.value)}/>
                  <label htmlFor="private">Private</label>
                </div>
                <div className="btn-radio">
                  <input id="public" type="radio" value="public" checked={this.props.EditProfileStore.privacyValue === "public"} onChange={(e) => this.props.EditProfileStore.privacyChange(e.target.value)}/>
                  <label htmlFor="public">Public</label>
                </div>
                <br />
                </>
              }
                <br />
              {(this.props.EditProfileStore.editUsername || this.props.EditProfileStore.editEmail || this.props.EditProfileStore.editPassword || this.props.EditProfileStore.editPrivacy || this.props.EditProfileStore.selectedFile) && 
                <div>
                  <div>
                    <div className="h4 text-lightred">This will change:</div>
                    {this.props.EditProfileStore.editUsername && <div className="f5">Username</div>}
                    {this.props.EditProfileStore.editEmail && <div className="f5">Email</div>}
                    {this.props.EditProfileStore.editPassword && <div className="f5">Password</div>}
                    {this.props.EditProfileStore.editPrivacy && <div className="f5">Privacy</div>}
                    {this.props.EditProfileStore.selectedFile && <div className="f5">Avatar</div>}
                  </div>
                  <input className="btn btn-blue width-full my-5" type="submit" value="Submit" />
                </div>
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