import { Schema, model, models, Model } from 'mongoose'
import uniqueValidator from 'mongoose-unique-validator'

export type UserType = {
    email: string
    password: string
}

const userSchema = new Schema<UserType>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
})

userSchema.plugin(uniqueValidator)

const User: Model<UserType> =
    (models.User as Model<UserType>) || model<UserType>('User', userSchema)

export default User
