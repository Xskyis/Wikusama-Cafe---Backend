/** call json web token */
const jwt = require(`jsonwebtoken`)

const md5 = require(`md5`)

/** load model user */
const userModel = require(`../models/index`).user

async function verifyToken(token) {
    try {
        let secretKey = 'Kadrun123'
        let decode = jwt.verify(token, secretKey)
        return true
    } catch (error) {
        return false
    }
}

exports.authentication = async (request, response) => {
    try {
        /** grab username & password */
        let params = {
            username: request.body.username,
            password: md5(request.body.password)
        }

        /** check user exist */
        let result = await userModel.findOne(
            {
                where: params
            }
        )

        /** validate result */
        if (result) {
            /** if user has exist, generate token*/
            /** define secret key of JWT */
            let secretKey = 'Kadrun123'
            /** define header of jwt */
            let header = {
                algorithm: "HS256"
            }
            /** define payload */
            let payload = JSON.stringify(result)
            /** do generate token using JWT */
            let token = jwt.sign(payload, secretKey, header)

            /** give a respon  */
            return response.json({
                status: true,
                token: token,
                message: `Login Berhasil`,
                data: result
            })
        } else {
            /** if user doesnt exist */
            /** give a response */
            return response.json({
                status: false,
                message: `Invalid username or password!`
            })
        }
    } catch (error) {
        return response.json({
            status: false,
            message: error.message
        })
    }
}

exports.authorization = (roles) => {
    return async function (request, response, next) {
        try {
            /** grab data */
            let headers = request.headers.authorization

            /** grab data token */
            /** bearer KkwjKk9287 (Example) */
            let token = headers?.split(" ")[1] /** "?" digunakan untuk antisipasi jika data undefined/null */
            /** string digunakan untuk memecah string menjadi array */

            if (token == null) {
                return response.status(401).json({
                    status: false,
                    message: "Unauthorized User!"
                })
            }

            /** verify token */
            if (! await verifyToken(token)) {
                return response.
                    status(401).
                    json({
                        status: false,
                        message: 'INVALID TOKEN'
                    })

            }

            /** decrypt token to plain text */
            let plainText = jwt.decode(token)

            /** check allowed roles */
            if (!roles.includes(plainText?.role)) {
                return response.status(403).json({
                    status: false,
                    message: 'Forbidden Access!'
                })
            }
            
            next()

        } catch (error) {
            return response.json({
                status: false,
                message: error.message
            })
        }
    }
}






