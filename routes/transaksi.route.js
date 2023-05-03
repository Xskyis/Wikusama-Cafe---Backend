const express = require(`express`)
const app = express()

/** allow to read another file */
app.use(express.json())

/** load controller of menu */
const transaksiController = require(`../controllers/transaksi.controller`)

/** create route */
app.post(`/transaksi`, transaksiController.addTransaksi)
app.get(`/transaksi`, transaksiController.getTransaksi)
app.put(`/transaksi/:id_transaksi`, transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, transaksiController.deleteTransaksi)

/** epxort module nya */
module.exports = app