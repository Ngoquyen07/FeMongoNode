import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const loginSchema = z.object({
    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Email is not valid'),
    password: z
        .string({ required_error: 'Password is required' })
})

export const loginValidationSchema = toTypedSchema(loginSchema)