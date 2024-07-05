import {z} from 'zod'

export const signInSchema = z.object({
    // identifier-> userid or email
    identifier : z.string(),
    password:z.string()
})