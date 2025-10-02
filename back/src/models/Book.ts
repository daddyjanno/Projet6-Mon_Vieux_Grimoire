import { Schema, model, models, Model } from 'mongoose'

export type RatingType = {
    userId: string
    grade: number
}

export type BookType = {
    userId: string
    title: string
    author: string
    imageUrl: string
    year: number
    genre: string
    ratings: RatingType[]
    averageRating: number
}

const ratingSchema = new Schema(
    {
        userId: { type: String },
        grade: { type: Number },
    },
    {
        _id: false,
    }
)
const bookSchema = new Schema<BookType>(
    {
        userId: { type: String, required: true },
        title: { type: String, required: true },
        author: { type: String, required: true },
        imageUrl: { type: String, required: true },
        year: { type: Number, required: true },
        genre: { type: String, required: true },
        ratings: [{ type: ratingSchema, default: [] }],
        averageRating: { type: Number, default: 0 },
    },
    {
        timestamps: true,
        versionKey: false,
    }
)

const Book: Model<BookType> =
    (models.Book as Model<BookType>) || model<BookType>('Book', bookSchema)

export default Book
