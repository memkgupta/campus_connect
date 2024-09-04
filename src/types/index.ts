export type User ={
id:string,
username:string,
verified:boolean
}
export type AuthContextProps = {
 user: User | null;
authStatus:boolean;
logout: () => void;
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
      _id: string | null | undefined; label: string | null | undefined; videoUrl: string; thumbnail:string|null|undefined

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
      objectives: string;
      features: string;
      technologiesUsed: string;
      status: string;
      teamMembers: TeamMember[];
      projectLead: string;
      projectURL: string;
      githubRepoLink: string;
      documentation: string | null;
      presentation: string | null;
      openForCollaboration: boolean;
      contactInformation: string;
      feedbackComments: string;
      startDate: string;
      endDate: string;
      license: string;
      challengesFaced: string;
      futureScope: string;
      gallery: string[ ];
      demoVideo: string;
      privacySettings: string;
      approvalStatus: string;
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

