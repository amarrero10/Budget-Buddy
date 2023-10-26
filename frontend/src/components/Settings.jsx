import React from "react";
import Menu from "./Menu";
import { useSelector } from "react-redux";

function Settings() {
  const user = useSelector((state) => state.session.user);

  console.log("User", user);

  return (
    <div className="savings-page">
      <Menu />
      <p>Coming Soon</p>
    </div>
  );
}

export default Settings;
