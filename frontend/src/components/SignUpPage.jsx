import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function SignUpPage() {
  return (
    <div className=" mt-7">
      <h1 className=" text-center text-3xl">Welcome to Budget Buddy!</h1>
      <p className=" text-center text-xl">Please sign in</p>
      <form className=" w-10/12 max-h-96  shadow-xl flex flex-col mx-auto my-4">
        <div className=" flex flex-col mb-3">
          <label htmlFor="credential">Username or Email</label>
          <input
            type="text"
            id="credential"
            required
            className="border border-blue-600 rounded-md"
          ></input>
        </div>
        <div className=" flex flex-col mb-3">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            required
            id="password"
            className=" border border-blue-600 rounded-md "
          ></input>
        </div>
        <div className="mx-auto w-1/2">
          <button className=" border border-blue-600 rounded-md w-full">Log in</button>
        </div>
      </form>
      <p className="text-center mt-5 text-xl">
        Have an account? Login{" "}
        <Link to="/login" className="text-blue-600 underline ">
          Here
        </Link>
        !
      </p>
    </div>
  );
}

export default SignUpPage;
