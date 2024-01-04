import React, { useState } from 'react'
import formatCurrency from '../../../utils/currencyFormatter';
import { CATEGORY_TYPES } from '../../../config/constants';
import AddTransaction from '../../transactions/components/AddTransaction';
import { useDispatch } from 'react-redux';
import TransactionsService from '../../../services/transactions';
import { fetchWallets } from '../../../stores/wallets';
import ConfirmDeleteModal from '../../../components/modal/ConfirmDeleteModal';
import { toast } from 'react-toastify';

function TransactionItem({ transaction, onModifySuccess }) {
    const [isViewingDetail, setIsViewingDetail] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const dispatch = useDispatch();

    const handleDeleteTransaction = async () => {
      try {
        setIsSaving(true);
        const data = await TransactionsService.deleteTransaction(
          transaction.id
        );

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
        <div
          key={transaction.id}
          className="flex rounded-md overflow-hidden shadow-md mb-2 bg:white hover:bg-gray-100 cursor-pointer"
          onClick={() => setIsViewingDetail(true)}
        >
          <div className="w-12 h-12 flex">
            <img
              src={transaction.category.image}
              className="w-full h-full object-cover"
              alt=""
            />
          </div>
          <div className="px-2 flex flex-col justify-center">
            <p className="text-sm">{transaction.title}</p>
            <p
              className={`text-sm font-bold ${
                transaction.category.type === CATEGORY_TYPES.EXPENSES
                  ? "text-orange-600"
                  : "text-green-600"
              }`}
            >
              {formatCurrency(transaction.amount)}
            </p>
          </div>
        </div>

        {isViewingDetail && (
          <AddTransaction
            setIsAdding={setIsViewingDetail}
            transaction={transaction}
            type={transaction.category.type}
            isDeleting={isDeleting}
            setIsDeleting={setIsDeleting}
            onAddingSuccess={onModifySuccess}
          />
        )}

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

export default TransactionItem