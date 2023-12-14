import React, { useEffect, useState } from "react";
import Modal from "../../../components/modal/Modal";
import Select from "../../../components/elements/Select";
import Input from "../../../components/elements/Input";
import ImageChoserPreview from "../../../components/others/ImageChoserPreview";
import { format } from "date-fns";
import handleAmountChange from "../../../utils/handleAmountChange";
import GoalService from "../../../services/goals";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import formatCurrency from "../../../utils/currencyFormatter";

function AddGoal({ goal = null, status, onClose, onUpdateSuccess }) {
  const types = [
    { id: 1, name: "Saving goals", value: 1 },
    {
      id: 2,
      name: "Debt Reduction goals",
      value: 2,
    },
  ];
  const [type, setType] = useState(types[0]);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0);
  const [formattedAmount, setFormattedAmount] = useState("");
  const [dateEnd, setDateEnd] = useState(
    new Date().setDate(new Date().getDate() + 1)
  );
  const [dateBegin, setDateBegin] = useState(new Date());
  const [description, setDescription] = useState("");
  const [isImportant, setIsImportant] = useState(false);
  const [image, setImage] = useState(null);
  const [errors, setErrors] = useState(null);
  const [isSavingGoal, setIsSavingGoal] = useState(false);

  const handleDateBeginChange = (e) => {
    const date = e.target.value;
    setDateBegin(e.target.value);

    if (new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0)) {
      setErrors((prev) => {
        return { ...prev, dateBegin: "Date must be from today!" };
      });
    } else {
      setErrors((prev) => {
        if (prev && prev.dateBegin) delete prev.dateBegin;
        return prev;
      });
    }
  };

  const handleAddGoal = async () => {
    try {
      setErrors(null);
      let haveErrors = false;
      setIsSavingGoal(true);

      if (name.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, name: "Name is required!" };
        });
        haveErrors = true;
      }

      if (formattedAmount.length === 0) {
        haveErrors = true;
        setErrors((prev) => {
          return { ...prev, amount: "Amount is required!" };
        });
        haveErrors = true;
      }

      if (!haveErrors && !errors) {
        let data = {
          name: name,
          amount: amount,
          date_begin: format(new Date(dateBegin), "yyyy/MM/dd"),
          date_end: format(new Date(dateEnd), "yyyy/MM/dd"),
          description: description,
          type: type.value,
          is_important: isImportant ? 1 : 0,
          status: status
        };

        if (image !== "") {
          data = { ...data, image: image };
        }

        if (image === null && goal) {
          data = { ...data, is_image_cleared: 1 };
        }

        let responseData;
        if (!goal) {
          responseData = await GoalService.createGoal(data);
        } else {
          responseData = await GoalService.updateGoal(goal.id, data);
        }

        if (responseData.status === "success") {
          toast.success((!goal ? "Create" : "Update") + "goal successfully!");
          onClose();
          onUpdateSuccess(null, status);
        }
      }
    } catch (e) {
      setErrors(e.response.data.error);
      toast.error(e.response.data.message);
    }
    setIsSavingGoal(false);
  };

  useEffect(() => {
    if (
      new Date(dateEnd).setHours(0, 0, 0, 0) <=
      new Date(dateBegin).setHours(0, 0, 0, 0)
    ) {
      setErrors((prev) => {
        return {
          ...prev,
          dateEnd: "Ending date must be after the begining date!",
        };
      });
    } else {
      setErrors((prev) => {
        if (prev && prev.dateEnd) delete prev.dateEnd;
        return prev;
      });
    }
  }, [dateBegin, dateEnd]);

  useEffect(() => {
    if (goal) {
      setName(goal.name);
      setType(types.find((_type) => _type.value === goal.type));
      setDescription(goal.description || "");
      setDateBegin(new Date(goal.date_begin));
      setDateEnd(new Date(goal.date_end));
      setImage("");
      setAmount(goal.amount);
      setFormattedAmount(
        (goal.amount + "").replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      );
      setIsImportant(goal.is_important);
    }
  }, [goal]);

  return (
    <Modal
      title={"Set up a goal"}
      width={"xl:w-1/3 md:w-2/5 sm:w-1/2 w-11/12"}
      onAccept={handleAddGoal}
      onClose={onClose}
      processing={isSavingGoal}
    >
      <Select
        label={"Goal type"}
        required
        selected={type}
        setSelected={setType}
        data={types}
      />
      <Input
        label={"Name"}
        name={"name"}
        type={"text"}
        onChange={(e) => setName(e.target.value)}
        required
        size="sm"
        value={name}
        error={errors && errors.name}
      />
      {goal && status !== 1 && (
        <div className="flex items-center gap-2">
          <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
          <p className="text-sm text-blue-600 italic">
            Current total contributions amount:{" "}
            <span className="font-bold">
              {formatCurrency(goal.total_contributions)}
            </span>
          </p>
        </div>
      )}
      <Input
        label={"Expected amount"}
        name={"amount"}
        type={"text"}
        onChange={(e) =>
          handleAmountChange(
            e.target.value,
            setAmount,
            setFormattedAmount,
            setErrors
          )
        }
        required
        size="sm"
        value={formattedAmount}
        error={errors && errors.amount}
      />
      <Input
        label={"Begining Date"}
        name={"date_begin"}
        type={"date"}
        onChange={handleDateBeginChange}
        required
        size="sm"
        value={format(new Date(dateBegin), "yyyy-MM-dd")}
        error={errors && errors.date_begin}
        disable={goal && status !== 1}
      />
      <Input
        label={"Ending Date"}
        name={"date_end"}
        type={"date"}
        onChange={(e) => setDateEnd(e.target.value)}
        required
        size="sm"
        value={format(new Date(dateEnd), "yyyy-MM-dd")}
        error={errors && errors.date_end}
      />
      <div className="mb-3">
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
        defaultPreview={goal ? goal.image : ""}
      />
      <div className="flex gap-1 items-center">
        <input
          type="checkbox"
          name="important"
          id="important"
          checked={isImportant}
          onChange={(event) => setIsImportant(event.target.checked)}
        />
        <label htmlFor="important">Set as important</label>
      </div>
    </Modal>
  );
}

export default AddGoal;
