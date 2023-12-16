const multer = require('multer');
const {v4: uuidv4} = require('uuid'); 
const path = require('path'); // using path to get any file extension

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './public/images/uploads/')
    },
    filename: function(req, file, cb) {
        const unique = uuidv4();
        cb(null, unique + path.extname(file.originalname))
    }
    })

const upload = multer({storage: storage});  // using this upload variable, images upload hoti hai 
module.exports = upload;

