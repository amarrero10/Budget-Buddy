import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import * as budgetActions from "../store/budgets";

function BudgetDetail() {
  const dispatch = useDispatch();
  const budget = useSelector((state) => state.budgets.budget);
  const { id } = useParams();

  useEffect(() => {
    dispatch(budgetActions.fetchBudget(id));
  }, [dispatch, id]);

  console.log("SINGLE BUDGET", budget);
  return <div>{budget.budgetName}</div>;
}

export default BudgetDetail;
