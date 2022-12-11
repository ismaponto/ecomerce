const express = require('express')
const productsRouter = express.Router()
const db = require('../config/database');


productsRouter.get('/', (req, res) => {
    getAllProducts().then((res) => {
        return (res)
    })

})

productsRouter.get('/{productsid}', (req, res) => {
    getProductByid().then((res) => {
        return (res)
    })
})

productsRouter.get('/products?category=categoryId', (req, res) => {
    getProductbyCategory().then((res) => {
        return (res)
    })
})



const getAllProducts = () => {
    db.query('SELECT * FROM products', async(error, result) => {
        if (error) {
            console.log(error)
        } else
        if (result.rows.length > 0) { return result.rows } else return ('There is not products available')
    })
}

const getProductByid = (id) => {
    db.query('SELECT * FROM products WHERE id=$1', [id], async(error, result) => {
        if (error) {
            console.log(error)
        } else
        if (result.rows.length > 0) { return result.rows } else return `Product with id=${id} is not available}`
    })
}

const getProductbyCategory = (category) => {
    db.query('SELECT * FROM products WHERE product_category_id=$1', [category], async(error, result) => {
        if (error) {
            console.log(error)
        } else
        if (result.rows.length > 0) { return result.rows } else return `Product with category=${category} is not available`

    })
}




module.exports = productsRouter