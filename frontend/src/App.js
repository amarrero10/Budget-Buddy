import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import * as sessionActions from "./store/session";
import LogInPage from "./components/LogInPage";
import Navigation from "./components/Navigation";
import Bills from "./components/Bills";
import Budget from "./components/Budget";
import Settings from "./components/Settings";
import Savings from "./components/Savings";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  useEffect(() => {
    dispatch(sessionActions.restoreUser());
  }, [dispatch]);

  if (sessionUser && window.location.pathname === "/") {
    // Redirect to the "/home" path
    history.push("/home");
  }

  return (
    <>
      {sessionUser && <Navigation />}
      <Switch>
        <Route exact path="/">
          <LogInPage />
        </Route>
        <Route exact path="/signup">
          <SignUpPage />
        </Route>
        <Route exact path="/home">
          {sessionUser ? <HomePage /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/bills">
          {sessionUser ? <Bills /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/budget">
          {sessionUser ? <Budget /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/settings">
          {sessionUser ? <Settings /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/savings">
          {sessionUser ? <Savings /> : <Redirect to="/" />}
        </Route>
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
