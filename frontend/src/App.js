import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Switch, Redirect } from "react-router-dom";
import HomePage from "./components/HomePage";
import SignUpPage from "./components/SignUpPage";
import * as sessionActions from "./store/session";
import LogInPage from "./components/LogInPage";

function App() {
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  useEffect(() => {
    dispatch(sessionActions.restoreUser());
  }, [dispatch]);

  return (
    <>
      <Switch>
        <Route exact path="/">
          <SignUpPage />
        </Route>
        <Route exact path="/login">
          <LogInPage />
        </Route>
        {sessionUser ? (
          <Route exact path="/home">
            <HomePage />
          </Route>
        ) : (
          <Redirect to="/" />
        )}
      </Switch>
    </>
  );
}

export default App;
