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