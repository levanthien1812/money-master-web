import React, { useState } from "react";
import Modal from "../../../components/modal/Modal";
import Input from "../../../components/elements/Input";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import Calculation from "./Calculation";
import formatCurrency from "../../../utils/currencyFormatter";

function IncomeTaxInfo({ onClose }) {
  const [dependentQuantity, setDependentQuantity] = useState(0);
  const [income, setIncome] = useState(0);
  const [formattedIncome, setFormattedIncome] = useState();
  const [insurance, setInsurance] = useState(0);
  const [formattedInsurance, setFormattedInsurance] = useState();
  const [errors, setErrors] = useState([]);
  const [showCalculation, setShowCalculation] = useState(false);
  const [calculatedTax, setCalculatedTax] = useState(0);

  const handleDependentQuantityChange = (e) => {
    const value = e.target.value;

    if (value <= 0) setDependentQuantity(0);
    else setDependentQuantity(value);
  };

  const handleIncomeChange = (event) => {
    setErrors((prev) => {
      if (prev && prev.income) delete prev.income;
      return prev;
    });

    const { value } = event.target;
    const cleanAmount = value.replace(/[^0-9]/g, "");

    if (value.length > 0 && isNaN(parseInt(value))) {
      setErrors((prev) => {
        return { ...prev, income: "Invalid amount!" };
      });
    } else {
      setFormattedIncome(cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      setIncome(cleanAmount);
    }
  };

  const handleInsuranceChange = (event) => {
    setErrors((prev) => {
      if (prev && prev.insurance) delete prev.insurance;
      return prev;
    });

    const { value } = event.target;
    const cleanAmount = value.replace(/[^0-9]/g, "");

    if (value.length > 0 && isNaN(parseInt(value))) {
      setErrors((prev) => {
        return { ...prev, insurance: "Invalid amount!" };
      });
    } else {
      setFormattedInsurance(cleanAmount.replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      setInsurance(cleanAmount);
    }
  };

  const handleCalculateIncomeTax = () => {
    const incomeLevels = [
      5000000, 10000000, 18000000, 32000000, 52000000, 80000000,
    ];
    const taxRates = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35];

    let taxableIncome = 0;
    let deductionAmount =
      11000000 + dependentQuantity * 4400000 + (insurance * 10.5) / 100;

    if (income > deductionAmount) {
      taxableIncome = income - deductionAmount;
    } else {
      return setCalculatedTax(0);
    }

    let remainingIncome = taxableIncome;
    let calculatedTax = 0;

    for (let i = 0; i < incomeLevels.length; i++) {
      if (remainingIncome <= 0) {
        break;
      }

      const currentLevel = incomeLevels[i];
      const currentRate = taxRates[i];
      const taxableAmount = Math.min(remainingIncome, currentLevel);

      calculatedTax += taxableAmount * currentRate;
      remainingIncome -= taxableAmount;
    }

    setCalculatedTax(calculatedTax);
  };

  return (
    <Modal
      title={"Personal Income Tax Info"}
      onClose={onClose}
      width={"lg:w-1/4 sm:w-1/2 w-11/12"}
    >
      <Input
        label={"Your monthly income"}
        name={"income"}
        type={"text"}
        required
        size="small"
        value={formattedIncome}
        onChange={handleIncomeChange}
        error={errors && errors.amount}
      />
      <Input
        label={"Insurance "}
        name={"insurance"}
        type={"text"}
        required
        size="small"
        value={formattedInsurance}
        onChange={handleInsuranceChange}
        error={errors && errors.insurance}
      />
      <Input
        type={"number"}
        label={"Dependent people quantity"}
        name={"dependent_quantity"}
        required
        size="small"
        value={dependentQuantity}
        onChange={handleDependentQuantityChange}
      />
      <div className="flex justify-between relative mt-6">
        <button
          className="text-sm bg-purple-500 rounded-full py-1 px-3 hover:bg-purple-600 text-white"
          onClick={handleCalculateIncomeTax}
        >
          Calculate Income
        </button>
        <button
          onMouseEnter={() => setShowCalculation(true)}
          onMouseLeave={() => setShowCalculation(false)}
        >
          <FontAwesomeIcon icon={faInfoCircle} />
        </button>
        {showCalculation && <Calculation />}
      </div>
      <div className="mt-6 border-2 border-purple-400 rounded-lg p-4">
        <p>
          Your person income tax is:{" "}
          <span className="font-extrabold text-purple-600">
            {formatCurrency(calculatedTax)}
          </span>
        </p>
      </div>
      <div className="flex flex-col gap-2 mt-6 p-4 rounded-lg bg-purple-50">
        <p className="text-sm font-bold">Lưu ý:</p>
        <p className="text-sm">
          Thu nhập tháng (thường tính bằng tiền lương ghi trên hợp đồng) của
          tiện ích này là tổng thu nhập chịu thuế quy định tại{" "}
          <a
            className="text-purple-600 hover:underline"
            href="https://thuvienphapluat.vn/van-ban/thue-phi-le-phi/Luat-thue-thu-nhap-ca-nhan-2007-04-2007-QH12-59652.aspx#dieu_10"
          >
            Điều 10 và Điều 11
          </a>{" "}
          của Luật thuế TNCN, đã tính các khoản giảm trừ sau:
        </p>
        <ul className="text-sm">
          <li>- Các khoản đóng bảo hiểm, quỹ hưu trí tự nguyện.</li>
          <li>- Các khoản đóng góp từ thiện, nhân đạo, khuyến học. </li>
        </ul>
        <p className="text-sm">
          Mức tiền lương tháng thấp nhất để đóng BHXH không được thấp hơn mức
          tối thiểu vùng tại thời điểm đóng đối với người lao động làm công việc
          hoặc chức danh giản đơn nhất trong điều kiện lao động bình thường.
        </p>
        <p className="text-sm">
          Đây là tiện ích nhằm giúp người dùng có thể nhanh chóng tính được số
          thuế TNCN phải nộp. Vui lòng tham khảo các căn cứ pháp lý để tính được
          kết quả chính xác nhất.
        </p>
      </div>
    </Modal>
  );
}

export default IncomeTaxInfo;
