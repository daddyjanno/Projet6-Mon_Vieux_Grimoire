const { error } = require('console')
const Book = require('../models/Book')
const fs = require('fs')

exports.getAllBooks = (req, res, next) => {
    Book.find()
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}

exports.findOneBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => res.status(200).json(book))
        .catch((error) => res.status(404).json({ error }))
}

exports.createBook = (req, res, next) => {
    const bookObject = JSON.parse(req.body.book)

    delete bookObject._id
    delete bookObject._userId

    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${
            req.file.filename
        }`,
        averageRating: bookObject.ratings[0].grade,
    })
    book.save()
        .then(() =>
            res.status(201).json({ message: 'Livre enregistré avec succès' })
        )
        .catch((error) => res.status(400).json({ error }))
}

exports.modifyBook = (req, res, next) => {
    const bookObject = req.file
        ? {
              ...JSON.parse(req.body.book),
              imageUrl: `${req.protocol}://${req.get('host')}/images/${
                  req.file.filename
              }`,
          }
        : { ...req.body }

    delete bookObject._userId

    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId != req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                Book.updateOne(
                    { _id: req.params.id },
                    { ...bookObject, _id: req.params.id }
                )
                    .then(() =>
                        res.status(200).json({ message: 'Objet modifié!' })
                    )
                    .catch((error) => res.status(401).json({ error }))
            }
        })
        .catch((error) => {
            res.status(400).json({ error })
        })
}

exports.deleteBook = (req, res, next) => {
    Book.findOne({ _id: req.params.id })
        .then((book) => {
            if (book.userId !== req.auth.userId) {
                res.status(401).json({ message: 'Not authorized' })
            } else {
                const filename = book.imageUrl.split('/images/')[1]
                fs.unlink(`images/${filename}`, () => {
                    Book.deleteOne({ _id: req.params.id })
                        .then(() =>
                            res
                                .status(200)
                                .json({ message: 'Objet supprimé avec succès' })
                        )
                        .catch((error) => res.status(401).json({ error }))
                })
            }
        })
        .catch((error) => {
            res.status(500).json({ error })
        })
}

exports.createRating = (req, res, next) => {
    if (req.body.rating > 0 && req.body.rating <= 5) {
        const ratedBook = { ...req.body, grade: req.body.rating }
        delete ratedBook._id

        Book.findOne({ _id: req.params.id })
            .then((book) => {
                const ratings = book.ratings
                if (ratings.some(ratings.userId === req.auth.userId)) {
                    res.status(401).json({ message: 'Not authorized' })
                } else {
                    ratings.push(ratedBook)
                    const averageRating =
                        grades.reduce((total, curr) => (total += curr)) /
                        grades.length
                    book.averageRating = averageRating
                    Book.updateOne(
                        { _id: req.params.id },
                        {
                            ratings,
                            averageRating,
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
                }
            })
            .catch((error) => {
                res.status(400).json({ error })
            })
    } else {
        res.status(400).json({
            message: 'La note doit être comprise entre 1 et 5',
        })
    }
}

exports.getBestRating = (req, res, next) => {
    Book.find()
        .sort({ averageRating: -1 })
        .limit(3)
        .then((books) => res.status(200).json(books))
        .catch((error) => res.status(400).json({ error }))
}
