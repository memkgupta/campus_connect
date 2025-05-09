export type EventType ={
    _id?: string;
    owner: string;
    type: "hackathon" | "session" | "workshop" | "contest" | "campaign" | "other" | "ground-work";
    basicDetails: {
      title: string;
      description: string;
      participantsFromOutsideAllowed: boolean;
      venue: string;
      startDate: string; // You can use Date if you're sure it'll be a Date object
      endDate: string;
      isOnline: boolean;
      isTeamEvent: boolean;
      category: string;
      isFree: boolean;
      maxParticipants?: number;
      registrationDeadline: string;
      multipleRounds: boolean;
    };
    eventStructure?: {
      eligibility?: string;
      teamRequirements?: {
        minimumStrength: number;
        maximumStrength: number;
        diffCollegeTeamMembersAllowed: boolean;
        otherCriterias?: string[];
      };
      roundsDetails?: {
        title: string;
        description: string;
        isOnline: boolean;
        isElimination: boolean;
      }[];
      guests?: {
        name: string;
        about?: string;
        image: string;
      }[];
      speakers?: {
        name: string;
        about?: string;
        image: string;
      }[];
      mentors?: {
        name: string;
        about?: string;
        image: string;
      }[];
      judges?: {
        name: string;
        about?: string;
        image: string;
      }[];
    };
    monetaryDetails?: {
      ticketDetails?: {
        tickets: {
          title: string;
          price: number;
          description: string;
        }[];
        description?: string;
      };
      prizes?: {
        title: string;
        description: string;
        type: "cash" | "swags" | "voucher" | "goods";
      }[];
      sponsors?: {
        name: string;
        description: string;
        level: string;
        logo: string;
      }[];
    };
    organiserDetails?: {
      organisers?: {
        name: string;
        level: number;
        position: string;
        image: string;
      }[];
      guidelines?: {
        title: string;
        description: string;
      }[];
    };
    isPublished: boolean;
    banner?: string;
    gallery?: {
      url: string;
      index: number;
    }[];
   registered?:string
   passGenerated?:boolean
    status?: "upcoming" | "completion-pending" | "completed";
    isRemoved?: boolean;
    isClubEvent?: boolean;
    club?: string;
    createdAt?: string;
    updatedAt?: string;
  }
export type EventTeam={
_id: string;
  event: string;
  name: string;
  status: 'submitted' | string; // Extend if other statuses exist
  code: string;
  members: Member[];
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v: number;
  lead: string; // lead is a user ID
}  

export type Member = {
  _id: string;
  event: string;
  team: string;
  user: string;
  registrationDetails: RegistrationDetails;
  __v: number;
};

export type RegistrationDetails = {
  _id: string;
  event: string;
  user: string;
  status: 'completed' | string; // extend if more statuses exist
  isApproved: boolean;
  registrationTimestamp: string; // ISO date string
  email: string;
  name: string;
  phoneNo: string;
  collegeDetails: CollegeDetails;
  createdAt: string;
  updatedAt: string;
  __v: number;
  formSubmission: string|FormSubmission;
  team: string;
};

export interface FormSubmission {
  _id: string;
  formId: string;
  submittedBy: string;
  submissionData: Record<string, string>;
  submittedAt: string;
  __v: number;
}
export type CollegeDetails = {
  collegeName: string;
  year: number;
};