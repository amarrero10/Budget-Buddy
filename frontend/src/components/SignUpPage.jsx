import React, { useEffect, useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaCheck } from "react-icons/fa";
import * as sessionActions from "../store/session";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";
import { motion } from "framer-motion";

function SignUpPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (sessionUser) return <Redirect to="/dashboard" />;

  const signup = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        sessionActions.signup({
          username,
          firstName,
          lastName,
          email,
          password,
        })
      );

      history.push("/dashboard");
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        console.log(data);
      }
    }
  };

  return (
    <>
      <div>
        <div>
          <form onSubmit={signup}>
            <div>
              <label htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                type="text"
              ></input>
            </div>
            <div>
              <label htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                type="text"
              ></input>
            </div>
            <div>
              <label htmlFor="username">User Name</label>
              <input
                id="username"
                name="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="john-doe"
                required
                type="text"
              ></input>
            </div>
            <div className="flex flex-col">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                type="email"
              ></input>
            </div>
            <div>
              <label htmlFor="password" className="text-xl">
                Password
              </label>
              <input
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                type="password"
              ></input>
            </div>
            <motion.button whileTap={{ scale: 0.9 }} whileHover={{ scale: 1.05 }} type="submit">
              Sign Up!
            </motion.button>

            <p>
              Already Have an account? Log in
              <Link to="/login">Here</Link>!
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

export default SignUpPage;
