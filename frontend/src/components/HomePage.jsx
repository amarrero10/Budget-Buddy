import React from "react";
import { useSelector } from "react-redux";

function HomePage() {
  const user = useSelector((state) => state.session.user.user);
  return (
    <>
      <div className="text-slate-950">
        <h1 className="text-2xl">Howdy, {user.username}!</h1>
        <p>What would you like to do?</p>
      </div>
      <div className="w-screen grid sm:grid-cols-2 bg-sapphire justify-center">
        <div className="bg-crimson w-[300px] h-[300px] flex justify-center m-4 mx-auto">Card 1</div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto">Card 2</div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto">Card 3</div>
        <div className="bg-crimson w-[300px] h-[300px] m-4 mx-auto">Card 4</div>
      </div>
    </>
  );
}

export default HomePage;
