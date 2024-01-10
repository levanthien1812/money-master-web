import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo-money-master.png";
import AddEvent from "./components/AddEvent";
import EventsService from "../../services/events";
import { toast } from "react-toastify";
import Loading from "../../components/others/Loading";
import Input from "../../components/elements/Input";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "./components/bigCalendar.css";
import { useTranslation } from "react-i18next";

const localizer = momentLocalizer(moment);

function EventsPage() {
  const [isAddingEvent, setIsAddingEvent] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const {t} = useTranslation()

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const responseData = await EventsService.getEvents();

      if (responseData.status === "success") {
        setEvents(responseData.data.events);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleSelectEvent = (event) => {
    setSelectedEvent(event);
  };

  return (
    <div className="lg:p-8 sm:p-14 p-3">
      <div className="sm:mb-8 mb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <div className="lg:w-16 lg:h-16 w-10 h-10">
            <img src={logo} alt="" className="w-full h-full object-cover" />
          </div>
          <h2 className="sm:text-4xl text-3xl">{t('event.events')}</h2>
        </div>
        <button
          className="sm:py-2 sm:px-12 py-1 px-4 text-center rounded-xl font-semibold bg-purple-500 text-white hover:bg-purple-600"
          onClick={() => setIsAddingEvent(true)}
        >
          {t('event.add_event')}
        </button>
      </div>
      <div className="mx-auto 2xl:w-4/5 xl:w-5/6">
        {isAddingEvent && <AddEvent onClose={() => setIsAddingEvent(false)} onUpdateSuccess={fetchEvents}/>}
        {loading && <Loading />}

        {events.length > 0 && !loading && (
          <>
            <Calendar
              localizer={localizer}
              events={events.map((e) => {
                return {
                  ...e,
                  title: e.name,
                  start: new Date(e.date_begin),
                  end: new Date(e.date_end),
                };
              })}
              views={["month"]}
              onSelectEvent={(event) => handleSelectEvent(event)}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 700 }}
            />
          </>
        )}
      </div>

      {selectedEvent && (
        <AddEvent
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
          onUpdateSuccess={fetchEvents}
        />
      )}
    </div>
  );
}

export default EventsPage;
