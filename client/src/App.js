import "./App.css";
import Swal from "sweetalert2";
import { BrowserRouter as Router, withRouter, Redirect, useHistory, Route, Switch, Link } from "react-router-dom";
import Home from "./pages/Home";
// import AddCity from "./pages/AddCity";
import AddTour from "./pages/AddTour";
import AddHotel from "./pages/AddHotel";
// import CitiesTable from "./pages/CitiesTable";
import ToursTable from "./pages/ToursTable";
import Tours from "./pages/Tours";
import Hotels from "./pages/Hotels";
import BookingsTable from "./pages/BookingsTable";
import AddBooking from "./pages/AddBooking";
import UsersTable from "./pages/UsersTable";
import HotelsTable from "./pages/HotelsTable";
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
  const AddHotelWithRouter = withRouter(AddHotel);
  const AddBookingWithRouter = withRouter(AddBooking);
  const AddTourWithRouter = withRouter(AddTour);
  const UsersTableWithRouter = withRouter(UsersTable);
  const BookingsTableWithRouter = withRouter(BookingsTable);
  const ToursTableWithRouter = withRouter(ToursTable);
  const HotelsTableWithRouter = withRouter(HotelsTable);
  const ToursWithRouter = withRouter(Tours);
  const HotelsWithRouter = withRouter(Hotels);
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
      .get("https://course-project-75u9.onrender.com/auth/auth", {
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
              title: 'Сессия истекла!',
              text: 'Пожалуйста, войдите снова',
            }).then(() => {
              window.location.replace("/login");
            });
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Упс',
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
          title: 'Упс',
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
                  <Link to="/login"> Авторизация </Link>
                  <Link to="/registration"> Регистрация </Link>
                </>
              ) : (
                <>
                  <Link to="/"> Домашняя страница </Link>
                  <Link to="/addbooking"> Добавить бронирование</Link>
                  <Link to="/tours"> Все туры</Link>
                  <Link to="/hotels"> Все отели</Link>
                  <Link to="/chat"> Общий чат для выявления проблем</Link>
                  {authState.isAdmin && (
                    <>
                      <Link to="/userstable"> Таблица пользователей </Link>
                      <Link to="/hotelstable"> Таблица отелей</Link>
                      <Link to="/bookingstable"> Таблица заказов</Link>
                      <Link to="/tourstable">   Таблица туров </Link>
                      <Link to="/addhotel"> Добавить отель</Link>
                      <Link to="/addbooking"> Добавить бронирование</Link>
                      <Link to="/addtour"> Добавить тур</Link>
                    </>
                  )}
                </>
              )}
            </div>
            <div className="loggedInContainer">
              <h1><Link to={"/profile/" + authState.id}>{authState.username}</Link></h1>
              {authState.status && <button onClick={logout}> Выйти </button>}
            </div>
          </div>
          <Switch>
            <AuthRoute path="/registration" exact component={RegistrationWithRouter} />
            <AuthRoute path="/login" exact component={LoginWithRouter} />
            <PrivateRoute path="/" exact component={HomeWithRouter} />
            <PrivateRoute path="/chat" exact component={ChatWithRouter} />
            <PrivateRoute path="/addbooking" exact component={AddBookingWithRouter} />
            <PrivateRoute path="/tours" exact component={ToursWithRouter} />
            <PrivateRoute path="/hotels" exact component={HotelsWithRouter} />
            <AdminRoute path="/userstable" exact component={UsersTableWithRouter} />
            <AdminRoute path="/hotelstable" exact component={HotelsTableWithRouter} />
            <AdminRoute path="/tourstable" exact component={ToursTableWithRouter} />
            <AdminRoute path="/bookingstable" exact component={BookingsTableWithRouter} />
            {/* <AdminRoute path="/addcity" exact component={AddCityWithRouter} /> */}
            <AdminRoute path="/addhotel" exact component={AddHotelWithRouter} />
            {/* <AdminRoute path="/citiestable" exact component={CitiesTableWithRouter} /> */}
            <AdminRoute path="/addtour" exact component={AddTourWithRouter} />
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