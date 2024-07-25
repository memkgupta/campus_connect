import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs'
import connect from "@/lib/db";
import User from "@/lib/models/user.model";


export const authOptions:NextAuthOptions = {
    providers:[
        CredentialsProvider({
id:"credentials",
name:"Credentials",
credentials:{
    email:{label:"Email",type:"text"},
    password:{label:"Password",type:"password"}
},
async authorize(credentials:any):Promise<any>{
await connect();
try {
  const user =  await User.findOne({
        $or:[
            {email:credentials.identifier},{username:credentials.identifier}
        ]
    });
    if(!user){
        throw new Error("User not found with this email");
    }
    if(!user.verified){
        throw new Error("Please verify your account first")
    }
    const isPasswordMatch = await bcrypt.compare(credentials.password,user.password);
    if(!isPasswordMatch){
        throw new Error("Email or password is incorrect");
    }
    else{
        return user;
    }
} catch (error:any) {
    throw new Error(error.message)
}
}
        })
    ],
    pages:{
        signIn:'/auth/signin'
    },
    session:{
        strategy:"jwt",
        maxAge:30 * 24 * 60 * 60,
        updateAge:24 * 60 * 60
    },
    secret:process.env.NEXTAUTH_SECRET,
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString();
                token.verified = user.verified;
                token.username = user.username;
            
            }
return token;
        },
        async session({session,token}){
            if(token){
                session.user._id = token._id?.toString();
                session.user.verified = token.verified;
                session.user.username = token.username;
            }
            return session;
        },

    }
}
