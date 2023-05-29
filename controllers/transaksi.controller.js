const { request, response } = require("../routes/user.route")

/** load transaksi models */
const transaksiModel = require(`../models/index`).transaksi

/** load model of detail */
const detailModel = require(`../models/index`).detail_transaksi
const menuModel = require(`../models/index`).menu

const mejaModel = require(`../models/index`).meja

/** create & exprt func to add transaksi */
exports.addTransaksi = async (request, response) => {
    try {
        /** prepare data to add in transaksi */
        let newTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: `belum_bayar`
        }

        /** execute add transaksi  using model*/
        let insertTransaksi = await transaksiModel.create(newTransaksi)

        /** get the latest id of new transaksi */
        let latestID = insertTransaksi.id_transaksi

        /** insert last id in each of detail */
        let arrDetail = request.body.detail_transaksi /** assume that arr detail is array type */

        /** loop each arrDetail to insert last id
         * and insert harga
         */
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = latestID

            /** get selected menu based on id */
            let selectedMenu = await menuModel.findOne({
                where: { id_menu: arrDetail[i].id_menu }
            })

            // add harga in each of detail
            arrDetail[i].harga = selectedMenu?.harga /** ? => antisipasi jika menu = null */
        }

        /** execute insert detail transaksi
         * using models'`
         */

        await detailModel.bulkCreate(arrDetail)

        /** Update meja status */
        await mejaModel.update(
            { status: false },
            { where: { id_meja: request.body.id_meja } }
        );


        /** give a response */
        return response.json({
            status: true,
            message: `Data Transaksi Telah ditambahkan`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create & exprt to edit transaksi */
exports.updateTransaksi = async (request, response) => {
    try {
        /** get id will be upload */
        let id_transaksi = request.params.id_transaksi

        /** prepare data to upadte transaksi */
        let dataTransaksi = {
            tgl_transaksi: request.body.tgl_transaksi,
            id_user: request.body.id_user,
            id_meja: request.body.id_meja,
            nama_pelanggan: request.body.nama_pelanggan,
            status: request.body.status
        }

        /** execute update transaksi using model */
        await transaksiModel.update(
            dataTransaksi,
            { where: { id_transaksi: id_transaksi } }
        )

        /** execute delete all detail of selected transaksi */
        await detailModel.destroy({
            where: { id_transaksi: id_transaksi }
        })

        /** insert of new detail of transaksi */

        /** definitionite of arrdetaile from body.detail_transaksi */
        let arrDetail = request.body.detail_transaksi

        /** executing arr */
        for (let i = 0; i < arrDetail.length; i++) {
            arrDetail[i].id_transaksi = id_transaksi

            /** get selected menu based on id */
            let selectedMenu = await menuModel.findOne({
                where: { id_menu: arrDetail[i].id_menu }
            })

            // add harga in each of detail
            arrDetail[i].harga = selectedMenu?.harga /** ? => antisipasi jika menu = null */
        }

        /** insert new detail using model */
        await detailModel.bulkCreate(arrDetail)

        /** give respone */
        return response.json({
            status: true,
            message: `Data transaksi berhasil di update`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

/** create & export func to delete transaksi */
exports.deleteTransaksi = async (request, response) => {
    try {
        /** get id transaksi */
        let id_transaksi = request.params.id_transaksi

        /** execute delete detail using model */
        await detailModel.destroy({
            where: { id_transaksi: id_transaksi }
        })

        /** excute delete transaksi using model */
        await transaksiModel.destroy({
            where: { id_transaksi: id_transaksi }
        })

        /** Update status meja menjadi true */
        let transaksi = await transaksiModel.findOne({
            where: { id_transaksi: id_transaksi },
            include: [{ model: mejaModel }]
        })

        if (transaksi && transaksi.meja) {
            transaksi.meja.status = true
            await transaksi.meja.save()
        }

        /** give a response */
        return response.json({
            status: true,
            message: `Data transaksi telah dihapus`
        })

    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}


exports.getTransaksi = async (request, response) => {
    try {
        let result = await transaksiModel.findAll({
            include: [
                "meja",
                "user",
                {
                    model: detailModel,
                    as: "detail_transaksi",
                    include: ["menu"]
                }
            ],
            order: [['createdAt', 'DESC']] // Order by the 'createdAt' column in descending order
        })

        return response.json({
            status: true,
            data: result
        })

    } catch (error) {
        return response.json({
            status: true,
            message: error.message
        })
    }
}
