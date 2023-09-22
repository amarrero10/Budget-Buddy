import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as budgetActions from "../store/budgets";
import { BsLink, BsPencilSquare, BsTrash3 } from "react-icons/bs";

function BudgetDetail() {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budgets.budget);
  const { id } = useParams();

  useEffect(() => {
    dispatch(budgetActions.fetchBudget(id));
  }, [dispatch, id]);

  let billTotal = 0;
  let paidBills = [];

  for (let i = 0; i < budget?.Bills?.length; i++) {
    const bill = budget.Bills[i];
    if (bill.paid) {
      billTotal += bill.billAmount;
      paidBills.push(bill);
    }
  }

  return (
    <>
      <table className="custom-table">
        <thead>
          <tr>
            <th className="table-header">Paid</th>
            <th className="table-header">Name</th>
            <th className="table-header">Amount</th>
            <th className="table-header">Due Date</th>
            <th className="table-header">Edit</th>
            <th className="table-header">Delete</th>
            <th className="table-header">Payment Link</th>
          </tr>
        </thead>
        <tbody>
          {paidBills?.map((bill, index) => (
            <tr key={bill.id} className={bill.paid ? "paid" : ""}>
              <td>
                <div className="bill-paid">
                  <button className={`check-button ${bill.paid ? "checked" : ""}`}>
                    &#10003; {/* Checkmark symbol */}
                  </button>
                </div>
              </td>
              <td>{bill?.billName}</td>
              <td>{bill?.billAmount}</td>
              <td>{bill?.dueDate ? bill.dueDate : ""} </td>

              <td className="edit">
                <BsPencilSquare className="bill-icon" />
              </td>
              <td className="delete">
                <BsTrash3 className="bill-delete" />
              </td>
              <td className="edit">
                <a href={bill.paymentLink} target="_blank" rel="noreferrer">
                  <BsLink className="bill-icon" />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

export default BudgetDetail;
