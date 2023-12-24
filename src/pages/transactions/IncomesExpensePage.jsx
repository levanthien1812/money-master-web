import React, { useEffect, useState } from "react";
import TransactionsService from "../../services/transactions";
import ReportsService from "../../services/reports";
import AddTransaction from "./components/AddTransaction";
import Report from "./components/Report";
import RecentTransactions from "./components/RecentTransactions";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SelectWallet from "../wallets/components/SelectWallet";
import { useSelector } from "react-redux";
import { CATEGORY_TYPES } from "../../config/constants";
import logo from "../../assets/images/logo-money-master.png";

function IncomesExpensePage() {
  const [transactions, setTransactions] = useState(null);
  const [report, setReport] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [search, setSearch] = useState("");
  const [isAddingTx, setIsAddingTx] = useState(false);
  const [typeAddTx, setTypeAddTx] = useState("expense");
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [loadingReport, setLoadingReport] = useState(false);
  const [day, setDay] = useState(null);

  const walletChosen = useSelector((state) => state.wallet.walletChosen);

  const increaseMonth = () => {
    if (year >= new Date().getFullYear() && month > new Date().getMonth()) {
      return;
    }

    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const decreaseMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleSearchChange = (event) => {
    setTimeout(() => setSearch(event.target.value), 300);
  };

  const handleDateChange = (_day) => {
    setDay(_day);
  };

  const getTransactions = async () => {
    try {
      let params = {
        month,
        year,
        wallet: walletChosen?.id,
      };

      if (day) {
        params = { ...params, day };
      }

      if (search.length > 0) {
        params = { ...params, search };
      }

      setLoadingTransactions(true);

      const responseData = await TransactionsService.getTransactions(params);
      setTransactions(responseData.data.transactions);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingTransactions(false);
  };

  const getReport = async () => {
    try {
      setLoadingReport(true);
      const responseData = await ReportsService.getReports({
        year,
        wallet: walletChosen?.id,
      });
      setReport(responseData.data.reports[month + ""]);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingReport(false);
  };

  const handleClickAddTx = (type) => {
    setIsAddingTx(true);
    setTypeAddTx(type);
  };

  const handleModifySuccess = (action) => {
    getTransactions();
    getReport();

    toast.success("Transaction is " + action + "d successfully", {
      position: toast.POSITION.TOP_CENTER,
      autoClose: 4000,
    });
  };

  useEffect(() => {
    setLoadingReport(true);
    if (walletChosen) getReport();
  }, [month, year, walletChosen]);

  useEffect(() => {
    setLoadingTransactions(true);
    if (walletChosen) getTransactions();
  }, [month, year, walletChosen, search, day]);

  return (
    <div className="lg:p-8 sm:p-14 p-2 max-h-screen">
      <div className="mb-4 flex justify-between items-center flex-col lg:flex-row gap-4">
        <div className="flex gap-4 items-center justify-between lg:justify-start lg:w-3/5 w-full">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">Transactions</h2>
          <div className="w-40">
            <SelectWallet />
          </div>
        </div>
        <div
          className="flex border-2 border-purple-500 rounded-2xl relative 2xl:w-1/4 lg:w-2/5 md:w-1/2 w-4/5"
          id="add-transactions-container"
        >
          <button
            className="py-2 xl:px-8 px-4 rounded-s-xl font-semibold text-purple-600 w-1/2 hover:bg-purple-100"
            id="add-income-btn"
            onClick={() => handleClickAddTx(CATEGORY_TYPES.INCOMES)}
          >
            Add income
          </button>
          <button
            className="py-2 xl:px-8 px-4 text-center rounded-e-xl font-semibold bg-purple-500 text-white hover:bg-purple-600 w-1/2"
            id="add-expense-btn"
            onClick={() => handleClickAddTx(CATEGORY_TYPES.EXPENSES)}
          >
            Add expense
          </button>
        </div>
      </div>

      <div className="flex gap-8 flex-col lg:flex-row">
        <Report
          month={month}
          year={year}
          increaseMonth={increaseMonth}
          decreaseMonth={decreaseMonth}
          loading={loadingReport}
          report={report}
        />

        <RecentTransactions
          transactions={transactions}
          onModifySuccess={handleModifySuccess}
          onSearch={handleSearchChange}
          loading={loadingTransactions}
          onDateChange={handleDateChange}
          month={month}
          year={year}
        />
      </div>

      {isAddingTx && (
        <AddTransaction
          isAdding={isAddingTx}
          setIsAdding={setIsAddingTx}
          type={typeAddTx}
          onAddingSuccess={handleModifySuccess}
          month={month}
          year={year}
        />
      )}
    </div>
  );
}

export default IncomesExpensePage;
