import React, { useState } from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function SignUpPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      {/* Computer Displays */}
      <div className="hidden sm:flex items-center justify-center h-screen w-2/3 mx-auto ">
        <div className=" w-1/2 bg-sapphire p-6  text-offwhite rounded-tl-lg rounded-bl-lg shadow-2xl h-2/3">
          <h1 className="text-2xl font-bold mb-4">Welcome to Budget Buddy!</h1>
          <p>
            Budget Buddy is your all-in-one financial management platform designed to help you take
            control of your finances and achieve your financial goals. With Budget Buddy, you can
            effortlessly manage your income, expenses, bills, and savings goals, all in one place.
          </p>
          <p className="mt-4">Here's how Budget Buddy can help you:</p>
          <ul className="list-disc list-inside">
            <li>
              Track Your Expenses: Record your daily expenses and categorize them to gain insights
              into your spending habits.
            </li>
            <li>
              Manage Bills: Stay on top of your bills with reminders for due dates and easy access
              to payment links.
            </li>
            <li>
              Create Budgets: Set up budgets for different categories to ensure you're staying
              within your financial limits.
            </li>
            <li>
              Visualize Your Finances: View interactive charts and graphs to visualize your
              financial data and make informed decisions.
            </li>
            <li>
              Savings Goals: Plan for the future by setting savings goals and tracking your progress
              towards achieving them.
            </li>
          </ul>
          <p className="mt-4">
            Join Budget Buddy today and take the first step towards financial freedom and peace of
            mind.
          </p>
          <p className="mt-4">Sign up now and start managing your finances like a pro!</p>
        </div>
        <div className="w-1/2 h-2/3 shadow-2xl rounded-tr-lg rounded-br-lg flex flex-col justify-center items-center">
          <form className="flex flex-col justify-between h-2/3 w-11/12">
            <div className="flex flex-col">
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
            <div className="flex flex-col ">
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
            <div className="flex flex-col ">
              <label htmlFor="userName">User Name</label>
              <input
                id="userName"
                name="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
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
            <div className="flex flex-col ">
              <label htmlFor="password">Password</label>
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
            <button type="submit">Sign Up!</button>
          </form>
          <p>
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
