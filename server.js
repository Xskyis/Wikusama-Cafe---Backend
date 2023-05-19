/** load library */
const express = require(`express`)
const app = express()
const cors = require(`cors`)

/** use cors */
app.use(cors())

/** define port */
const PORT = 8080

/** load a route of */
const mejaRoute = require(`./routes/meja.route`)
const menuRoute = require(`./routes/menu.route`)
const userRoute = require(`./routes/user.route`)
const transaksiRoute = require(`./routes/transaksi.route`)
const authentication = require(`./routes/auth.route`)

/** Register route of */
app.use(mejaRoute)
app.use(menuRoute)
app.use(userRoute)
app.use(transaksiRoute)
app.use(authentication)

app.use(express.static(__dirname))

/** run sever */
app.listen(PORT, () => {    
    console.log(`Server run on port ${PORT}`)
})
