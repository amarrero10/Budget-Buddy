import React from "react";

function Bills() {
  return (
    <>
      <div>
        <p>
          On this page, you can effortlessly manage your bills with a range of features, including:
        </p>
        <ul>
          <li>List of Bills:</li>
          <ul>
            <li>Display a list of your bills, complete with names, due dates, and amounts.</li>
            <li>
              Sort and filter your bills based on various criteria, such as due date or bill
              category.
            </li>
          </ul>
          <li>Bill Details:</li>
          <ul>
            <li>
              Click on any bill to access its detailed information, including descriptions, payment
              history, and associated notes.
            </li>
          </ul>
          <li>Add New Bill:</li>
          <ul>
            <li>Easily add new bills using a user-friendly form or button.</li>
            <li>Input essential details like the bill's name, due date, amount, and category.</li>
            <li>Rest assured with input validation to ensure accuracy.</li>
          </ul>
          <li>Edit and Delete Bills:</li>
          <ul>
            <li>Effortlessly manage your existing bills by editing or deleting them as needed.</li>
          </ul>
          <li>Mark as Paid/Unpaid:</li>
          <ul>
            <li>Quickly toggle bills as paid or unpaid with a simple click.</li>
            <li>Keep track of payment history for each bill.</li>
          </ul>
          <li>Bill Categories:</li>
          <ul>
            <li>Organize your bills by creating, editing, and deleting bill categories.</li>
          </ul>
          <li>Search and Filter:</li>
          <ul>
            <li>
              Efficiently locate specific bills using powerful search and filter options, including
              date ranges, categories, or payment status.
            </li>
          </ul>
          <li>Bill Reminders:</li>
          <ul>
            <li>Set up bill reminders and notifications to stay on top of due dates.</li>
            <li>
              Customize reminders' timing and delivery method, be it email, push notifications, or
              others.
            </li>
          </ul>
          <li>Export and Print Bills:</li>
          <ul>
            <li>Export your bill data for record-keeping purposes.</li>
            <li>Generate printable versions of your bills when needed.</li>
          </ul>
        </ul>
        <p>
          And remember, paying bills is like adulting's final boss level - defeat them and you're
          the champion of responsibility! You GOT this!
        </p>
      </div>
    </>
  );
}

export default Bills;
