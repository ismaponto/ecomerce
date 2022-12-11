const express = require('express')
const usersRouter = express.Router()
const db = require('../config/database');


usersRouter.get('/{userId}', (req, res) => {
    const userId = req.user.id;

    getInfouser(userId).then(userInfo => { return userInfo });

})

usersRouter.put('/{userId}', (req, res) => {
    const newUserValues = [req.body.user_name, req.body.user_surname, req.body.telephone, req.user.id]
    actualiceUser(newUserValues).then((res) => {
        return (res)
    })
})

const getInfouser = (id) => {
    db.query('SELECT user_name, user_surname, telephone from users where id=$1', [id], async(error, result) => {
        if (error) { console.log(error) } else
        if (result.tows.length > 0) {
            return result.rows
        } else return 'Something went wrong try again or contact us to  '
    })
}


const actualiceUser = (userName, userSurname, telephone, id) => {
    db.query('INSERT INTO users(user_name, user_surname, telephone) VALUES ($1, $2, $3) WHERE id=$4', [userName, userSurname, telephone, id], async(error, result) => {
        if (error) {
            console.log(error)
        } else if (result.rows.length > 0) {
            console.log('actualiceuser' + result.rows)
            return result.rows
        } else return `something fail, please try again`
    })
}




module.exports = usersRouter

// GET /users
// GET /users/{userId}
// PUT /users/{userId}