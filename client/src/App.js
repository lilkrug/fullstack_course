import "./App.css";
import { BrowserRouter as Router,withRouter,  Redirect, useHistory, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import CreateMatch from "./pages/CreateMatch";
import CreateTeam from "./pages/CreateTeam";
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

// const AuthRoute = ({ component: Component, ...rest }) => {
//   const isAuthenticated = localStorage.getItem("accessToken") != null;
//   console.log(isAuthenticated)

//   return (
//     <Route
//       {...rest}
//       render={(props) =>
//         isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
//       }
//     />
//   );
// };


// const RegistrationWithRouter = withRouter(Registration);
// const LoginWithRouter = withRouter(Login);

function App() {
  const AuthRoute = ({ component: Component, ...rest }) => {
  
    return (
      <Route
        {...rest}
        render={(props) =>
          authState.status ? <Redirect to="/" /> : <Component {...props} />
        }
      />
    );
  };
  const PrivateRoute = ({ component: Component, ...rest }) => {
    console.log(authState.status)
    return (
      <Route
        {...rest}
        render={(props) =>
          authState.status ?<Component {...props} /> :  <Redirect to="/" />
        }
      />
    );
  };
  
  
  const RegistrationWithRouter = withRouter(Registration);
  const LoginWithRouter = withRouter(Login);  
  const ChatWithRouter = withRouter(Chat); 
  const TeamsWithRouter = withRouter(Teams); 
  const ChatWithRouter = withRouter(Chat); 
  const ChatWithRouter = withRouter(Chat); 
  const ChatWithRouter = withRouter(Chat); 
  const ChatWithRouter = withRouter(Chat); 
  const ChatWithRouter = withRouter(Chat); 
  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
  });
  let history = useHistory();

  useEffect(() => {
    axios
      .get("http://localhost:3001/auth/auth", {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      })
      .then((response) => {
        console.log(response.data)
        if (response.data.error) {
          if(response.data.error=='jwt expired'){
            localStorage.removeItem("accessToken");
            setAuthState({ ...authState, status: false });
            console.log(localStorage.getItem("accessToken"))
            window.location.replace("/");
            //history.push("/login");
          }
          localStorage.removeItem("accessToken");
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
                  <Link to="/createteam"> Create A Team</Link>
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
            <AuthRoute path="/registration" exact component={RegistrationWithRouter} />
            <AuthRoute path="/login" exact component={LoginWithRouter} />
            <Route path="/" exact component={Home} />
            <PrivateRoute path="/chat" exact component={ChatWithRouter} />
            <PrivateRoute path="/teams" exact component={TeamsWithRouter} />
            <Route path="/team/:id" exact component={CurrentTeam} />
            <Route path="/player/:id" exact component={CurrentPlayer} />
            <Route path="/createpost" exact component={CreatePost} />
            <Route path="/createteam" exact component={CreateTeam} />
            <Route path="/creatematch" exact component={CreateMatch} />
            <Route path="/updatematch" exact component={UpdateMatch} />
            <Route path="/post/:id" exact component={Post} />
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
