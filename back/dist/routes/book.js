"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../middlewares/auth"));
const multer_config_1 = __importDefault(require("../middlewares/multer-config"));
const sharp_1 = __importDefault(require("../middlewares/sharp"));
const book_1 = __importDefault(require("../controllers/book"));
const router = express_1.default.Router();
router.get('/bestrating', book_1.default.getBestRating);
router.get('/', book_1.default.getAllBooks);
router.get('/:id', book_1.default.findOneBook);
router.post('/', auth_1.default, multer_config_1.default, sharp_1.default, book_1.default.createBook);
router.post('/:id/rating', auth_1.default, book_1.default.createRating);
router.put('/:id', auth_1.default, multer_config_1.default, sharp_1.default, book_1.default.modifyBook);
router.delete('/:id', auth_1.default, book_1.default.deleteBook);
exports.default = router;
