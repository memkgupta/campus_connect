export interface EventType {
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
    status?: "upcoming" | "completion-pending" | "completed";
    isRemoved?: boolean;
    isClubEvent?: boolean;
    club?: string;
    createdAt?: string;
    updatedAt?: string;
  }
  