import express from 'express';
import path from 'path'
import { connection as db } from './config/index.js'
import { createToken } from './middleware/AuthenticateUser.js'
import { hash } from "bcrypt"
import bodyParser from 'body-parser'

// create an express app
const app = express()
const port = +process.env.PORT || 4000
const router = express.Router()
// middleware
app.use(
    router,
    express.static('./static'),
    express.json(),
    express.urlencoded({ extended: true })
)
router.use(bodyParser.json())
//Endpoint
router.get('^/$|/eShop', (req, res) => {
    res.status(200).sendFile(path.resolve('./static/html/index.html'))
})
router.get('/users', (req, res) => {
    try {
        const strQry = `
        SELECT firstName, lastName, age,
        emailAdd, userRole, ProfileURL
        FROM Users
        ` //WHERE userID = 1;
        db.query(strQry, (err, results) => {
            if (err) throw new Error(`Unable to fetch all users`)
            res.json({
                status: res.statusCode,
                results
            })
        })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
router.post('/register', async (req, res) => {
    try {
        let data = req.body
        data.pwd = await hash(data.pwd, 12)
        //Payload
        let user = {
            emailAdd: data.emailAdd,
            pwd: data.pwd
        }
        let strQry = `
        INSERT INTO Users
        SET ?;
        `
        db.query(strQry, [data], (err) => {
            if (err) {
                res.json({
                    status: res.statusCode,
                    msg: "This email has already been taken"
                })
            } else {
                const token = createToken(user)
                res.json({
                    token,
                    msg: "You are now registered."
                })
            }
        })
    } catch (e) {
    }
})
router.get('/users/:id', (req, res) => {
    try {
        const strQry = `
        SELECT firstName, lastName, age,
        emailAdd, userRole, ProfileURL
        FROM Users
        WHERE userID = ${req.params.id}
        `
        db.query(strQry, (err, result) => {
            if (err) throw new Error("Issue when retrieving a user")
            res.json({
                status: res.statusCode,
                result
            })
        })
    } catch (e) {
        res.json({
            status: 404,
            msg: e.message
        })
    }
})
router.patch('/user/:id', async (req, res) => {
    try {
        let data = req.body
        if (data.pwd) {
            data.pwd = await hash(data.pwd, 12)
        }
        const strQry = `
    UPDATE Users
    SET ?
    WHERE userID = ${req.params.id};
    `
        db.query(strQry, [data], (err) => {
            //"Unable to update user"
            if (err) throw new Error(err)
            res.json({
                status: res.statusCode,
                msg: "User updated"
            })
        })
    } catch (e) {
        res.json({
            status: 400,
            msg: e.message
        })
    }
})

router.delete('/user/:id', (req, res) => {
    try {
        const strQry = `
        DELETE FROM Users
        WHERE userID = ${req.params.id};
        `
        db.query(strQry, (err) => {
            if(err) throw new Error ('To delete a user, please review your delete query.')
                res.json ({
            status:res.statusCode,
            msg: 'A user\'s information was removed.'
            })
        })
    } catch(e) {
        res.json({
            status:404,
            msg: e.message
        })
    }
})

router.post('/login', (req, res) => {
    try {
        const { emailAdd, pwd} = req.body
        const strQry = `
        SELECT userID, firstName, lastName, age, emailAdd, pwd, userRole, ProfileURL
        FROM Users
        WHERE emailAdd = '${emailAdd}';
        `
        db.query(strQry, async(err, result) => {
            if(err) throw new Error ('To login, please review your query.')
                if(!result?.length) {
                    res.json (
                        {
                            status: 401,
                            msg: 'You provided a wrong email.'
                        }
                    )
                } else {
                    const isValidPass = await compare (pwd, result[0].pwd)
                    if(isValidPass) {
                        const token = createToken ({
                            emailAdd,
                            pwd
                        })
                        res.json ({
                            status: res.statusCode,
                            token,
                            result: result[0]
                        })
                    } else {
                        res.json ({
                            status: 401,
                            msg: 'Invalid password or you have not registered'
                        })
                    }
                }
        } )

    } catch(e) {
        res.json ({
            status: 404,
            msg: e.message
        })


    }
})

router.get('*', (req, res) => {
    res.json({
        status: 404,
        msg: 'Resource not found'
    })
})
app.listen(port, () => {
    console.log(`Server is running on ${port}`);
})