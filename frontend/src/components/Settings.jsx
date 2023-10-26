import React from "react";
import Menu from "./Menu";
import { useSelector } from "react-redux";

function Settings() {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="savings-page">
      <Menu />
      <p>
        Welcome, {user.username}! Here you can change your email or password. What would you like to
        do today?
      </p>
    </div>
  );
}

export default Settings;
