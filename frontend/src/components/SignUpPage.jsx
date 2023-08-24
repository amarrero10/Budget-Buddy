import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaCheck } from "react-icons/fa";
import * as sessionActions from "../store/session";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/logo.png";

function SignUpPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionUser = useSelector((state) => state.session.user);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (sessionUser) return <Redirect to="/home" />;

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

      history.push("/home");
    } catch (err) {
      const data = await err.json();
      if (data && data.errors) {
        console.log(data);
      }
    }
  };

  return (
    <>
      {/* Computer Displays */}
      <div className="hidden sm:flex items-center justify-center h-screen w-2/3 mx-auto ">
        <div className=" w-1/2 bg-sapphire p-6  text-offwhite rounded-tl-lg rounded-bl-lg shadow-2xl h-2/3">
          <h1 className="text-2xl font-bold mb-4 text-center">Welcome to Budget Buddy!</h1>
          <img
            src={logo}
            alt="logo for the website budget buddy"
            className=" h-36 mx-auto rounded-full mb-4"
          ></img>

          <p className=" text-justify leading-loose">
            Budget Buddy is your all-in-one financial management platform designed to help you take
            control of your finances and achieve your financial goals. With Budget Buddy, you can
            effortlessly manage your income, expenses, bills, and savings goals, all in one place.
          </p>
          <p className="mt-4 text-center tracking-wide">
            Sign up now and start managing your finances like a pro!
          </p>
          <p className="text-center mt-4">
            Already Have an account? Log in{" "}
            <Link to="/" className=" underline">
              Here
            </Link>
            !
          </p>
        </div>
        <div className="w-1/2 h-2/3 shadow-2xl rounded-tr-lg rounded-br-lg flex flex-col justify-center items-center">
          <form className="flex flex-col justify-between h-2/3 w-11/12 -mt-44" onSubmit={signup}>
            <div className="flex flex-col">
              <label className=" text-xl" htmlFor="firstName">
                First Name
              </label>
              <input
                className="border border-crimson p-3 rounded-sm my-2"
                id="firstName"
                name="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="John"
                required
                type="text"
              ></input>
            </div>
            <div className="flex flex-col ">
              <label className=" text-xl" htmlFor="lastName">
                Last Name
              </label>
              <input
                className="border border-crimson p-3 rounded-sm my-2"
                id="lastName"
                name="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                required
                type="text"
              ></input>
            </div>
            <div className="flex flex-col ">
              <label className=" text-xl" htmlFor="username">
                User Name
              </label>
              <input
                className="border border-crimson p-3 rounded-sm my-2"
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
              <label className=" text-xl" htmlFor="email">
                Email
              </label>
              <input
                className="border border-crimson p-3 rounded-sm my-2"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="johndoe@gmail.com"
                required
                type="email"
              ></input>
            </div>
            <div className="flex flex-col ">
              <label htmlFor="password" className="text-xl">
                Password
              </label>
              <input
                className="border border-crimson p-3 rounded-sm my-2"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                type="password"
              ></input>
            </div>
            <button
              className="p-2 rounded-sm mt-3 bg-crimson hover:bg-sapphire hover:text-offwhite "
              type="submit"
            >
              Sign Up!
            </button>
          </form>
        </div>
      </div>
      {/* End Desktop */}

      {/* MOBIL ONLY */}
      <div className="sm:hidden">
        <img src={logo} alt="logo for the website budget buddy" className=" max-h-60 mx-auto"></img>
        <h1 className="text-center text-2xl mb-5">Welcome to Budget Buddy!</h1>
        <p className="text-justify px-2">
          Budget Buddy helps you manage your money on the go. Track expenses, pay bills, and reach
          your financial goals—all in one app.
        </p>

        <p className="pl-2">Features:</p>

        <ul className="pl-2">
          <div className=" flex items-start">
            <FaCheck className="h-4 w-4 mr-1" />
            <li>Expense Tracking</li>
          </div>
          <div className=" flex items-start">
            <FaCheck className="h-4 w-4 mr-1" />
            <li>Bill Management</li>
          </div>
          <div className=" flex items-start">
            <FaCheck className="h-4 w-4 mr-1" />
            <li>Budgets</li>
          </div>
          <div className=" flex items-start">
            <FaCheck className="h-4 w-4 mr-1" />
            <li>Savings Goals</li>
          </div>
        </ul>

        <p className=" text-center px-2 mt-3">
          Sign up now and take control of your finances, anytime, anywhere!
        </p>
      </div>
      <div className=" w-9/12 h-2/3 border border-crimson flex flex-col justify-center items-center mx-auto rounded-md mt-2 mb-2 sm:hidden">
        <form className="flex flex-col justify-between h-2/3 w-11/12 mt-5" onSubmit={signup}>
          <div className="flex flex-col">
            <label className=" text-xl" htmlFor="mobil-firstName">
              First Name
            </label>
            <input
              className="border border-crimson p-3 rounded-sm my-2"
              id="mobil-firstName"
              name="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              required
              type="text"
            ></input>
          </div>
          <div className="flex flex-col ">
            <label className=" text-xl" htmlFor="mobil-lastName">
              Last Name
            </label>
            <input
              className="border border-crimson p-3 rounded-sm my-2"
              id="mobil-lastName"
              name="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              required
              type="text"
            ></input>
          </div>
          <div className="flex flex-col ">
            <label className=" text-xl" htmlFor="mobil-username">
              User Name
            </label>
            <input
              className="border border-crimson p-3 rounded-sm my-2"
              id="mobil-username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john-doe"
              required
              type="text"
            ></input>
          </div>
          <div className="flex flex-col">
            <label className=" text-xl" htmlFor="mobil-email">
              Email
            </label>
            <input
              className="border border-crimson p-3 rounded-sm my-2"
              id="mobil-email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="johndoe@gmail.com"
              required
              type="email"
            ></input>
          </div>
          <div className="flex flex-col ">
            <label htmlFor="mobil-password" className="text-xl">
              Password
            </label>
            <input
              className="border border-crimson p-3 rounded-sm my-2"
              id="mobil-password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••"
              required
              type="password"
            ></input>
          </div>
          <button
            className="p-2 rounded-sm mt-3 bg-crimson hover:bg-sapphire hover:text-offwhite"
            type="submit"
          >
            Sign Up!
          </button>
        </form>
        <p className="my-2">
          Already Have an account? Log in{" "}
          <Link to="/" className=" underline">
            Here
          </Link>
          !
        </p>
      </div>
      {/* End MOBIL ONLY */}
    </>
  );
}

export default SignUpPage;
