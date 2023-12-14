import React, { useEffect, useMemo, useState } from "react";
import UsersServices from "../../services/users";
import usersImg from "../../assets/images/teamwork.png";
import transactionsImg from "../../assets/images/transaction.png";
import categoriesImg from "../../assets/images/categories.png";
import TransactionsService from "../../services/transactions";
import { Line } from "react-chartjs-2";
import ReportsService from "../../services/reports";
import { Chart, registerables } from "chart.js";
import CategoriesService from "../../services/categories";
import { toast } from "react-toastify";
import StatisticItem from "./components/StatisticItem";
import Select from "../../components/elements/Select";

const options = {
  scales: {
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: "Quantity",
      },
    },
    x: {
      title: {
        display: true,
        text: "Month",
      },
    },
  },
  maintainAspectRatio: false,
  cubicInterpolationMode: "monotone",
};

function AdminPage() {
  const [transactionsCounts, setTransactionsCounts] = useState();
  const [usersCounts, setUsersCounts] = useState();
  const [defaultCategoriesCount, setDefaultCategoriesCount] = useState();
  const [userQuantityPerMonth, setUserQuantityPerMonth] = useState([]);
  const [transactionQuantityPerMonth, setTransactionQuantityPerMonth] =
    useState([]);
  const [loadingTransactionCount, setLoadingTransactionCount] = useState(false);
  const [loadingUserCount, setLoadingUserCount] = useState(false);
  const [loadingCategoryCount, setLoadingCategoryCount] = useState(false);
  const [year, setYear] = useState(null);
  const [years, setYears] = useState([]);
  const [loadingYears, setLoadingYears] = useState(false);

  Chart.register(...registerables);
  Chart.defaults.font.family = "Quicksand";
  Chart.defaults.color = "#000000";
  Chart.defaults.font.size = 14;

  const getCounts = async () => {
    setLoadingCategoryCount(true);
    setLoadingTransactionCount(true);
    setLoadingUserCount(true);

    try {
      let responseData = await UsersServices.getCounts();
      setLoadingUserCount(false);

      if (responseData.status === "success") {
        setUsersCounts(responseData.data);
      }

      responseData = await TransactionsService.getCounts();
      setLoadingTransactionCount(false);

      if (responseData.status === "success") {
        setTransactionsCounts(responseData.data);
      }

      responseData = await CategoriesService.getDefaultCount();
      setLoadingCategoryCount(false);

      if (responseData.status === "success") {
        setDefaultCategoriesCount(responseData.data.count);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }

    setLoadingCategoryCount(false);
    setLoadingTransactionCount(false);
    setLoadingUserCount(false);
  };

  const getUserQuantityPerMonth = async () => {
    try {
      const responseData = await ReportsService.getUserQuantityPerMonth({
        year: year?.id,
      });

      if (responseData.status === "success") {
        setUserQuantityPerMonth(responseData.data.quantities);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const getTransactionQuantityPerMonth = async () => {
    try {
      const responseData = await ReportsService.getTransactionQuantityPerMonth({
        year: year?.id,
      });

      if (responseData.status === "success") {
        setTransactionQuantityPerMonth(responseData.data.quantities);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  const getYears = async () => {
    try {
      setLoadingYears(true);
      const responseData = await UsersServices.getYears();

      if (responseData.status === "success") {
        const years = responseData.data.years.map((y) => {
          return { id: y, name: y };
        });

        setYears(years);
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingYears(false);
  };

  const statistics = useMemo(
    () => [
      {
        name: "Users",
        count: usersCounts?.count,
        currentMonthCount: usersCounts?.currentMonthCount,
        color: "text-green-600",
        bgColor: "from-green-400 to-green-200",
        image: usersImg,
        loading: loadingUserCount,
      },
      {
        name: "Transactions",
        count: transactionsCounts?.count,
        currentMonthCount: transactionsCounts?.currentMonthCount,
        color: "text-blue-600",
        bgColor: "from-blue-400 to-blue-200",
        image: transactionsImg,
        loading: loadingTransactionCount,
      },
      {
        name: "Default Categories",
        count: defaultCategoriesCount,
        currentMonthCount: undefined,
        color: "text-orange-600",
        bgColor: "from-orange-400 to-orange-200",
        image: categoriesImg,
        loading: loadingCategoryCount,
      },
    ],
    [
      transactionsCounts,
      usersCounts,
      defaultCategoriesCount,
      loadingCategoryCount,
      loadingTransactionCount,
      loadingUserCount,
    ]
  );

  const userQuantityData = useMemo(() => {
    return {
      labels: Object.keys(userQuantityPerMonth),
      datasets: [
        {
          label: "User quantity",
          data: Object.values(userQuantityPerMonth),
          fill: false,
          borderColor: "#1DA44C",
        },
      ],
    };
  }, [userQuantityPerMonth]);

  const transactionQuantityData = useMemo(() => {
    return {
      labels: Object.keys(transactionQuantityPerMonth),
      datasets: [
        {
          label: "Transaction quantity",
          data: Object.values(transactionQuantityPerMonth),
          fill: false,
          borderColor: "#2463EB",
        },
      ],
    };
  }, [transactionQuantityPerMonth]);

  useEffect(() => {
    getCounts();
    getYears();
  }, []);

  useEffect(() => {
    if (years.length === 0) return;
    const currentYear = years.find((y) => y.id === new Date().getFullYear());

    setYear(currentYear || years[0]);
  }, [years]);

  useEffect(() => {
    if (year) {
      getUserQuantityPerMonth();
      getTransactionQuantityPerMonth();
    }
  }, [year]);

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="flex gap-4 items-center">
        <h2 className="sm:text-4xl text-3xl">Dash board</h2>
      </div>
      <div className="mb-3">
        <div className="mt-8 flex gap-4 md:flex-row flex-col">
          {statistics &&
            statistics.map((statistic) => (
              <StatisticItem statistic={statistic} key={Math.random()} />
            ))}
        </div>
      </div>
      <div>
        <div className="flex justify-end">
          <div className="w-40">
            <Select
              selected={year}
              setSelected={setYear}
              data={years}
              loading={loadingYears}
            />
          </div>
        </div>
        <div className="flex lg:gap-4 gap-8 mt-6 max-w-full lg:flex-row flex-col">
          <div className="lg:w-1/2 w-full h-96 p-4 rounded-2xl bg-white relative shadow-md">
            <Line data={userQuantityData} options={options} />
            <div className="flex justify-center items-center absolute -bottom-5 w-full">
              <p className="italic py-1 px-4 bg-green-500 text-white rounded-xl shadow-sm text-sm uppercase font-bold">
                User quantities per month
              </p>
            </div>
          </div>
          <div className="lg:w-1/2 w-full h-96 p-4 rounded-2xl bg-white relative shadow-md">
            <Line data={transactionQuantityData} options={options} />
            <div className="flex justify-center items-center absolute -bottom-5 w-full">
              <p className="italic py-1 px-4 bg-blue-500 text-white rounded-xl shadow-sm text-sm uppercase font-bold">
                Transaction quantities per month
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
