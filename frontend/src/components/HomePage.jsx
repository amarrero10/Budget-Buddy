import React from "react";
import { useSelector } from "react-redux";

function HomePage() {
  const user = useSelector((state) => state.session.user.user);
  return (
    <>
      <div className="text-slate-950">
        <h1 className="text-2xl text-center">Howdy, {user.username}!</h1>
        <p className="text-xl text-center">What would you like to do?</p>
      </div>
      <div className="w-screen grid sm:grid-cols-2 bg-sapphire justify-center">
        <div className="bg-crimson w-[300px] h-[300px] flex flex-col justify-center m-4 mx-auto rounded-lg">
          <h2 className="text-2xl text-center">Manage Bills</h2>
          <p className="text-2xl text-center">Your upcoming bills:</p>
          <ul>
            <li>bill one</li>
            <li>bill two</li>
            <li>bill three</li>
            <li>bill four</li>
          </ul>
          <button>Add a bill!</button>
        </div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto rounded-lg">
          <h2> View Budget Details</h2>
          <p>Budget Remaing:</p>
          <button>Edit Budget</button>
        </div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto rounded-lg">
          <h1>Current Savings Goal:</h1>
          <p>Your Progress 🎉:</p>
          <p>Goal: 1</p>
          <p>Goal: 2</p>
          <button>Add a goal</button>
        </div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto rounded-lg">
          <button>View your profile and settings</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;
