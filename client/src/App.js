import "./App.css";
import { BrowserRouter as Router, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import CreateMatch from "./pages/CreateMatch";
import UpdateMatch from "./pages/UpdateMatch";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import CurrentTeam from "./pages/CurrentTeam";
import CurrentPlayer from "./pages/CurrentPlayer";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Teams from "./pages/Teams";
import Chat from "./pages/Chat";

function App() {
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        if (response.data.error) {
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    setAuthState({ username: "", id: 0, status: false });
    window.location.replace("/");
  };

  return (
    <div className="App">
      <AuthContext.Provider value={{ authState, setAuthState }}>
        <Router>
          <div className="navbar">
            <div className="links">
              {!authState.status ? (
                <>
                  <Link to="/login"> Login</Link>
                  <Link to="/registration"> Registration</Link>
                </>
              ) : (
                <>
                  <Link to="/"> Home Page</Link>
                  <Link to="/createpost"> Create A Post</Link>
                  <Link to="/creatematch"> Create A Match</Link>
                  <Link to="/updatematch"> Update A Match</Link>
                  <Link to="/players"> Players</Link>
                  <Link to="/teams"> Teams</Link>
                  <Link to="/leaguetable"> League table</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1><a href={"/profile/"+authState.id}>{authState.username}</a> </h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/chat" exact component={Chat} />
            <Route path="/teams" exact component={Teams} />
            <Route path="/team/:id" exact component={CurrentTeam} />
            <Route path="/player/:id" exact component={CurrentPlayer} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/creatematch" exact component={CreateMatch} />
            <Route path="/updatematch" exact component={UpdateMatch} />
            <Route path="/post/:id" exact component={Post} />
            <Route path="/registration" exact component={Registration} />
            <Route path="/login" exact component={Login} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/changepassword" exact component={ChangePassword} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
