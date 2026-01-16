import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'

export const staffSchema = z.object({
    username: z
        .string({ required_error: 'Username is required' })
        .trim()
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username is too long'),

    email: z
        .string({ required_error: 'Email is required' })
        .trim()
        .email('Email is not valid'),

    password: z
        .string({ required_error: 'Password is required' })
        .min(6, 'Password must be at least 6 characters'),

    confirmPassword: z
        .string({ required_error: 'Confirm password is required' }),

    role: z
        .string({ required_error: 'Role is required' })
        .trim(),
}).refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Confirm passwords do not match',
})

export const staffValidationSchema = toTypedSchema(staffSchema)
