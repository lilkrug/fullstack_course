import "./App.css";
import Swal from "sweetalert2";
import { BrowserRouter as Router, withRouter, Redirect, useHistory, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import CreateMatch from "./pages/CreateMatch";
import CreateTeam from "./pages/CreateTeam";
import CreatePlayer from "./pages/CreatePlayer";
import DropdownMenu from "./pages/DropdownMenu";
import UpdatePlayer from "./pages/UpdatePlayer";
import MatchPage from "./pages/MatchPage";
import Matches from "./pages/Matches";
import UpdateMatch from "./pages/UpdateMatch";
import TeamsTable from "./pages/TeamsTable";
import PlayersTable from "./pages/PlayersTable";
import MatchesTable from "./pages/MatchesTable";
import UsersTable from "./pages/UsersTable";
import ResultsTable from "./pages/ResultsTable";
import FavoriteTeamNews from "./pages/FavoriteTeamNews";
import MyLeague from "./pages/MyLeague";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import CurrentTeam from "./pages/CurrentTeam";
import CurrentMatch from "./pages/CurrentMatch";
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
import Players from "./pages/Players";
import Chat from "./pages/Chat";

function App() {
  let isAuthenticated = localStorage.getItem("accessToken") != null
  const AuthRoute = ({ component: Component, ...rest }) => {
    isAuthenticated = localStorage.getItem("accessToken") != null
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
    isAuthenticated = localStorage.getItem("accessToken") != null
    console.log('statea auth')
    console.log(isAuthenticated)
    if (!isAuthenticated) {
      setAuthState({ ...authState, status: false });
    }

    return (
      <Route
        {...rest}
        render={(props) =>
          isAuthenticated ? <Component {...props} /> : <Redirect to="/login" />
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
  const MatchesWithRouter = withRouter(Matches);
  const TeamsWithRouter = withRouter(Teams);
  const PlayersWithRouter = withRouter(Players);
  const HomeWithRouter = withRouter(Home);
  const CurrentTeamWithRouter = withRouter(CurrentTeam);
  const CurrentPlayerWithRouter = withRouter(CurrentPlayer);
  const CurrentMatchWithRouter = withRouter(CurrentMatch);
  const CreatePostWithRouter = withRouter(CreatePost);
  const CreatePlayerWithRouter = withRouter(CreatePlayer);
  const UpdatePlayerWithRouter = withRouter(UpdatePlayer);
  const CreateTeamWithRouter = withRouter(CreateTeam);
  const UsersTableWithRouter = withRouter(UsersTable);
  const UpdateMatchWithRouter = withRouter(UpdateMatch);
  const PlayersTableWithRouter = withRouter(PlayersTable);
  const MatchesTableWithRouter = withRouter(MatchesTable);
  const FavoriteTeamNewsWithRouter = withRouter(FavoriteTeamNews);
  const MatchPageWithRouter = withRouter(MatchPage);
  const CreateMatchWithRouter = withRouter(CreateMatch);
  const TeamsTableWithRouter = withRouter(TeamsTable);
  const ResultsTableWithRouter = withRouter(ResultsTable);
  const PostWithRouter = withRouter(Post);
  const ProfileWithRouter = withRouter(Profile);
  const ChangePasswordWithRouter = withRouter(ChangePassword);
  const MyLeagueWithRouter = withRouter(MyLeague);

  const [authState, setAuthState] = useState({
    username: "",
    id: 0,
    status: false,
    isAdmin: localStorage.getItem("isAdmin")
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
          if (response.data.error == 'jwt expired') {
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
                      <Link to="/createplayer"> Create A Player</Link>
                      <Link to="/updateplayer"> Update A Player</Link>
                      <Link to="/updatematch"> Update A Match</Link>
                      <Link to="/resultstable"> Results table</Link>
                      <Link to="/playerstable"> Players table</Link>
                      <Link to="/matchestable"> Matches table</Link>
                      <Link to="/teamstable"> Teams table</Link>
                      <Link to="/userstable"> Users table</Link>
                    </>
                  )}
                  <Link to="/players"> Players</Link>
                  <Link to="/matches"> Matches</Link>
                  <Link to="/teams"> Teams</Link>
                  <Link to="/league"> League table</Link>
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1><Link to={"/profile/" + authState.id}>{authState.username}</Link></h1>
              {authState.status && <button onClick={logout}> Logout</button>}
            </div>
          </div>
          <Switch>
            <AuthRoute path="/registration" exact component={RegistrationWithRouter} />
            <AuthRoute path="/login" exact component={LoginWithRouter} />
            <PrivateRoute path="/" exact component={HomeWithRouter} />
            <PrivateRoute path="/chat" exact component={ChatWithRouter} />
            <PrivateRoute path="/teams" exact component={TeamsWithRouter} />
            <PrivateRoute path="/players" exact component={PlayersWithRouter} />
            <PrivateRoute path="/league" exact component={MyLeagueWithRouter} />
            <PrivateRoute path="/matches" exact component={MatchesWithRouter} />
            <PrivateRoute path="/postsByTeam/:id" exact component={FavoriteTeamNewsWithRouter} />
            <PrivateRoute path="/team/:id" exact component={CurrentTeamWithRouter} />
            <PrivateRoute path="/match/:id" exact component={MatchPageWithRouter} />
            <PrivateRoute path="/matchinfo/:id" exact component={CurrentMatchWithRouter} />
            <PrivateRoute path="/player/:id" exact component={CurrentPlayerWithRouter} />
            <PrivateRoute path="/createpost" exact component={CreatePostWithRouter} />
            <AdminRoute path="/createplayer" exact component={CreatePlayerWithRouter} />
            <AdminRoute path="/createteam" exact component={CreateTeamWithRouter} />
            <AdminRoute path="/creatematch" exact component={CreateMatchWithRouter} />
            <AdminRoute path="/updatematch" exact component={UpdateMatchWithRouter} />
            <AdminRoute path="/teamstable" exact component={TeamsTableWithRouter} />
            <AdminRoute path="/playerstable" exact component={PlayersTableWithRouter} />
            <AdminRoute path="/matchestable" exact component={MatchesTableWithRouter} />
            <AdminRoute path="/userstable" exact component={UsersTableWithRouter} />
            <AdminRoute path="/resultstable" exact component={ResultsTableWithRouter} />
            <AdminRoute path="/updateplayer" exact component={UpdatePlayerWithRouter} />
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