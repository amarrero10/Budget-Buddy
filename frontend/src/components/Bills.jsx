import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as billsActions from "../store/bills";

function Bills() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.session.user.user);
  const bills = useSelector((state) => state.bills.bills);
  const handleDelete = () => {
    console.log("clicked");
  };
  const handleMarkAsPaid = (billId, newPaidStatus) => {
    dispatch(billsActions.toggleBillPaidStatus(billId, newPaidStatus));
  };

  const handleEdit = () => {
    console.log("clicked");
  };

  useEffect(() => {}, [bills]);

  return (
    <>
      <tbody>
        {bills?.map((bill) => (
          <tr key={bill.id}>
            <td>{bill.billName}</td>
            <td>{bill.billAmount}</td>
            <td>{bill.paid ? "Bill Paid!" : ""}</td>
            <td>
              <button onClick={() => handleDelete(bill.id)}>Delete</button>
              <button onClick={() => handleMarkAsPaid(bill.id, !bill.paid)}>Mark as Paid</button>

              <button onClick={() => handleEdit(bill.id)}>Edit</button>
            </td>
          </tr>
        ))}
      </tbody>
    </>
  );
}

export default Bills;
