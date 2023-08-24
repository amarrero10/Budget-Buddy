import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect, useHistory } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import * as sessionActions from "./store/session";
import LogInPage from "./components/LogInPage";
import Navigation from "./components/Navigation";

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
        <Redirect to="/" />
      </Switch>
    </>
  );
}

export default App;
