import { EventType } from "@/types/events";
import { createContext, ReactNode, useContext, useState } from "react";



type EventContextType = {
  data: EventType | null;
  setData: React.Dispatch<React.SetStateAction<EventType | null>>;
};

// Create context with default value
const EventContext = createContext<EventContextType>({
  data: null,
  setData: () => {},
});

// Provider
export const EventContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<EventType | null>(null);

  return (
    <EventContext.Provider value={{ data, setData }}>
      {children}
    </EventContext.Provider>
  );
};

// Hook
export const useEventContext = () => {
  return useContext(EventContext);
};
