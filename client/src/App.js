import "./App.css";
import { BrowserRouter as Router,withRouter,  Redirect, useHistory, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import CreateMatch from "./pages/CreateMatch";
import CreateTeam from "./pages/CreateTeam";
import MatchPage from "./pages/MatchPage";
import UpdateMatch from "./pages/UpdateMatch";
import MyLeague from "./pages/MyLeague";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import CurrentTeam from "./pages/CurrentTeam";
import CurrentPlayer from "./pages/CurrentPlayer";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PageForAdmin from "./pages/PageForAdmin";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
import Teams from "./pages/Teams";
import Chat from "./pages/Chat";

function App() {
  let isAuthenticated = localStorage.getItem("accessToken")!=null
  const AuthRoute = ({ component: Component, ...rest }) => {
    isAuthenticated = localStorage.getItem("accessToken")!=null
    console.log('isauth')
    console.log(isAuthenticated)
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? <Redirect to="/" /> : <Component {...props} />
        }
      />
    );
  };
  const PrivateRoute = ({ component: Component, ...rest }) => {
    isAuthenticated = localStorage.getItem("accessToken")!=null
    console.log('statea auth')
    console.log(isAuthenticated)
    if(!isAuthenticated){
      setAuthState({ ...authState, status: false });
    }
    
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ?<Component {...props} /> :  <Redirect to="/login" />
        }
      />
    );
  };
  
  const AdminRoute = ({ component: Component, isAdmin, ...rest }) => {
    const isAuthenticated = localStorage.getItem("accessToken") !== null;
    isAdmin = localStorage.getItem("isAdmin")
    console.log(localStorage.getItem("isAdmin"))
    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated && authState.isAdmin ? (
            <Component {...props} />
          ) : (
            <PageForAdmin />
          )
        }
      />
    );
  };
  
  
  const RegistrationWithRouter = withRouter(Registration);
  const LoginWithRouter = withRouter(Login);  
  const ChatWithRouter = withRouter(Chat); 
  const TeamsWithRouter = withRouter(Teams); 
  const HomeWithRouter = withRouter(Home); 
  const CurrentTeamWithRouter = withRouter(CurrentTeam); 
  const CurrentPlayerWithRouter = withRouter(CurrentPlayer); 
  const CreatePostWithRouter = withRouter(CreatePost); 
  const CreateTeamWithRouter = withRouter(CreateTeam); 
  const UpdateMatchWithRouter = withRouter(UpdateMatch);
  const MatchPageWithRouter = withRouter(MatchPage); 
  const CreateMatchWithRouter = withRouter(CreateMatch); 
  const PostWithRouter = withRouter(Post); 
  const ProfileWithRouter = withRouter(Profile); 
  const ChangePasswordWithRouter = withRouter(ChangePassword);
  const MyLeagueWithRouter = withRouter(MyLeague); 

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    isAdmin:localStorage.getItem("isAdmin")
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
          isAuthenticated = false
          if(response.data.error=='jwt expired'){
            localStorage.removeItem("accessToken");
            setAuthState({ ...authState, status: false });
            console.log(localStorage.getItem("accessToken"))
            isAuthenticated = false
            window.location.replace("/login");
          }
          localStorage.removeItem("accessToken");
          setAuthState({ ...authState, status: false });
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            isAdmin: response.data.isAdmin
          });
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("isAdmin");
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
                  {authState.isAdmin && (
                  <>
                    <Link to="/creatematch"> Create A Match</Link>
                    <Link to="/createteam"> Create A Team</Link>
                    <Link to="/updatematch"> Update A Match</Link>
                    </>
                  )}
                  <Link to="/players"> Players</Link>
                  <Link to="/teams"> Teams</Link>
                  <Link to="/league"> League table</Link>
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
            <PrivateRoute path="/" exact component={HomeWithRouter} />
            <PrivateRoute path="/chat" exact component={ChatWithRouter} />
            <PrivateRoute path="/teams" exact component={TeamsWithRouter} />
            <PrivateRoute path="/league" exact component={MyLeagueWithRouter} />
            <PrivateRoute path="/team/:id" exact component={CurrentTeamWithRouter} />
            <PrivateRoute path="/match/:id" exact component={MatchPageWithRouter} />
            <PrivateRoute path="/player/:id" exact component={CurrentPlayerWithRouter} />
            <PrivateRoute path="/createpost" exact component={CreatePostWithRouter} />
            <AdminRoute path="/createteam" exact component={CreateTeamWithRouter} />
            <AdminRoute path="/creatematch" exact component={CreateMatchWithRouter} />
            <AdminRoute path="/updatematch" exact component={UpdateMatchWithRouter} />
            <PrivateRoute path="/post/:id" exact component={PostWithRouter} />
            <PrivateRoute path="/profile/:id" exact component={ProfileWithRouter} />
            <PrivateRoute path="/changepassword" exact component={ChangePasswordWithRouter} />
            <Route path="*" exact component={PageNotFound} />
          </Switch>
        </Router>
      </AuthContext.Provider>
    </div>
  );
}

export default App;
