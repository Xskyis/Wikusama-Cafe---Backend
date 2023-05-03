/** load libray express */
const express = require(`express`)
const app = express()

/** allow to read a request with json type */
app.use(express.json())

/** load controller meja */
const mejaController = require(`../controllers/meja.controller`)

/** route to get all data meja */
app.get(`/meja`, mejaController.getMeja)
app.get(`/meja/avail`, mejaController.availableMeja)
app.post(`/meja`, mejaController.addMeja)
app.put(`/meja/:id_meja`, mejaController.updateMeja)
app.delete(`/meja/:id_meja`, mejaController.deleteMeja)

/** export app objet */
module.exports = app