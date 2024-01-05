import React from "react";
import Popper from "../../components/modal/Popper";
import worried from "../../assets/images/worried.png";

function Warning({ onClose, top, left, message }) {
  return (
    <Popper top={top} left={left} onClose={onClose}>
      <div className="flex items-center gap-3">
        <div className="w-16 h-16">
          <img src={worried} alt="" className="object-cover w-full h-full" />
        </div>
        <p className="w-[300px] text-left text-[15px]">{message}</p>
      </div>
    </Popper>
  );
}

export default Warning;
