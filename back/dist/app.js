"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const paths_1 = require("./config/paths");
dotenv_1.default.config();
const book_1 = __importDefault(require("./routes/book"));
const user_1 = __importDefault(require("./routes/user"));
mongoose_1.default
    .connect(`mongodb+srv://jnd:${process.env.DB_PASSWORD}@grimoiredb.gdg6pdq.mongodb.net/?retryWrites=true&w=majority&appName=GrimoireDB`, {})
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/auth', user_1.default);
app.use('/api/books', book_1.default);
if (!fs_1.default.existsSync(paths_1.IMAGES_DIR)) {
    fs_1.default.mkdirSync(paths_1.IMAGES_DIR, { recursive: true });
}
app.use('/images', express_1.default.static(paths_1.IMAGES_DIR));
exports.default = app;
