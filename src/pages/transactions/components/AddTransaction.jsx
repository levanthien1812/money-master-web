import React, { useEffect, useState } from "react";
import ModalWithNothing from "../../../components/modal/ModalWithNothing";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import CategoriesService from "../../../services/categories";
import Input from "../../../components/elements/Input";
import format from "date-fns/format";
import TransactionsService from "../../../services/transactions";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import { toast } from "react-toastify";
import formatCurrency from "../../../utils/currencyFormatter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faWarning } from "@fortawesome/free-solid-svg-icons";
import PlansService from "../../../services/plans";
import { useDispatch, useSelector } from "react-redux";
import { fetchWallets } from "../../../stores/wallets";
import EventsService from "../../../services/events";
import { CATEGORY_TYPES, TRANSACTION_TYPE } from "../../../config/constants";
import { useTranslation } from "react-i18next";

function AddTransaction({
  setIsAdding,
  type,
  transaction = null,
  event = null,
  setIsDeleting,
  onAddingSuccess,
  month = new Date().getMonth(),
  year = new Date().getFullYear(),
}) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);

  const [categories, setCategories] = useState([]);
  const [categorySelected, setCategorySelected] = useState(null);
  const [events, setEvents] = useState([]);
  const [eventSelected, setEventSelected] = useState(null);
  const [walletSelected, setWalletSelected] = useState(walletChosen);
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState();
  const [formattedAmount, setFormattedAmount] = useState("");
  const [photo, setPhoto] = useState(null);
  const [date, setDate] = useState(
    new Date(year, month - 1, new Date().getDate())
  );
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState(null);
  const [planData, setPlanData] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [processingSave, setProcessingSave] = useState(false);
  const [isWarningOverspend, setIsWarningOverspend] = useState(false);
  const [isCloning, setIsCloning] = useState(false);

  const dispatch = useDispatch();
  const { t } = useTranslation();

  useEffect(() => {
    if (
      type === CATEGORY_TYPES.EXPENSES ||
      (transaction && transaction.category.type === CATEGORY_TYPES.EXPENSES)
    )
      setLoadingPlan(true);
    setLoadingCategories(true);
    setLoadingEvents(true);
    getCategories();
    getEvents();
  }, []);

  useEffect(() => {
    if (categorySelected && walletSelected) {
      if (categorySelected.type === CATEGORY_TYPES.EXPENSES)
        getTotalOfCategory();
    }
  }, [walletSelected, categorySelected, date]);

  useEffect(() => {
    if (transaction) {
      setCategorySelected(
        categories.length > 0 &&
          categories.find((cate) => cate.name === transaction.category.name)
      );
      setWalletSelected(
        wallets.length > 0 &&
          wallets.find((wallet) => wallet.id === transaction.wallet_id)
      );
      setTitle(transaction.title);
      setAmount(transaction.amount);
      setFormattedAmount(
        (transaction.amount + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setPhoto("");
      setDate(new Date(transaction.date));
      setLocation(transaction.location || "");
      setDescription(transaction.description || "");
      setEventSelected(events.find((e) => e.id === transaction.event_id));
    } else if (event) {
      setWalletSelected(
        wallets.length > 0 &&
          wallets.find((wallet) => wallet.id === event.wallet_id)
      );
      setDate(new Date(event.date_begin));
      setEventSelected(events.find((e) => e.id === event.id));
      setCategorySelected(categories[0]);
    } else {
      setWalletSelected(walletChosen);
      setCategorySelected(categories[0]);
    }
  }, [wallets, categories]);

  const getCategories = async () => {
    try {
      setLoadingCategories(true);
      const chosenType = transaction ? transaction.category.type : type;
      const data = await CategoriesService.getCategories({ type: chosenType });
      setCategories(data.data.categories);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingCategories(false);
  };

  const getEvents = async () => {
    try {
      setLoadingEvents(true);
      const data = await EventsService.getEvents();
      setEvents(data.data.events);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingEvents(false);
  };

  const getTotalOfCategory = async () => {
    try {
      setLoadingPlan(true);
      const responseData = await PlansService.getCategoryPlans({
        year: new Date(date).getFullYear(),
        month: new Date(date).getMonth() + 1,
        category_id: categorySelected?.id,
        wallet_id: walletSelected?.id,
        with_report: true,
      });

      setPlanData(responseData.data.plans[0]);
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setLoadingPlan(false);
  };

  const saveTransaction = async () => {
    try {
      let haveErrors = false;
      setErrors(null);

      if (!title || title.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, title: t("error.required_title") };
        });
      }

      if (!amount || amount <= 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, amount: t("error.invalid_amount") };
        });
      }

      if (!haveErrors) {
        setProcessingSave(true);
        let data = {
          wallet_id: walletSelected.id,
          category_id: categorySelected.id,
          title,
          amount,
          date: format(new Date(date), "yyyy/MM/dd"),
          description,
          location,
        };

        if (photo !== "") {
          data = { ...data, image: photo };
        }

        if (photo === null && transaction) {
          data = { ...data, is_image_cleared: 1 };
        }

        if (eventSelected) {
          data = { ...data, event_id: eventSelected.id };
        }

        let responseData;
        if (!transaction || isCloning) {
          responseData = await TransactionsService.createTransaction(data);
        } else {
          responseData = await TransactionsService.updateTransaction(
            data,
            transaction.id
          );
        }

        if (responseData.status === "success") {
          setIsAdding(false);
          onAddingSuccess(transaction ? "update" : "create");
          dispatch(fetchWallets());
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setProcessingSave(false);
  };

  const handleCancel = () => {
    setIsAdding(false);
  };

  const handleAmountChange = (event) => {
    setErrors((prev) => {
      if (prev && prev.amount) delete prev.amount;
      return prev;
    });

    const { value } = event.target;
    const cleanAmount = value.replace(/[^0-9]/g, "");

    if (planData && parseInt(cleanAmount) > planData.amount - planData.actual) {
      setIsWarningOverspend(true);
    } else {
      setIsWarningOverspend(false);
    }

    if (value.length > 0 && isNaN(parseInt(value))) {
      setErrors((prev) => {
        return { ...prev, amount: t("error.invalid_amount") };
      });
    } else {
      setFormattedAmount(cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      setAmount(cleanAmount);
    }
  };

  const handleClone = () => {
    setIsCloning(true);
  };

  const handleChangeEvent = () => {
    setDate(new Date(eventSelected.date_begin));
  };

  useEffect(() => {
    if (eventSelected) {
      handleChangeEvent();
    }
  }, [eventSelected]);

  return (
    <>
      <ModalWithNothing
        onClose={handleCancel}
        width={"lg:w-1/2 sm:w-3/4 w-11/12"}
      >
        {/*HEADER*/}
        <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t max-h-screen">
          <h3 className="text-2xl text-center">
            {transaction && !isCloning
              ? t("transaction.transaction_detail")
              : TRANSACTION_TYPE.EXPENSE === type
              ? t("transaction.add_expense")
              : t("transaction.add_income")}
          </h3>
        </div>

        {/*BODY*/}
        <div className="relative sm:px-6 px-3 py-4 flex-auto">
          <div className="flex flex-col lg:flex-row max-h-96 overflow-y-scroll lg:max-h-none">
            {/* LEFT SIDE INPUTS (REQUIRED) */}
            <div className="p-3 border-r border-gray-200 w-full lg:w-1/2">
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
                selected={categorySelected}
                setSelected={setCategorySelected}
                required
                loading={loadingCategories}
              />
              <Input
                label={t("input.title")}
                type={"text"}
                name={"title"}
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                error={(errors && errors.title) || null}
              />
              {(type === CATEGORY_TYPES.EXPENSES ||
                (transaction &&
                  transaction.category.type === CATEGORY_TYPES.EXPENSES)) && (
                <>
                  {loadingPlan && (
                    <p className="text-sm text-blue-600 italic">
                      {t("info.loading_plan")}
                    </p>
                  )}
                  {!loadingPlan && (
                    <>
                      {planData && (
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon
                            icon={isWarningOverspend ? faWarning : faInfoCircle}
                            className={
                              planData.amount - planData.actual >= 0
                                ? isWarningOverspend
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                                : "text-red-600"
                            }
                          />
                          {planData.amount - planData.actual >= 0 && (
                            <p
                              className={`text-sm ${
                                isWarningOverspend
                                  ? "text-yellow-600"
                                  : "text-blue-600"
                              } italic`}
                            >
                              {t("info.have_plan")}{" "}
                              <span className="font-bold">
                                {formatCurrency(
                                  planData.amount - planData.actual
                                )}
                              </span>
                            </p>
                          )}
                          {planData.amount - planData.actual < 0 && (
                            <p className="text-sm text-red-600 italic">
                              {t("info.exceed_plan")}{" "}
                              <span className="font-bold">
                                {formatCurrency(
                                  (planData.amount - planData.actual) * -1
                                )}
                              </span>
                            </p>
                          )}
                        </div>
                      )}
                      {!planData && (
                        <p className="text-sm text-blue-600 italic">
                          {t("info.no_plan")}
                        </p>
                      )}
                    </>
                  )}
                </>
              )}
              <Input
                label={t("input.amount")}
                type={"text"}
                name={"amount"}
                size="small"
                value={formattedAmount}
                onChange={handleAmountChange}
                required
                error={(errors && errors.amount) || null}
              />
              {eventSelected &&
                eventSelected.date_begin !== eventSelected.date_end && (
                  <div className="flex items-center gap-2">
                    <FontAwesomeIcon
                      icon={faInfoCircle}
                      className="text-blue-600"
                    />
                    <p className="text-blue-600 text-sm italic">
                      Event duration:{" "}
                      {format(new Date(eventSelected.date_begin), "dd/MM/yyyy")}{" "}
                      - {format(new Date(eventSelected.date_end), "dd/MM/yyyy")}
                    </p>
                  </div>
                )}
              <Input
                label={t("input.date")}
                type={"date"}
                name={"date"}
                size="small"
                value={format(new Date(date), "yyyy-MM-dd")}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            {/* RIGHT SIDE INPUTS (OPTIONAL)*/}
            <div className="p-3 lg:w-1/2 sm:w-full">
              <SelectWithImage
                data={events}
                label={t("input.event")}
                selected={eventSelected}
                setSelected={setEventSelected}
                loading={loadingEvents}
                helperText={
                  !loadingEvents && events.length === 0 && t("info.no_event")
                }
              />
              <Input
                label={t("input.location")}
                type={"text"}
                name={"location"}
                size="small"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                error={(errors && errors.location) || null}
              />
              <ImageChoserPreview
                image={photo}
                setImage={setPhoto}
                errors={errors}
                setErrors={setErrors}
                defaultPreview={transaction ? transaction.image : ""}
              />

              {/* DESCRIPTION */}
              <div>
                <label htmlFor="description" className="text-sm">
                  Description
                </label>
                <textarea
                  className="block border-gray-300 ring-inset ring-gray-300 focus:ring-purple-400 w-full outline-none shadow-sm rounded-md py-1.5 px-3 text-sm ring-1"
                  type={"text"}
                  name={t("input.description")}
                  size="small"
                  rows={4}
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/*FOOTER*/}
        <div
          className={
            "flex items-center px-6 py-4 border-t border-solid border-slate-200 rounded-b " +
            (transaction && !isCloning ? "justify-between" : "justify-end")
          }
        >
          {transaction && !isCloning && (
            <div className="flex justify-end gap-2">
              <button
                className="text-red-600 active:bg-red-600 font-bold uppercase text-sm px-6 py-2 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={() => setIsDeleting(true)}
              >
                {t("action.delete")}
              </button>
              <button
                className="text-purple-600 active:bg-purple-600 font-bold uppercase text-sm px-6 py-2 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={handleClone}
              >
                {t("action.clone")}
              </button>
            </div>
          )}
          <div className="flex justify-end gap-2">
            <button
              className="text-gray-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              type="button"
              onClick={handleCancel}
            >
              {t("action.cancel")}
            </button>
            <button
              className="bg-purple-500 text-white active:bg-purple-600 font-bold uppercase text-sm px-6 py-2 rounded-xl shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 disabled:opacity-60"
              type="button"
              onClick={saveTransaction}
              disabled={processingSave}
            >
              {processingSave
                ? t("action.processing")
                : !transaction || isCloning
                ? t("action.add_transaction")
                : t("action.update")}
            </button>
          </div>
        </div>
      </ModalWithNothing>
    </>
  );
}

export default AddTransaction;
