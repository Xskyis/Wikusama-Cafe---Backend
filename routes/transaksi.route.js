const express = require(`express`)
const app = express()

/** allow to read another file */
app.use(express.json())

/** load controller of menu */
const transaksiController = require(`../controllers/transaksi.controller`)

/** call authorization method */
const { authorization } = require('../controllers/auth.controller')

/** create route */
app.post(`/transaksi`, authorization(["admin", "kasir"]),transaksiController.addTransaksi)
app.get(`/transaksi`, authorization(["admin", "kasir"]),transaksiController.getTransaksi)
app.put(`/transaksi/:id_transaksi`, authorization(["admin", "kasir"]),transaksiController.updateTransaksi)
app.delete(`/transaksi/:id_transaksi`, authorization(["admin", "kasir"]),transaksiController.deleteTransaksi)

/** epxort module nya */
module.exports = app