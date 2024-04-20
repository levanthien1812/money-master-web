import { useQuery } from "react-query";
import { toast } from "react-toastify";
import EventsService from "../services/events";

export const GetEventsQuery = () => {
  const {
    data: events,
    isError: eventsIsError,
    error: eventsError,
    isLoading: loadingEvents,
  } = useQuery({
    queryKey: ["events"],
    queryFn: ({ signal }) => EventsService.getEvents(signal),
  });

  if (eventsIsError) {
    toast.error(eventsError.response?.data.message);
  }

  return { events, loadingEvents };
};
