import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { FaCheck } from "react-icons/fa";
import * as sessionActions from "../store/session";
import { useDispatch, useSelector } from "react-redux";

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
          <p className=" text-justify">
            Budget Buddy is your all-in-one financial management platform designed to help you take
            control of your finances and achieve your financial goals. With Budget Buddy, you can
            effortlessly manage your income, expenses, bills, and savings goals, all in one place.
          </p>
          <p className="my-2">Here's how Budget Buddy can help you:</p>
          <ul>
            <div className=" flex items-start">
              <FaCheck className="h-6 w-6 mr-1" />
              <li>
                Track Your Expenses: Record your daily expenses and categorize them to gain insights
                into your spending habits.
              </li>
            </div>
            <div className=" flex items-start">
              <FaCheck className="h-6 w-6 mr-1" />
              <li>
                Manage Bills: Stay on top of your bills with reminders for due dates and easy access
                to payment links.
              </li>
            </div>
            <div className=" flex items-start">
              <FaCheck className="h-6 w-6 mr-1" />
              <li>
                Create Budgets: Set up budgets for different categories to ensure you're staying
                within your financial limits.
              </li>
            </div>
            <div className=" flex items-start">
              <FaCheck className="h-6 w-6 mr-1" />
              <li>
                Savings Goals: Plan for the future by setting savings goals and tracking your
                progress towards achieving them.
              </li>
            </div>
          </ul>

          <p className="mt-4 text-center">
            Sign up now and start managing your finances like a pro!
          </p>
        </div>
        <div className="w-1/2 h-2/3 shadow-2xl rounded-tr-lg rounded-br-lg flex flex-col justify-center items-center">
          <form className="flex flex-col justify-between h-2/3 w-11/12 -mt-10" onSubmit={signup}>
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
              className="p-2 rounded-sm mt-3 bg-crimson hover:bg-sapphire hover:text-offwhite"
              type="submit"
            >
              Sign Up!
            </button>
          </form>
          <p className="mt-24">
            Already Have an account? Log in{" "}
            <Link to="/" className=" underline">
              Here
            </Link>
            !
          </p>
        </div>
      </div>

      {/* MOBIL ONLY */}
      <div className="sm:hidden">
        <h1>Welcome to Budget Buddy!</h1>
        <p>
          Budget Buddy helps you manage your money on the go. Track expenses, pay bills, and reach
          your financial goals—all in one app.
        </p>

        <p>Features:</p>

        <ul>
          <li>Expense Tracking</li>
          <li>Bill Management</li>
          <li>Budgets</li>
          <li>Visualize Finances</li>
          <li>Savings Goals</li>
        </ul>

        <p>Sign up now and take control of your finances, anytime, anywhere!</p>
      </div>
    </>
  );
}

export default SignUpPage;
