/** load library express */
const express = require(`express`)
const app = express()

/** allow to read another file */
app.use(express.json())

/** load controller of menu */
const userController = require(`../controllers/user.controller`)

/** create route */
app.post(`/user`, userController.addUser)
app.get(`/user`, userController.getUser)
app.post(`/user/find`, userController.findUser)
app.put(`/user/:id_user`, userController.updateUser)
app.delete(`/user/:id_user`, userController.deleteUser)

/** epxort module nya */
module.exports = app