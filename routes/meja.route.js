/** load libray express */
const express = require(`express`)
const app = express()

/** allow to read a request with json type */
app.use(express.json())

/** load controller meja */
const mejaController = require(`../controllers/meja.controller`)

/** call authorization method */
const { authorization } = require('../controllers/auth.controller')

/** route to get all data meja */
app.get(`/meja`, authorization(["admin", "kasir", "manajer"]), mejaController.getMeja)
app.get(`/meja/avail`, authorization(["admin", "kasir","manajer"]),mejaController.availableMeja)
app.post(`/meja`, authorization(["admin", "kasir", "manajer"]),mejaController.addMeja)
app.put(`/meja/:id_meja`, authorization(["admin", "kasir","manajer"]),mejaController.updateMeja)
app.delete(`/meja/:id_meja`, authorization(["admin", "kasir", "manajer"]),mejaController.deleteMeja)

/** export app objet */
module.exports = app