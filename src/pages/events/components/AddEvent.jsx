import React, { useEffect, useState } from "react";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import { format } from "date-fns";
import Input from "../../../components/elements/Input";
import { useSelector } from "react-redux";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import EventsService from "../../../services/events";
import { toast } from "react-toastify";
import TransactionList from "./TransactionList";
import ModalWithNothing from "../../../components/modal/ModalWithNothing";
import ChooseDeleteOption from "./ChooseDeleteOption";
import { useTranslation } from "react-i18next";
import Button from "../../../components/elements/Button";

function AddEvent({ onClose, event = null, onUpdateSuccess }) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);

  const [name, setName] = useState("");
  const [dateBegin, setDateBegin] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [walletSelected, setWalletSelected] = useState(walletChosen);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState();
  const [isDeleting, setIsDeleting] = useState(false);
  const [processingSave, setProcessingSave] = useState(false);
  const { t } = useTranslation();

  const handleAddingEvent = async () => {
    try {
      setProcessingSave(true);
      const eventData = {
        name: name,
        date_begin: format(new Date(dateBegin), "yyyy-MM-dd"),
        date_end: format(new Date(dateEnd), "yyyy-MM-dd"),
        wallet_id: walletSelected.id,
        image: image,
        location: location,
        description: description,
      };

      let responseData;
      if (!event) {
        responseData = await EventsService.createEvent(eventData);
      } else {
        responseData = await EventsService.updateEvent(eventData, event.id);
      }

      if (responseData.status === "success") {
        toast.success(
          !event
            ? t("toast.create_event_success")
            : t("toast.update_event_success")
        );
        onUpdateSuccess();
        onClose();
      }
    } catch (e) {
      toast.error(e);
    }
    setProcessingSave(false);
  };

  useEffect(() => {
    if (event) {
      setName(event.name);
      setLocation(event.location);
      setDateBegin(new Date(event.date_begin));
      setDateEnd(new Date(event.date_end));
      setDescription(event.description || "");
      setWalletSelected(
        wallets.find((wallet) => wallet.id === event.wallet_id)
      );
    }
  }, []);

  return (
    <ModalWithNothing
      onClose={onClose}
      width={"2xl:w-2/5 md:w-3/5 sm:w-1/2 w-11/12"}
    >
      <div className="flex items-start justify-center p-5 border-b border-solid border-slate-200 rounded-t max-h-screen">
        <h3 className="text-2xl text-center">
          {event ? t("event.event_detail") : t("event.add_new_event")}
        </h3>
      </div>
      <div className="sm:px-6 px-3 py-4">
        <div
          className={`grid w-full ${
            event ? "grid-cols-2" : "grid-cols-1"
          } gap-6`}
        >
          <div
            className={`grid ${!event ? "grid-cols-2" : "grid-cols-1"} gap-6`}
          >
            <div className="">
              <SelectWithImage
                data={wallets}
                label={t("input.wallet")}
                selected={walletSelected}
                setSelected={setWalletSelected}
                required
              />
              <Input
                label={t("input.name")}
                name={"name"}
                type={"text"}
                required
                size="small"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                label={t("input.begining_date")}
                type={"date"}
                name={"date_begin"}
                size="small"
                value={format(new Date(dateBegin), "yyyy-MM-dd")}
                onChange={(e) => {
                  setDateBegin(e.target.value);
                  setDateEnd(e.target.value);
                }}
                required
              />
              <Input
                label={t("input.ending_date")}
                type={"date"}
                name={"date_end"}
                size="small"
                value={format(new Date(dateEnd), "yyyy-MM-dd")}
                onChange={(e) => setDateEnd(e.target.value)}
                required
              />
            </div>
            <div className="">
              <Input
                label={t("input.location")}
                name={"location"}
                type={"text"}
                size="small"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <div>
                <label htmlFor="description">{t("input.description")}</label>
                <textarea
                  className="block border-gray-300 ring-inset ring-gray-300 focus:ring-purple-400 w-full outline-none shadow-sm rounded-md py-1.5 px-3 text-sm ring-1"
                  type={"text"}
                  name={"description"}
                  size="small"
                  rows={4}
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <ImageChoserPreview
                image={image}
                setImage={setImage}
                errors={errors}
                setErrors={setErrors}
              />
            </div>
          </div>
          {event && <TransactionList event={event} />}
        </div>
      </div>
      <div
        className={
          "flex items-center px-6 py-4 border-t border-solid border-slate-200 rounded-b " +
          (event ? "justify-between" : "justify-end")
        }
      >
        {event && (
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => setIsDeleting(true)}
              className="uppercase font-bold"
              variant="danger"
            >
              {t("action.delete")}
            </Button>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            onClick={onClose}
            className="uppercase font-bold"
            variant="secondary"
          >
            {t("action.cancel")}
          </Button>
          <Button
            onClick={handleAddingEvent}
            className="uppercase font-bold"
            variant="primary"
          >
            {processingSave
              ? t("action.processing")
              : !event
              ? t("action.add_event")
              : t("action.update")}
          </Button>
        </div>
      </div>
      {isDeleting && (
        <ChooseDeleteOption
          onClose={() => setIsDeleting(false)}
          event={event}
          onUpdateSuccess={() => {
            onClose();
            onUpdateSuccess();
          }}
        />
      )}
    </ModalWithNothing>
  );
}

export default AddEvent;
