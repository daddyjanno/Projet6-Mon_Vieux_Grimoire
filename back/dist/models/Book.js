"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ratingSchema = new mongoose_1.Schema({
    userId: { type: String },
    grade: { type: Number },
}, {
    _id: false,
});
const bookSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    imageUrl: { type: String, required: true },
    year: { type: Number, required: true },
    genre: { type: String, required: true },
    ratings: [{ type: ratingSchema, default: [] }],
    averageRating: { type: Number, default: 0 },
}, {
    timestamps: true,
    versionKey: false,
});
const Book = mongoose_1.models.Book || (0, mongoose_1.model)('Book', bookSchema);
exports.default = Book;
