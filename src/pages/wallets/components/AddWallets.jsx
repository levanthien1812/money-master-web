import React, { useEffect, useMemo, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import WalletsService from "../../../services/wallets";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { fetchWallets, walletActions } from "../../../stores/wallets";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { SAMPLE_IMAGES_URL } from "../../../config/constants";

function AddWallet({ onClose, onAddSuccess, wallet = null, isNew = null }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isDefault, setIsDefault] = useState(false);
  const [title, setTitle] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [imageChosen, setImageChosen] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const sampleImageUrls = useMemo(() => {
    return [1, 2, 3, 4].map(
      (number) => SAMPLE_IMAGES_URL + "wallets/wallet-" + number + ".jpg"
    );
  }, []);

  useEffect(() => {
    if (wallet) {
      setName(wallet.name);
      setTitle(t("wallet.update_wallet"));
      setIsDefault(wallet.default);
    } else {
      if (isNew) {
        setTitle(t("wallet.setup_default_wallet"));
        setIsDefault(true);
      } else {
        setTitle(t("wallet.add_new_wallet"));
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
          return { ...prev, name: t("error.require_name") };
        });
      }

      if (!wallet && !image && !imageChosen) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, image: t("error.required_image") };
        });
      }

      if (haveErrors) return;

      setIsSaving(true);
      let data = { name, default: isDefault ? 1 : 0 };

      if (image) {
        data = { ...data, image };
      }

      if (imageChosen) {
        data = { ...data, image: imageChosen };
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

  const handleChooseImage = (image) => {
    if (image !== imageChosen) setImageChosen(image);
    else setImageChosen(null);
    setImage(null);
  };

  useEffect(() => {
    if (image) {
      setImageChosen(null);
    }
  }, [image]);

  return (
    <Modal
      title={title}
      onClose={onClose}
      onAccept={saveWallet}
      width={"xl:w-1/4 lg:w-1/3 sm:w-1/2 w-11/12"}
      action={isNew ? "yes" : "yesno"}
      processing={isSaving}
    >
      <div className="">
        <Input
          label={t("input.name")}
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
          defaultPreview={wallet && wallet.image}
          clearPreview={imageChosen !== null}
          required
        />
        <div>
          <p className="text-sm">{t("wallet.choose_below")}</p>

          <div className="flex gap-3 mt-2">
            {sampleImageUrls &&
              sampleImageUrls.map((image) => (
                <div
                  key={Math.random()}
                  className={`w-1/4 rounded-lg overflow-hidden shadow-md hover:shadow-purple-200 cursor-pointer ${
                    image === imageChosen && "border-2 border-purple-300"
                  }`}
                  onClick={() => handleChooseImage(image)}
                >
                  <img src={image} className="w-full h-full" />
                </div>
              ))}
          </div>
        </div>

        <div className="flex gap-1 items-center mt-3">
          <input
            type="checkbox"
            name="default"
            id="default"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
            disabled={isNew}
          />
          <label htmlFor="default">{t("input.set_default_wallet")}</label>
        </div>
      </div>
    </Modal>
  );
}

export default AddWallet;
