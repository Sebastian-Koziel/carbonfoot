import { Document } from "mongoose";

export interface User extends Document {
    _id: string
    email: string
    password: string
    name: string
    surname: string
    company: string
    isEmailVerified: boolean
    emailVerificationToken: string
}