const multer = require('multer');

let storage = multer.diskStorage({
	destination: (req, file, cb) => cb(null, './public/uploads'),
	filename: (req, file, cb) => {
		let fileFormat = (file.originalname).split('.');
		cb(null, `file.fieldname.$fileFormat[fileFormat.length - 1]`);
	}
});

let upload = multer({
	storage: storage
});

module.exports = upload;