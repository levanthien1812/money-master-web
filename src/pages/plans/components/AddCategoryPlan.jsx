import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/modal/Modal";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import Input from "../../../components/elements/Input";
import Select from "../../../components/elements/Select";
import monthsGetter from "../../../utils/monthsGetter";
import yearsGetter from "../../../utils/yearsGetter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "../../../utils/currencyFormatter";
import PlansService from "../../../services/plans";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CATEGORY_TYPES, REPORT_TYPES } from "../../../config/constants";
import { useTranslation } from "react-i18next";
import { GetCategoriesQuery } from "../../../queries/categories";
import {
  GetTotalByMonth,
  GetTotalByMonthCategory,
} from "../../../queries/reports";

function AddCategoryPlan({
  onClose,
  onUpdateSuccess,
  _month,
  _year,
  category = null,
}) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);
  const [categoryChosen, setCategoryChosen] = useState(null);
  const [walletSelected, setWalletSelected] = useState(walletChosen);
  const [amount, setAmount] = useState();
  const [formattedAmount, setFormattedAmount] = useState();
  const [month, setMonth] = useState(
    _month
      ? monthsGetter().find((month) => month.id + 1 === _month)
      : monthsGetter().find((month) => month.id === new Date().getMonth())
  );
  const [year, setYear] = useState(
    _year
      ? { id: _year, name: _year }
      : yearsGetter(20).find((year) => year.id === new Date().getFullYear())
  );
  const [errors, setErrors] = useState(null);
  const [processingSave, setProcessingSave] = useState(false);

  const { t } = useTranslation();

  const { categories, loadingCategories, refetchCategories } =
    GetCategoriesQuery({
      type: CATEGORY_TYPES.EXPENSES,
      ignore_exists: true,
      month: month.id + 1,
      year: year.id,
    });

  const sharedParams = useMemo(() => {
    return {
      year: year.id,
      report_type: REPORT_TYPES.CATEGORY,
      wallet: walletSelected?.id,
    };
  }, [year, walletSelected]);

  const {
    total: lastMonthTotal,
    loadingReports: loadingReportsLastMonth,
    refetchReports: refetchReportsLastMonth,
  } = GetTotalByMonthCategory(
    {
      month: month.id,
      ...sharedParams,
    },
    categoryChosen
  );

  const {
    total: thisMonthTotal,
    loadingReports: loadingReportsThisMonth,
    refetchReports: refetchReportsThisMonth,
  } = GetTotalByMonthCategory(
    {
      month: month.id + 1,
      ...sharedParams,
    },
    categoryChosen
  );

  useEffect(() => {
    if (categories && categories.length > 0) {
      setCategoryChosen(categories[0]);
    }
  }, [categories]);

  const handleAmountChange = (event) => {
    setErrors((prev) => {
      if (prev && prev.amount) delete prev.amount;
      return prev;
    });

    const { value } = event.target;
    const cleanAmount = value.replace(/[^0-9]/g, "");

    if (value.length > 0 && isNaN(parseInt(value)) && parseInt(value) <= 0) {
      setErrors((prev) => {
        return { ...prev, amount: t("error.invalid_amount") };
      });
    } else {
      setFormattedAmount(cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      setAmount(cleanAmount);
    }
  };

  const handleAddPlan = async () => {
    try {
      let haveErrors = false;
      setErrors(null);

      if (!amount || amount === "0") {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, amount: t("error.required_amount") };
        });
      }

      if (!haveErrors) {
        setProcessingSave(true);
        const data = {
          wallet_id: walletSelected.id,
          category_id: categoryChosen.id,
          month: month.id + 1,
          year: year.id,
          amount,
        };

        const responseData = await PlansService.createCategoryPlan(data);

        console.log(responseData);

        if (responseData.status === "success") {
          onClose();
          toast.success(t("toast.create_plan_success"));
          onUpdateSuccess();
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setProcessingSave(false);
  };

  useEffect(() => {
    if (month && year && categoryChosen) {
      refetchReportsLastMonth();
      refetchReportsThisMonth();
    }
  }, [month, year, categoryChosen]);

  useEffect(() => {
    if (month && year) {
      refetchCategories();
    }
  }, [month, year]);

  return (
    <Modal
      onAccept={handleAddPlan}
      onClose={onClose}
      title={t("plan.add_category_plan")}
      width={"lg:w-1/4 sm:w-1/2 w-11/12"}
      processing={processingSave}
    >
      {categoryChosen && (
        <>
          {(loadingReportsLastMonth || loadingReportsThisMonth) && (
            <p className="text-sm text-blue-600 italic">
              {t("info.loading_total_expenses")}
            </p>
          )}
          {!(loadingReportsLastMonth || loadingReportsThisMonth) && (
            <>
              <div className="flex items-center gap-2">
                <FontAwesomeIcon
                  icon={faInfoCircle}
                  className="text-blue-600"
                />
                <p className="text-sm text-blue-600 italic">
                  {t("info.total_expenses_last_month_category")}{" "}
                  <span className="font-bold">
                    {formatCurrency(lastMonthTotal)}
                  </span>
                  , {t("info.current_month")}{" "}
                  <span className="font-bold">
                    {formatCurrency(thisMonthTotal)}
                  </span>
                </p>
              </div>
            </>
          )}
        </>
      )}
      <SelectWithImage
        data={wallets}
        label={t("input.wallet")}
        selected={walletSelected}
        setSelected={setWalletSelected}
        required
      />
      <SelectWithImage
        data={categories}
        label={t("input.category")}
        selected={categoryChosen}
        setSelected={setCategoryChosen}
        required
        loading={loadingCategories}
      />
      <Input
        label={t("input.intended_amount")}
        name={"amount"}
        type={"text"}
        required
        size="small"
        value={formattedAmount}
        onChange={handleAmountChange}
        error={errors && errors.amount}
      />
      <div className="flex gap-2">
        <div className="w-1/2">
          <Select
            label={t("input.month")}
            required
            selected={month}
            setSelected={setMonth}
            data={monthsGetter()}
          />
        </div>
        <div className="w-1/2">
          <Select
            label={t("input.year")}
            required
            selected={year}
            setSelected={setYear}
            data={yearsGetter(20)}
          />
        </div>
      </div>
    </Modal>
  );
}

export default AddCategoryPlan;
