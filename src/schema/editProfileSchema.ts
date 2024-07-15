import {z} from 'zod'
import { usernameValidation } from './signupSchema'
const socialObject = z.object({

    title:z.string(),
    url:z.string().url()
    })
export const editProfileSchema = z.object({

    username:usernameValidation,
    name:z.string().min(6).max(30),
    bio:z.string(),
    interests:z.array(z.string()),
    socials:z.array(socialObject).optional()
})
