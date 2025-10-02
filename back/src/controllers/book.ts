import { Request, Response, NextFunction } from 'express'
import Book, { BookType, RatingType } from '../models/Book'
import fs from 'fs'
import { IMAGES_DIR } from '../config/paths'
import path = require('path')

type IdParams = { id: string }

const getAllBooks = (req: Request, res: Response, next: NextFunction) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

const findOneBook = (req: Request, res: Response, next: NextFunction) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }))
}

const createBook = (req: Request, res: Response, next: NextFunction) => {
    const bookObject = JSON.parse(req.body.book)

    delete bookObject._id
    delete bookObject._userId

    const imageUrl = req.file
        ? `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        : bookObject.imageUrl

    const averageRating =
        Array.isArray(bookObject.ratings) && bookObject.ratings.length > 0
            ? Number(bookObject.ratings[0].grade ?? 0)
            : 0

    const book = new Book({
        ...bookObject,
        userId: req.auth?.userId,
        imageUrl,
        averageRating,
    })
    book.save()
        .then(() =>
            res.status(201).json({ message: 'Livre enregistré avec succès' })
        )
        .catch((error) => res.status(400).json({ error }))
}

const modifyBook = (req: Request, res: Response, next: NextFunction) => {
    const imageUrl = `${req.protocol}://${req.get('host')}/images/${
        req.file?.filename
    }`

    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl,
          }
        : { ...req.body }

    delete bookObject._userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                res.status(404).json({ message: 'Livre introuvable' })
                return
            }
            if (book.userId !== req.auth?.userId) {
                res.status(401).json({ message: 'Not authorized' })
                return
            }

            // modification de l'image:
            if (req.file && book.imageUrl) {
                const oldFilename = book.imageUrl.split('/images/')[1]
                req.file &&
                    fs.unlink(path.join(IMAGES_DIR, oldFilename), (err) => {
                        if (err) console.log(err)
                    })
            }

            const updateFields: Partial<BookType> = {
                title: bookObject.title ?? book.title,
                author: bookObject.author ?? book.author,
                ...(bookObject.imageUrl
                    ? { imageUrl: bookObject.imageUrl }
                    : {}),
            }
            Book.updateOne({ _id: req.params.id }, { $set: updateFields })
                .then(() => res.status(200).json({ message: 'Livre modifié!' }))
                .catch((error) => res.status(401).json({ error }))
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

const deleteBook = (req: Request, res: Response, next: NextFunction) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (!book) {
                res.status(404).json({ message: 'Livre introuvable' })
                return
            }
            if (book.userId !== req.auth?.userId) {
                res.status(401).json({ message: 'Not authorized' })
            }

            const filename = book.imageUrl.split('/images/')[1]
            fs.unlink(path.join(IMAGES_DIR, filename), () => {
                Book.deleteOne({ _id: req.params.id })
                    .then(() =>
                        res
                            .status(200)
                            .json({ message: 'Objet supprimé avec succès' })
                    )
                    .catch((error) => res.status(401).json({ error }))
            })
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

const createRating = (req: Request, res: Response, next: NextFunction) => {
    const ratingValue = req.body.rating
    if (!(ratingValue >= 0 && ratingValue <= 5)) {
        res.status(400).json({
            message: 'La note doit être comprise entre 0 et 5',
        })
        return
    }

    Book.findOne({ _id: req.params.id }).then((book) => {
        if (!book) {
            res.status(404).json({ message: 'Livre introuvable' })
            return
        }

        const alreadyRated = book.ratings.some(
            (rating) => rating.userId === req.auth?.userId
        )

        if (alreadyRated) {
            res.status(401).json({ message: 'Not authorized' })
        }

        const ratedBook: RatingType = {
            userId: req.auth!.userId,
            grade: ratingValue,
        }
        book.ratings.push(ratedBook)

        const grades = book.ratings.map((rating) => Number(rating.grade))

        const averageRating =
            grades.reduce((acc, nb) => acc + Number(nb), 0) / grades.length

        book.averageRating = averageRating

        Book.updateOne(
            { _id: req.params.id },
            {
                ratings: book.ratings,
                averageRating: book.averageRating,
                _id: req.params.id,
            }
        )
            .then(() => {
                res.status(201).json()
            })
            .catch((error) => {
                res.status(400).json({ error })
            })

        res.status(200).json(book)
    })
}

const getBestRating = (req: Request, res: Response, next: NextFunction) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books || []))
        .catch((error) =>
            res
                .status(500)
                .json({ error, message: 'impossible de récupérer les livres' })
        )
}

const bookController = {
    getAllBooks,
    findOneBook,
    createBook,
    modifyBook,
    deleteBook,
    createRating,
    getBestRating,
}

export default bookController
