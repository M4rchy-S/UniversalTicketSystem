const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: './files',
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true); // Accept file
    } else {
        cb(new Error('Only image files are allowed!'), false); // Reject file
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 * 100 }, // 100 Mb,
    fileFilter: fileFilter
});

module.exports = upload;