import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import SelectWithImage from "../../../components/elements/SelectWithImage";
import { format } from "date-fns";
import Input from "../../../components/elements/Input";
import { useSelector } from "react-redux";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import EventsService from "../../../services/events";
import { toast } from "react-toastify";
import TransactionList from "./TransactionList";

function AddEvent({ onClose, event = null }) {
  const { wallets, walletChosen } = useSelector((state) => state.wallet);

  const [name, setName] = useState("");
  const [dateBegin, setDateBegin] = useState(new Date());
  const [dateEnd, setDateEnd] = useState(new Date());
  const [walletSelected, setWalletSelected] = useState(walletChosen);
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState();

  const handleAddingEvent = async () => {
    try {
      const eventData = {
        name: name,
        date_begin: dateBegin,
        date_end: dateEnd,
        wallet_id: walletSelected.id,
        image: image,
        location: location,
        description: description,
      };

      const responseData = await EventsService.createEvent(eventData);

      if (responseData.status === "success") {
        toast.success("Create event successfully");
        onClose();
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }
  };

  useEffect(() => {
    console.log(event);
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
    <Modal
      onClose={onClose}
      title={event ? "Event detail" : "Add new event"}
      width={"md:w-2/5 sm:w-1/2 w-11/12"}
      onAccept={handleAddingEvent}
    >
      <div className={`grid ${event ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
        <div className={`grid ${!event ? "grid-cols-2" : "grid-cols-1"} gap-6`}>
          <div className="">
            <SelectWithImage
              data={wallets}
              label={"Wallet"}
              selected={walletSelected}
              setSelected={setWalletSelected}
              required
            />
            <Input
              label={"Name"}
              name={"name"}
              type={"text"}
              required
              size="small"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label={"Date begin"}
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
              label={"Date end"}
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
              label={"Location"}
              name={"location"}
              type={"text"}
              size="small"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <div>
              <label htmlFor="description">Description</label>
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
    </Modal>
  );
}

export default AddEvent;
