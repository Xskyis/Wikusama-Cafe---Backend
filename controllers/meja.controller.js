/** Panggil Model */
const mejaModel = require(`../models/index`).meja

/** call joi */
const joi = require(`joi`)

/** define func to validate input meja */
const validateMeja = async (input) => {
    /** define rules of validation */
    let rules = joi.object()
        .keys({
        nomor_meja: joi.string().required(),
        status: joi.boolean().required()
    })

    /** validation process */
    let { error } = rules.validate(input)

    if (error) {
        /** arrange error */
        let message = error
            .details
            .map(item => item.message)
            .join(`,`)
        return {
            status: false,
            message: message
        }
    }
    return { status: true }
}

/** membuat dan meng ekspor fungsi utk memuat meja */
exports.getMeja = async (request, response) => {
    try {
        /** call meja from database using models */
        let meja = await mejaModel.findAll()

        /** give response within meja */
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** membuat fungsi utk create and export function to filter available meja */
exports.availableMeja = async (request, response) => {
    try {
        /** define parameter for status true */
        let param = { status: true }

        /** get data meja from db with defined filter */
        let meja = await mejaModel.findAll({ where: param })

        /** five response */
        return response.json({
            status: true,
            data: meja
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create and export function to add new meja */
exports.addMeja = async (request, response) => {
    try {
        /** validasi data meja */
        let resultValidation = validateMeja(request.body)

        if (resultValidation.status == false) {
            return response.json({
                status: false,
                message: resultValidation.message
            })
        }

        /** insert data meja to db using model */
        await mejaModel.create(request.body)

        /** give response */
        return response.json({
            status: true,
            message: `Data Meja Berhasil ditambahkan`
        })
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create and export func to update meja */
exports.updateMeja = async (request, response) => {
    try {
        /** get parameter for update */
        let id_meja = request.params.id_meja

        /** validate data meja */
        let resultValidation = validateMeja(request.body)

        /** cek ke validasian */
        if (resultValidation.status == false) {
            // kondisi jika kondisi !validasi / salah
            return response.json({  
                status: false,
                message: resultValidation.message
            })
        }

        /** run update meja using meja model */
        await mejaModel.update(request.body,{ 
            where: {id_meja: id_meja}
        })

        //** Give a response */
        return response.json({  
            status: true,
            message: "Data Meja Berhasil Di ubah"
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create & export func to delete meja */
exports.deleteMeja = async (request, response) => {  
    try {
        let id_meja = (request.params.id_meja)
        
        /** run delete meja using model */
        await mejaModel.destroy({   
            where: {id_meja: id_meja}
        })

        /** give response */
        return response.json({  
            status: true,
            message: "Data Meja Berhasil di hapus"
        })

    } catch (error) {
        return response.json({  
            status: false,
            message: error.message
        })
    }
}