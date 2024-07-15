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