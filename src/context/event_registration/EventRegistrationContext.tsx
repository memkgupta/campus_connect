

import React, { createContext, useContext, useState, ReactNode } from "react";


type CollegeDetails = {
  collegeName: string;
  year: number;
};

type RegistrationDetails = {
  email: string;
  name: string;
  phoneNo: string;
  status?:string;
  isApproved?:boolean;
  collegeDetails: CollegeDetails;
};

type FormDataType = Record<string, any>; // Replace with exact shape when available

type EventRegistrationState = {
  eventId: string | null;
  outsideParticipantsAllowed: boolean;
  registrationId: string | null;
  isTeamEvent: boolean;
  registrationDetails: RegistrationDetails;
  formData: FormDataType;
  onFormSubmit: (data: FormDataType) => void;
};

export interface EventRegistrationContextType {
  data: EventRegistrationState;
  setData: React.Dispatch<React.SetStateAction<EventRegistrationState>>;
}


const defaultContextData: EventRegistrationState = {
  eventId: null,
  outsideParticipantsAllowed: false,
  isTeamEvent: false,
  registrationId: null,
  registrationDetails: {
    email: "",
    name: "",
    phoneNo: "",
    collegeDetails: {
      collegeName: "",
      year: 1,
    },
  },
  formData: {},
  onFormSubmit: () => {},
};


export const EventRegistrationContext = createContext<EventRegistrationContextType>({
  data: defaultContextData,
  setData: () => {}, 
});


export const EventRegistrationContextProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<EventRegistrationState>(defaultContextData);

  return (
    <EventRegistrationContext.Provider value={{ data, setData }}>
      {children}
    </EventRegistrationContext.Provider>
  );
};

export const useEventRegistration = () => useContext(EventRegistrationContext);
