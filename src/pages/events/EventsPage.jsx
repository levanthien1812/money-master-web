import React, { useState } from "react";
import logo from "../../assets/images/logo-money-master.png";

function EventsPage() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  console.log(isAddingEvent);
  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="sm:mb-8 mb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">Events</h2>
        </div>
        <button
          className="sm:py-2 sm:px-12 py-1 px-4 text-center rounded-xl font-semibold bg-purple-500 text-white hover:bg-purple-600"
          onClick={() => setIsAddingEvent(true)}
        >
          Add event
        </button>
      </div>
    </div>
  );
}

export default EventsPage;
