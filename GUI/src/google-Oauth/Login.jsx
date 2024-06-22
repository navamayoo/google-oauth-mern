import React, { useEffect, useState } from "react";
import {
  GoogleOAuthProvider,
  GoogleLogin,
  googleLogout,
} from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;

export default function Login() {
  const [loginData, setLoginData] = useState(
    localStorage.getItem("loginData")
      ? JSON.parse(localStorage.getItem("loginData"))
      : null
  );

  const [user, setUser] = useState({});

  useEffect(() => {
    if (loginData) {
      const decodedUser = jwtDecode(loginData.sessionToken);
      setUser(decodedUser);
    }
  }, [loginData]);

  const handelLogin = async (googleData) => {
    try {
      const res = await fetch("http://localhost:5000/api/google-login", {
        method: "POST",
        body: JSON.stringify({ token: googleData }),
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


  const handelLogout = () => {
    setLoginData(null);
    localStorage.removeItem("loginData");
    googleLogout();
  };


  return (
    <div className="App">
      {loginData ? (
        <>
          <div>
            <img src={user.picture} alt={user.userName} />
            <h3>{user.email}</h3>
            <h6>{user.userName}</h6>
          </div>
          <div>
            {" "}
            <button onClick={handelLogout}>Logout</button>
          </div>
        </>
      ) : (
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
      )}
    </div>
  );
}
