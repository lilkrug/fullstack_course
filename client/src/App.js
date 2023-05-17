import "./App.css";
import Swal from "sweetalert2";
import { BrowserRouter as Router, withRouter, Redirect, useHistory, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import AddCity from "./pages/AddCity";
import AddHotel from "./pages/AddHotel";
import UsersTable from "./pages/UsersTable";
import Post from "./pages/Post";
import Registration from "./pages/Registration";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import PageForAdmin from "./pages/PageForAdmin";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";

import { AuthContext } from "./helpers/AuthContext";
import { useState, useEffect } from "react";
import axios from "axios";
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
  const HomeWithRouter = withRouter(Home);
  const CreatePostWithRouter = withRouter(CreatePost);
  const AddCityWithRouter = withRouter(AddCity);
  const AddHotelWithRouter = withRouter(AddHotel);
  const UsersTableWithRouter = withRouter(UsersTable);
  const PostWithRouter = withRouter(Post);
  const ProfileWithRouter = withRouter(Profile);
  const ChangePasswordWithRouter = withRouter(ChangePassword);

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
          localStorage.removeItem("accessToken");
          setAuthState({ ...authState, status: false });
  
          if (response.data.error == 'jwt expired') {
            Swal.fire({
              icon: 'warning',
              title: 'Session expired!',
              text: 'Please log in again',
            }).then(() => {
              window.location.replace("/login");
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: response.data.error,
            });
          }
        } else {
          setAuthState({
            username: response.data.username,
            id: response.data.id,
            status: true,
            isAdmin: response.data.isAdmin
          });
        }
      }).catch((error) => {
        localStorage.removeItem("accessToken");
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: error.message,
        });
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
                      <Link to="/userstable"> Users table</Link>
                      <Link to="/addcity"> Add a Tour City</Link>
                      <Link to="/addhotel"> Add a Hotel</Link>
                    </>
                  )}
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
            <PrivateRoute path="/createpost" exact component={CreatePostWithRouter} />
            <AdminRoute path="/userstable" exact component={UsersTableWithRouter} />
            <AdminRoute path="/addcity" exact component={AddCityWithRouter} />
            <AdminRoute path="/addhotel" exact component={AddHotelWithRouter} />
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