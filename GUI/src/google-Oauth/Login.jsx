import React from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function login() {

  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );


  const handelLogin = async (googleData) => {
    //const userData = jwtDecode(googleData);

    try {
      const res = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        body: JSON.stringify({token: googleData, }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error("Failed to log in with Google");
      }

      const data = await res.json();
      setLoginData(data);
      localStorage.setItem("loginData", JSON.stringify(data));
    } catch (error) {
      console.error("Error logging in:", error);
    }
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
