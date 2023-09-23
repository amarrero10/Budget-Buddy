import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as budgetActions from "../store/budgets";
import { BsLink, BsPencilSquare, BsTrash3 } from "react-icons/bs";
import Menu from "./Menu";

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

  console.log(paidBills);

  return (
    <>
      <div>
        <div>
          <Menu />
        </div>
        <table className="custom-table">
          <thead>
            <tr>
              <th className="table-header">Name</th>
              <th className="table-header">Amount</th>
              <th className="table-header">Date Paid:</th>
            </tr>
          </thead>
          <tbody>
            {paidBills?.map((bill) => (
              <tr key={bill.id}>
                <td>{bill?.billName}</td>
                <td>{bill?.billAmount}</td>
                <td>{bill?.datePaid ? bill?.datePaid : bill?.dueDate} </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default BudgetDetail;
