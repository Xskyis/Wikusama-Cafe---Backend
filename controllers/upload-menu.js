/**
 * Load library multer
 * for upload storage
 */
const multer = require(`multer`)

/** config of storage */
const configStorage = multer.diskStorage({
    destination: (request, file, callback) => (
        callback(null, `./menu_image`)
    ),
    filename: (request, file, callback) => (
        /** icun .jpg 
         * format: iamge-tgl-icun.jpg
         * */
        callback(null, `pic-${Date.now()}-${file.originalname}`)
    )
})

/** define func upload */
const upload = multer({
    storage: configStorage,
    /** filter file */
    fileFilter: (request, file, callback) => {
        /** deifne acc extension */
        const extension = [`image/jpg`, `image/jpeg`, `image/png`, `image/gif`, `image/bmp`, `image/tiff`]


        /** check extension */
        if (extension.includes(file.mimetype)) {
            /** refuse upload */
            callback(null, false)
            return callback(null, `invalid type of file`)
        }

        /** filter size limit */
        /** define max size */
        const maxSize = (1 * 1024 * 1024)
        const fileSize = request.headers[`content-length`]

        if (fileSize > maxSize) {
            /** refuse upload */
            callback(null, false)
            return callback(null, `Max size 1 MB`)
        }

        /** accepted upload */
        callback(null, true)
    }
})

/** export func */
module.exports = upload