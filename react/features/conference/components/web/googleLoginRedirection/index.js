import React, { Component } from 'react';
import GoogleLogin from 'react-google-login';

class GoogleLoginRedirectionPage extends Component {
  constructor(props) {
    super(props);
    // this._googleButtonRef = React.createRef();

    // let timer = setInterval(() => {
    //     if(this._googleButtonRef.current) {
    //         clearInterval(timer);
    //         this._googleButtonRef.current.click()
    //     }
    // }, 100)
  }

  // Function that will run when there is a successful google sign-on
  successResponse = response => {
    if (!response.hasOwnProperty('error')) {
        const link = document.createElement('a');
        link.href = `jifeet://response=success`;
        document.body.appendChild(link);
        link.click();
      }
  }

  // Function that will run when there is a failure in google sign-on
  failureResponse = response => {

  }

  render() {
    const CLIENTID='143401360954-91aq4dbaj70tj4q6demjgsj5odk1bppt.apps.googleusercontent.com';
    return (
      <div className="App">
        {/*<div>Jifmeet is authenticating your login ...</div>*/}
        <div /*style={{ display: 'none' }}*/>
            <GoogleLogin
                //ref = { this._googleButtonRef }
                accessType={"offline"}
                scope={"profile email"}
                clientId={CLIENTID}
                buttonText="Login"
                onSuccess={this.successResponse}
                onFailure={this.failureResponse}
                cookiePolicy={'single_host_origin'}
            />
        </div>
      </div>
    );
  }
}

export default GoogleLoginRedirectionPage;