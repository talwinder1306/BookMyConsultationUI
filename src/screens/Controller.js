import React, {useState} from "react";
import Home from "../screens/home/Home";
import { BrowserRouter as Router, Route } from "react-router-dom";

const Controller = () => {
  const baseUrl = "http://localhost:8080/";
  const [accessToken, setAccessToken] = useState('');
  const [loggedInUserId, setLoggedInUserId] = useState('');

  return (
    <Router>
      <div className="main-container">
        <Route
          exact
          path="/"
          render={(props) => <Home {...props} baseUrl={baseUrl}
                                   accessToken={accessToken} setAccessToken={setAccessToken}
                                   loggedInUserId={loggedInUserId} setLoggedInUserId={setLoggedInUserId}/>}
        />
      </div>
    </Router>
  );
};

export default Controller;
