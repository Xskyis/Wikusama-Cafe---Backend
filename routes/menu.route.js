/** load library express */
const express = require(`express`)
const app = express()

/** allow to read another file */
app.use(express.json())

/** load controller of menu */
const menuController = require(`../controllers/menu.controller`)

/** create route */
app.post(`/menu`, menuController.addMenu)
app.get(`/menu`, menuController.getMenu)
app.post(`/menu/find`, menuController.findMenu)
app.put(`/menu/:id_menu`, menuController.updateMenu)
app.delete(`/menu/:id_menu`, menuController.deleteMenu)

/** epxort module nya */
module.exports = app