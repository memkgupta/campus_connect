export type Event = {
    name: string;
    description: string;
    dateTime: string;
    banner: string;
  };
  
export  type RegistrationField = {
    _id: number;
    fieldLabel: string;
    fieldType: string; 
    isRequired: boolean;
    options: string[];
    placeholder: string;
  };
  
 export type RegistrationForm = {
    _id: string; 
    fields: RegistrationField[];
  };
  
 export type SubmissionData = {
    [key: string]: string; 
  };
  
export  type Submission = {
    submissionData: SubmissionData;
  };
  export type User={
    profile:string,
    name:string,
    username:string,
    email:string
  }
 export type RegistrationDocument = {
    _id: string; 
    event: Event;
    status: string; 
    user:User;
    registrationForm: RegistrationForm[];
    submission: Submission;
  };
  