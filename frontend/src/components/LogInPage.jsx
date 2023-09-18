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
      await dispatch(billsActions.fetchBills());
    } catch (res) {
      const data = await res.json();
      if (data && data.errors) {
        setErrors(data.errors);
      }
    }
  };
  return (
    <>
      <div className=" mt-7">
        <h1 className=" text-center text-3xl text-sapphire font-bold">Welcome to Budget Buddy!</h1>
        <p className=" text-center text-xl text-sapphire">Please sign in</p>
        <div className=" h-[300px]">
          <form
            className=" w-10/12 h-full shadow-xl flex flex-col mx-auto my-4 py-4 rounded-xl bg-sapphire text-offwhite sm:w-1/2"
            onSubmit={handleSubmit}
          >
            <div className=" flex flex-col mb-3 px-3">
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
            <div className=" flex flex-col mb-3 px-3">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" border border-crimson rounded-md bg-offwhite p-1 mt-1 text-sapphire"
              />
            </div>
            <div className="mx-auto w-2/3 mt-10">
              <m.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                className=" bg-crimson rounded-md w-full p-3 text-lg"
                type="submit"
              >
                Log in
              </m.button>
            </div>
          </form>
        </div>
        <p className="text-center mt-5 text-xl">
          Don't have an account? Sign Up{" "}
          <Link to="/signup" className="text-sapphire underline ">
            Here
          </Link>
          !
        </p>
        <>{errors.credential && <p>{errors.credential}, please try again</p>}</>
      </div>
    </>
  );
}

export default LogInPage;
