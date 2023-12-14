import React from "react";

function AuthInput({
  type,
  name,
  onChange = null,
  onBlur = null,
  value = "",
  label,
  error,
  style = "",
}) {
  return (
    <div className="mb-3">
      {label && <label htmlFor={name}>{label}</label>}

      <input
        type={type}
        name={name}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
        className={
          "block border-2 border-purple-400 rounded-xl w-full py-2 px-4 text-xl outline-none " +
          style
        }
      />
      <p className="text-red-500 text-end italic text-sm">{error}</p>
    </div>
  );
}

export default AuthInput;
