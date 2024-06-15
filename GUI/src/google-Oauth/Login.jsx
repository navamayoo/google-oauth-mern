import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function login() {
  const handelLogin = (googleData) => {
    const userData = jwtDecode(googleData);
    console.log(userData);
  };

  return (
    <div className="App">
      <button type="button">

        <GoogleOAuthProvider clientId={CLIENT_ID}>

          
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              handelLogin(credentialResponse.credential);
            }}
            onError={() => {}}
          />
        </GoogleOAuthProvider>
      </button>
    </div>
  );
}
