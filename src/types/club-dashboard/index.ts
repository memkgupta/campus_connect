export interface ClubMember{
    _id?:string,
    clubId?:string
      name?:string,
      userId?:string,
      role?:string,
      teamId?:string,
      status?:string,
      joinedAt?:Date,
}
export interface Event{
    _id?:string,
    admin?: string,
    isTeamEvent?:string,
    isPublished?:string,
    name?: string,
    description?:string,
    dateTime?:Date,
    location?:string,
    venue?:string,
    category?:string,
    banner?:string,
    key_persons?:{name:string,description:string,pic:string,urls:string[]}[],
    participantsFromOutsideAllowed:boolean,
    isAcceptingVolunteerRegistrations?:boolean,
    maxCapacity?:number,
    creationTimestamp?: Date,
    external_forms?:{
        _id:string,
        label:string,
        link:string,
        form:string
    }[],
    usingInternalRegistration?:boolean,
    status?:string,
    isRemoved?:boolean,
    club?:string,
    organizer?:string
}
export interface Team{
    _id?:string,
    title?:string,
    description?:string,
    status?:string,
    head?:ClubMember,
    members?:ClubMember[],
    createdAt:Date

}
export interface Message{
    _id?:string,
    club?:string,
    message?:string,
    email?:string,
    subject?:string,
    organisation?:string,
    name?:string
}
export interface ClubDetails{
    clubEmail?:string,
    clubDescription?:string,
    clubLogo?:string,
    contactPhone?:string,
    clubName?:string,
    isVerified?:boolean,
    admin?:ClubMember
}
export interface ClubRole{
    _id?:string,
    member?:ClubMember,
    role?:string,
    permissions?:string[],

}
export interface ClubTask{
    _id?:string,
    title?:string,
    description?:string,
    assignedTo?:ClubMember|string,
    status:"todo"|"in_progress"|"completed",
    attachements?:string[],
    dueDate?:Date,
    completedAt?:Date,
    completionComment?:string,
    teamId?:Team|string,
    priority?:string,
    assignedBy?:ClubMember|string,
    event?:Event|string,
   
}
export interface ClubNotification{
    description?:string,
    type?:string,
    _id?:string
}
export interface ClubPermission{
    _id:string,
    action:string,
    resource:string,
    member?:string,
}
export interface EventRegistration{
    _id: string;
    event: string;
    user: {
      profile: string;
      name: string;
      email: string;
      username: string;
    };
    entry_status: string;
    updatedAt: string;
    formSubmission: string;
  };

  export type CategorizedTasks = {
    todo: ClubTask[];
    in_progress: ClubTask[];
    completed:ClubTask[];
  };