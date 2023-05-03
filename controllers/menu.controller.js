/** load menu models */
const menuModel = require(`../models/index`).menu
/** load joi */
const joi = require(`joi`)
const { Op } = require("sequelize")

/** load path & fs */
const path = require(`path`)
const fs = require(`fs`)

/** load upload function*/
const upload = require(`./upload-menu`)

/** create func to validate menu */
const validateMenu = (input) => {
    /** define rules of menu */
    let rules = joi.object()
        .keys({
            nama_menu: joi.string().required(),
            jenis: joi.string().valid(`makanan`, `minuman`).required(),
            deskripsi: joi.string().required(),
            harga: joi.number().required()
        })

    /** get errpr  */
    let { error } = rules.validate(input)
    if (error) {
        let message = error.details.map(item => item.message).join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return { status: true }
}

/** create func to add menu */
exports.addMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            /** check file error / tidak saat upload */
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }
            /** check file ada / tidak */
            if (!request.file) {
                return response.json({
                    status: false,
                    message: `Nothing file to upload!`
                })
            }

            /** check validation of input */
            let resultValidation = validateMenu(request.body)
            if (resultValidation.status == false) {
                return response.json({
                    status: false,
                    message: resultValidation.message
                })
            }

            /** menyisipkan filename ke request.body */
            request.body.gambar = request.file.filename

            /** insert menu using model */
            await menuModel.create(request.body)

            /** givve response */
            return response.json({
                status: true,
                message: `Data menu telah di tambahkan`
            })

        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

//create func to get all menu
exports.getMenu = async (request, response) => {
    try {
        /** get all menu using model */
        let result = await menuModel.findAll()

        /** give response */
        return response.json({
            status: true,
            data: result
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create func to get specific menu */
exports.findMenu = async (request, response) => {
    try {
        let keyword = request.body.keyword
        let result = await menuModel.findAll({
            where: {
                [Op.or]: {
                    nama_menu: { [Op.like]: keyword },
                    harga: { [Op.like]: keyword },
                    deskripsi: { [Op.like]: keyword },
                    jenis: { [Op.like]: keyword }
                }
            }
        })

        /** give response */
        return response.json({
            status: true,
            message: `Berikut Hasil dari Keyword "${keyword}"`,
            data: result
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

// create and exports function to upadte menu
exports.updateMenu = async (request, response) => {
    try {
        const uploadMenu = upload.single(`gambar`)
        uploadMenu(request, response, async error => {
            if (error) {
                return response.json({
                    status: false,
                    message: error
                })
            }

            //get id menu that will be update
            let id_menu = request.params.id_menu

            //grab menu based on selected id_menu
            let selectedMenu = await menuModel
                .findOne({
                    where: { id_menu: id_menu }
                })

            // check if update within upload `gambar`
            if (request.file) {
                let oldFilename = selectedMenu.gambar
                //create path of file
                let pathFile = path.join(__dirname, `../menu_image`, oldFilename)

                // check the existing old file
                if (fs.existsSync(pathFile)) {
                    // delete the oldfile
                    fs.unlinkSync(pathFile, error => {
                        console.log(error)
                    })
                }

                //insert the file name to request.body
                request.body.gambar = request.file.filename
            }

            //upadate menu using model 
            await menuModel.update(
                request.body,
                { where: { id_menu: id_menu } }
            )

            //give a response
            return response.json({
                status: true,
                message: `Data telah diUpdate`
            })
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

//create and exports function to delete Menu
exports.deleteMenu = async (request, response) => {
    try {
        //get id menu that will be delete
        let id_menu = request.params.id_menu

        //grab menu based on selected id
        let selectedMenu = await menuModel.findOne({ where: { id_menu: id_menu } })

        //define a path of file
        let pathFile = path.join(__dirname, `../menu_image`, selectedMenu.gambar)

        //check existiong file
        if (fs.existsSync(pathFile)) {
            //delete file
            fs.unlinkSync(pathFile, error => {
                console.log(error);
            })
        }

        //delete menu using model
        await menuModel.destroy({
            where: { id_menu: id_menu }
        })

        //give response
        return response.json({
            status: true,
            message: `Data menu telah di hapus`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}





// /** create function to update book */
// exports.updateMenu = async (request, response) => {
//     /** check validation of input */
//     let resultValidation = validateMenu(request.body)
//     if (resultValidation.status == false) {
//         return response.json({
//             status: false,
//             message: resultValidation.message
//         })
//     }
// }

// /** create func to delete menu */
// exports.deleteMenu = async (request, response) => {
//     try {
//         /** get id from params */
//         let id = request.params.id_menu

//         /** delete menu using model */
//         await menuModel.destroy({ where: { id: id } })

//         /** give response */
//         return response.json({
//             status: true,
//             message: `Data menu telah di hapus`
//         })

//     } catch (error) {
//         return response.json({
//             status: false,
//             message: error.message
//         })
//     }
// }