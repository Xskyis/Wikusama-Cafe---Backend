/** load user model */
const userModel = require(`../models/index`).user

/** load joi's library */
const joi = require(`joi`)
const { Op } = require("sequelize")

/** call md5  */
const md5 = require(`md5`)

/** create a validation func */
let validateUser = (input) => {
    /** make a rules of validation */
    let rules = joi.object()
        .keys({
            nama_user: joi.string().required(),
            role: joi.string().valid(`kasir`,`admin`,`manajer`).required(),
            username: joi.string().required(),
            password: joi.string().min(8).required(),
        })

    /** process validation */
    let { error } = rules.validate(input)
    /** check error validation */
    if (error) {
        let message = error.details.map(item => item.message)
            .join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return {
        status: true,
    }
}

/** create func to get all user */
exports.getUser = async (request, response) => {
    try {
        /** get all user using model */
        let result = await userModel.findAll()

        /** gve response */
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

/** create and export func to find user */
exports.findUser = async (request, response) => {
    try {
        /** get keyword of search */
        let keyword = request.body.keyword

        /** get user based on keyword using model */
        let result = await userModel.findAll({
            where: {
                [Op.or]: {
                    nama_user: { [Op.substring]: keyword },
                    role: { [Op.substring]: keyword },
                    username: { [Op.substring]: keyword }
                }
            }
        })
        /** give a response */
        return response.json({
            status: true,
            message: `Hasil Pencarian Dari Keyword ( ${keyword} )`,
            data: result
        })

    } catch (error) {
        return response.json({
            status: false,
            error: error.message
        })
    }
}

/** create func to add user */
exports.addUser = async (request, response) => {
    try {
        /** validate a request */
        let resultValidation = validateUser(request.body)
        if (resultValidation.status === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        /** convert a password to md5 */
        request.body.password = md5(request.body.password)

        /** execute insert user using model */
        await userModel.create(request.body)

        /** give response */
        return response.json({
            status: true,
            message: `Data User berhasil di tambahkan`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create func to update user */
exports.updateUser = async (request, response) => {
    try {
        /** get id user that will be update */
        let id_user = request.params.id_user

        /** validate a request body */
        let resultValidation = validateUser(request.body)

        /** check result validation */
        if (resultValidation === false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        /** convert pass to md5 if it exist */
        if (request.body.password) {
            request.body.password = md5(request.body.password)
        }

        /** execute update user using model */
        await userModel.update(
            request.body,
            { where: { id_user: id_user } }
        )

        /** give response  */
        return response.json({  
            status: true,
            message: `Data user berhasil diubah`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** crete to delete */
exports.deleteUser = async (request, response) => {  
    try {
        let id_user = request.params.id_user
        
        /** run delete meja using model */
        await userModel.destroy({   
            where: {id_user: id_user}
        })

        /** give response */
        return response.json({  
            status: true,
            message: "Data User Berhasil di hapus"
        })
    } catch (error) {
        return response.json({  
            status: true,
            message: error.message
        })
    }
}

