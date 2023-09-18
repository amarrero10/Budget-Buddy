import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Redirect } from "react-router-dom/cjs/react-router-dom";
import * as sessionActions from "../store/session";
import * as billsActions from "../store/bills";
import { motion as m } from "framer-motion";

function LogInPage() {
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);

  if (sessionUser) return <Redirect to="/dashboard" />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    try {
      await dispatch(sessionActions.login({ credential, password }));
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };
  return (
    <>
      <div>
        <h1>Welcome to Budget Buddy!</h1>
        <p>Please sign in</p>
        <div>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="credential">Username or Email</label>
              <input
                type="text"
                id="credential"
                name="credential"
                value={credential}
                onChange={(e) => setCredential(e.target.value)}
                required
                className="border border-crimson rounded-md bg-offwhite p-1 mt-1 text-sapphire"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <m.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.1 }} type="submit">
                Log in
              </m.button>
            </div>
          </form>
        </div>
        <p>
          Don't have an account? Sign Up <Link to="/signup">Here</Link>!
        </p>
        <>{errors.credential && <p>{errors.credential}, please try again</p>}</>
      </div>
    </>
  );
}

export default LogInPage;
