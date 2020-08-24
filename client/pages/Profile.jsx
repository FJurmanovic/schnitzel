import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter } from 'react-router-dom';

@inject("ProfileStore")
@observer
class Profile extends Component {
    componentWillMount() {
        let { profileName } = this.props.match.params;
        this.props.ProfileStore.componentMounted(profileName);
        window.addEventListener('scroll', this.props.ProfileStore.handleScroll);
    }

    componentWillUnmount() {
        this.props.ProfileStore.destroy();
        window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
    }

    componentDidUpdate(prevProps) {
        let { profileName } = this.props.match.params;
        window.removeEventListener('scroll', this.props.ProfileStore.handleScroll);
        if (profileName !== prevProps.match.params.profileName) {
            this.props.ProfileStore.componentMounted(profileName, () => window.addEventListener('scroll', this.props.ProfileStore.handleScroll));
        }
    }

    render() {
        return <> {!this.props.ProfileStore.isLoading && <>
            { this.props.ProfileStore.validProfile ? 
            <div onScroll={this.props.ProfileStore.handleScroll}>
                <div>
                    <div className="profile-image mx-auto text-center">{this.props.ProfileStore.profileData.hasPhoto ? <img src={`https://storage.googleapis.com/schnitzel/avatar/${this.props.ProfileStore.profileData.id}/${this.props.ProfileStore.profileData.id}${this.props.ProfileStore.profileData.photoExt}`} className="card-img-top" /> : <img src="https://storage.googleapis.com/schnitzel/default.jpg" className="card-img-top" />}</div>
                    <div className="mx-auto text-center">
                    <ul className="d-inline-block m-3 text-left">
                        <button className="btn btn-blue-transparent btn-rounder border-blue d-inline-block" onClick={() => this.setState({showFollowers: true})}>Followers</button>
                    </ul>
                    <ul className="d-inline-block m-3 text-left">
                        <button className="btn btn-blue-transparent btn-rounder border-blue" onClick={() => this.setState({showFollowing: true})}>Following</button>
                    </ul>
                    </div>
                </div>
            </div>
            : <div>User could not be found.</div>
        }</> } </>
    }
}

export default withRouter(Profile);