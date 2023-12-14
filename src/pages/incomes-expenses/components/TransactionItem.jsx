import React, { useState } from "react";
import formatCurrency from "../../../utils/currencyFormatter";
import { shorten } from "../../../utils/stringFormatter";
import AddTransaction from "./AddTransaction";
import ConfirmDeleteModal from "../../../components/modal/ConfirmDeleteModal";
import TransactionsService from "../../../services/transactions";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { fetchWallets } from "../../../stores/wallets";
import { CATEGORY_TYPES } from "../../../config/constants";

function TransactionItem({ transaction, index, onModifySuccess }) {
  const [isViewingDetail, setIsViewingDetail] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const dispatch = useDispatch();

  const handleDeleteTransaction = async () => {
    try {
      setIsSaving(true);
      const data = await TransactionsService.deleteTransaction(transaction.id);

      if (data.status === "success") {
        setIsDeleting(false);
        setIsViewingDetail(false);
        dispatch(fetchWallets());
        onModifySuccess("delete");
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
    setIsSaving(false);
  };

  return (
    <>
      <motion.div
        className={
          "flex gap-3 p-2 pe-6 items-center rounded-lg hover:bg-purple-200 cursor-pointer " +
          (index % 2 === 0 ? "bg-gray-200" : "bg-white")
        }
        onClick={() => setIsViewingDetail(true)}
        whileHover={{
          scale: 1.05,
        }}
      >
        <div className="w-16 h-16 overflow-hidden rounded-md shadow-sm flex-shrink-0 relative">
          <img
            src={transaction.category.image}
            alt=""
            className="object-cover w-full h-full"
          />
          <div
            className="absolute w-full bottom-0 left-0 bg-purple-500 text-white uppercase text-center"
            style={{ fontSize: 9 }}
          >
            {shorten(transaction.category.name, 8)}
          </div>
        </div>

        <div className="grow">
          <p className="text-md font-semibold">
            {shorten(transaction.title, 40)}
          </p>
          <p className="text-sm text-gray-500">
            {shorten(transaction.description, 50)}
          </p>
        </div>

        <div className="flex flex-col justify-center">
          <p
            className={
              "text-lg text-end font-semibold " +
              (transaction.category.type === CATEGORY_TYPES.INCOMES
                ? "text-green-600"
                : "text-orange-600")
            }
          >
            {(transaction.category.type === CATEGORY_TYPES.INCOMES
              ? "+"
              : "-") + formatCurrency(transaction.amount)}
          </p>
          <p className="text-sm text-end">{transaction.date}</p>
        </div>
      </motion.div>

      {isViewingDetail && (
        <AddTransaction
          setIsAdding={setIsViewingDetail}
          transaction={transaction}
          type={transaction.type}
          isDeleting={isDeleting}
          setIsDeleting={setIsDeleting}
          onAddingSuccess={onModifySuccess}
        />
      )}

      {/* CONFIRM DELETION */}
      {isDeleting && (
        <ConfirmDeleteModal
          onAccept={handleDeleteTransaction}
          onClose={() => {
            setIsDeleting(false);
          }}
          message={
            "Are you sure to delete this transaction? This action can not be undone!"
          }
          processing={isSaving}
        />
      )}
    </>
  );
}

export default TransactionItem;
