import {z} from 'zod'
import { usernameValidation } from './signupSchema'
const socialObject = z.object({

    title:z.string(),
    url:z.string().url()
    })
export const editClubSchema = z.object({

    clubDescription:z.string().min(20).max(500),
    clubName:z.string().min(6).max(30),
    contactPhone:z.string().regex(/^[0-9]{10}$/, "Contact number must be 10 digits"),

    
})
