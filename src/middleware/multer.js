const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = (folderName) => multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `uploads/${folderName}`;
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(
            null,
            Date.now() +
            Math.floor(Math.random() * 99999) +
            path.extname(file.originalname)
        );
    }
});

// ✅ WITH FILE (register)
const uploadWithImage = (folderName) =>
    multer({ storage: storage(folderName) }).fields([
        { name: 'thumbnail', maxCount: 1 }
    ]);

// ✅ WITHOUT FILE (login)
const uploadNone = multer().none();

module.exports = {
    uploadWithImage,
    uploadNone
};
