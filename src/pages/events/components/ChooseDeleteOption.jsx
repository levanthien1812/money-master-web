import React from "react";
import Modal from "../../../components/modal/Modal";
import EventsService from "../../../services/events";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Button from "../../../components/elements/Button";

function ChooseDeleteOption({ event, onUpdateSuccess, onClose }) {
  const { t } = useTranslation();

  const handleDeleteEvent = async (type) => {
    try {
      let responseData;
      if (type === "with-transactions") {
        responseData = await EventsService.deleteEventWithTransactions(
          event.id
        );
      } else {
        responseData = await EventsService.deleteEventWithoutTransactions(
          event.id
        );
      }

      if (responseData.status === "success") {
        toast.success(t("toast.delete_event_success"));
        onClose();
        onUpdateSuccess();
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <Modal
      title={"Choose Delete Type"}
      onClose={onClose}
      action={"no"}
      width={"xl:w-1/3 md:w-2/5 sm:w-1/2 w-11/12"}
    >
      <div className="flex flex-col justify-center items-center">
        <p className="text-xl mb-4">{t("warning.delete_event")}</p>
        <div className="flex w-full gap-2">
          <Button onClick={() => handleDeleteEvent("with-transactions")}>
            {t("event.delete_transactions")}
          </Button>
          <Button onClick={() => handleDeleteEvent("remove_event")}>
            {t("event.remove_event")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export default ChooseDeleteOption;
