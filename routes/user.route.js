/** load library express */
const express = require(`express`)
const app = express()

/** allow to read another file */
app.use(express.json())

/** load controller of menu */
const userController = require(`../controllers/user.controller`)

/** call authorization method */
const { authorization } = require('../controllers/auth.controller')

/** create route */
app.post(`/user`,  authorization(["admin","kasir","manajer"]),userController.addUser)
app.get(`/user`,  authorization(["admin","kasir","manajer"]),userController.getUser)
app.post(`/user/find`,  authorization(["admin","kasir","manajer"]),userController.findUser)
app.put(`/user/:id_user`,  authorization(["admin", "kasir","manajer"]),userController.updateUser)
app.delete(`/user/:id_user`,  authorization(["admin", "kasir","manajer"]),userController.deleteUser)

/** epxort module nya */
module.exports = app