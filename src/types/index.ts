export type User ={
id:string,
username:string,

}
export type AuthContextProps = {
 user: User | null;
authStatus:boolean;
logout: () => void;
}