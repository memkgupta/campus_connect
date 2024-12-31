export type User ={
id?:string,
email:string,
name:string,
username:string,
verified:boolean
}

    
    export interface AuthState {
      user: User | null;
      isAuthenticated: boolean;
      isLoading: boolean;
      feed?:any
    }
    export interface LoginCredentials {
      email: string;
      password: string;
    }
    
    export interface RegisterCredentials extends LoginCredentials {
      name: string;
    }
// export type UserDetails = {
//     username:string,
//     name:string,
//     bio:string,

// }

// {"success":true,"registrations":[{"_id":"669eb80460e7b2711420fa52","user":[{"username":"mkgupta","name":"Mayank Gupta","profile":"http://res.cloudinary.com/de4ix6d6g/image/upload/v1716648354/etxxptdjfevnlkeglchg.jpg"}],"applicationNote":"ssdsdf","registrationType":"participant","resume":null}],"total":1}
export type EventParticipantRequestResponse = {
      _id:string,
      user:{username:string,name:string,profile:string},
      
      links?:{_id:string,title:string,url:string}[],
      applicationNote:string,
      resume?:string,
      registrationType:string
      createdAt:Date,
}

export type YTLecture = {
      _id: string | null | undefined; label: string | null | undefined; videoUrl: string; thumbnail:string|null|undefined,description:string|null|undefined

}
export interface TeamMember{
      name:string,
      username:string,
      linkedin:string,
      role:string
    }
    
export interface ProjectFormData {
      projectTitle: string;
      projectDescription: string;
      projectCategory: string;
      tags: string;
      projectImage: string | null;
      problemStatement: string;
    
      technologiesUsed: string;
      status: string;
      // teamMembers: TeamMember[];
      // projectLead: string;
      projectURL: string;
      githubRepoLink: string;
      documentation: string | null;
      presentation: string | null;
      openForCollaboration: boolean;
      contactInformation: string;
      feedbackComments: string;
      startDate: Date;
      endDate: Date | undefined;
      license: string;
      challengesFaced: string;
      futureScope: string;
      gallery: string[ ];
      demoVideo: string;
      privacySettings: string;
      approvalStatus: string;
    }
   
    
    export interface Contributor {
      user: User;
      role: string;
    }
    
    export interface Project {
      _id: string;
      user: User;
      category: string;
      title: string;
      description: string;
      banner: string;
      images: string[];
      openForCollab: boolean;
      start: string;
      end?: string;
      documentation?: string;
      demo?: string;
      currently_working: boolean;
      tags: string;
      status: string;
      technologiesUsed: string;
      lead?: string;
      live_link?: string;
      github?: string;
      contributors: Contributor[];
    }
    export interface ProjectResponseData{
      
      category:string,
      title:string,
      description:string,
      banner:string,
      documentationLink:string|undefined
      images:string[],
      openForCollab:boolean,
      start:Date,
      technologiesUsed:string[],
      end:Date|undefined,
      currently_working:boolean,
      status:string,
      tags:string[],
      lead:TeamMember,
      live_link:string,
      github:string,
      demo:string,
      contributors:TeamMember[],
      createdAt:Date,
      updatedAt:Date
  }
    
export interface ProjectDashboardData  {
projectData:ProjectResponseData

}

export type Field = {
  _id: number;
  fieldType: 'text' | 'textarea' | 'number' | 'date' | 'select' | 'radio' | 'checkbox' | 'image';
 fieldLabel: string;
  placeholder: string;
isRequired: boolean;
  options?: string[];
};
export interface Registration {
  _id: string;
  user: {
    username: string;
    name: string;
    email: string;
  };
  updatedAt: Date;
}

export interface FilterOptions {
  search: string;
  sortBy: string;
  sortOrder: "asc" | "desc";
  page: number;
  onPageChange?: (page: number) => void;
}