import React, { useState } from "react";

function EventsPage() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  console.log(isAddingEvent);
  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="sm:mb-8 mb-4 flex justify-between items-center">
        <h2 className="sm:text-4xl text-3xl">Events</h2>
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
