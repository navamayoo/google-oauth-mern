import "./App.css";
import Login from "./google-Oauth/Login";
import Logout from "./google-Oauth/Logout";

function App() {
  return (
    <div className="App">
      <h1>Implementing Google OAuth in MERN</h1>
      <div className="center">
        <Login />
      </div>
      <div className="center">
        <Logout />
      </div>
    </div>
  );
}

export default App;
