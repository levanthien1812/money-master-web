import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import WalletsService from "../../../services/wallets";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchWallets, walletActions } from "../../../stores/wallets";
import { toast } from "react-toastify";

function AddWallet({ onClose, onAddSuccess, wallet = null, isNew = null }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setTitle("Update wallet");
      setIsDefault(wallet.default);
    } else {
      if (isNew) {
        setTitle("Set up your default wallet");
        setIsDefault(true);
      } else {
        setTitle("Add new wallet");
      }
    }
  }, [isNew, wallet]);

  const saveWallet = async () => {
    try {
      setErrors(null);
      let haveErrors = false;

      if (name.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, name: "Name is required!" };
        });
      }

      if (!wallet && !image) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, image: "Image is required!" };
        });
      }

      if (haveErrors) return;

      setIsSaving(true);
      let data = { name, default: isDefault ? 1 : 0 };

      if (image) {
        data = { ...data, image };
      }

      let responseData;
      if (!wallet) {
        responseData = await WalletsService.createWallet(data);
      } else {
        responseData = await WalletsService.updateWallet(data, wallet.id);
      }

      if (responseData.status === "success") {
        if (isNew) {
          dispatch(fetchWallets());
          dispatch(walletActions.setHaveDefaultWallet(true));
          navigate("/transactions");
        } else {
          onClose();
          onAddSuccess(wallet ? "update" : "create");
        }
      }
    } catch (e) {
      toast.error(e.response.data.message);
    }

    setIsSaving(false);
  };

  return (
    <Modal
      title={title}
      onClose={onClose}
      onAccept={saveWallet}
      width={"lg:w-1/4 sm:w-1/2 w-11/12"}
      action={isNew ? "yes" : "yesno"}
      processing={isSaving}
    >
      <div className="">
        <Input
          label={"Name"}
          type={"text"}
          name={"title"}
          size="small"
          value={name}
          onChange={(e) => setName(e.target.value)}
          error={(errors && errors.name) || null}
          required
        />

        <ImageChoserPreview
          image={image}
          setImage={setImage}
          errors={errors}
          setErrors={setErrors}
          defaultPreview={
            wallet && wallet.image
          }
          required
        />

        <div className="flex gap-1 items-center">
          <input
            type="checkbox"
            name="default"
            id="default"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
            disabled={isNew}
          />
          <label htmlFor="default">Set as default wallet</label>
        </div>
      </div>
    </Modal>
  );
}

export default AddWallet;
