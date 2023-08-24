import React from "react";
import { useSelector } from "react-redux";

function HomePage() {
  const user = useSelector((state) => state.session.user.user);
  return (
    <div className="text-slate-950">
      <h1>
        Hello {user.firstName} {user.lastName}
      </h1>
    </div>
  );
}

export default HomePage;
