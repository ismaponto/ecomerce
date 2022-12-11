const express = require('express')
const cartsRouter = express.Router()
const db = require('../config/database');


cartsRouter.get('/', (req, res) => {
    const userId = req.user.id;

    db.query('SELECT * FROM cart WHERE user_id = $1', [userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        const items = result.rows;

        res.render('cart', {
            items: items
        });
    });
});

cartsRouter.post('/cart', (req, res) => {
    const item = req.body.item;
    const userId = req.user.id;

    createCart();
});


cartsRouter.post('/', (req, res) => {
    insertCartItems(req.body);
    const cartId = [req.sessionId]
    res.send(cartId)
})

cartsRouter.put('/:cartId', (req, res) => {
    // Update the carts_items with the given ID
    const cartId = req.params.cartId
    const data = req.body
    updateCartWithData(cartId, data);
    uptdateTotalCart();
    res.send('Cart updated successfully')
})


cartsRouter.post('/{cartID}/checkouit', (req, res) => {
    const userId = req.user.id;
    db.query('SELECT * FROM carts_items WHERE user_id = $1', [userId], (err, result) => {
        if (err) {
            return res.status(500).send(err);
        }

        const items = result.rows;
        return items

    }).then(response => {
        let i = 0;
        for (i < response.length, i++) {
            db.query(`INSERT INTO order_items
        SET id= $1 quantity = $2 product_id=$3, order_details = $4, product_id =$5 `, response[i], (err, result) => {

                if (err) {
                    return res.status(500).send(err)
                } else {

                    return `producto ${i} agregado a la orden`
                }
            })
        }
    })
})


// POST /cart/{cartId}/checkout

async function insertCartItems(data) {
    // create a new cart with the provided data
    const query = `
      INSERT INTO carts_item
      SET product_id = $1, quantity = $2, user_sessions_id = $3
    `
    const values = [data.items, data.total, req.user.id]

    db.query(query, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log('Cart CREATED successfully')
        }
    })
}



async function updateCartWithData(cartId, data) {
    // Update the cart with the provided data
    const query = `
      UPDATE carts_item
      SET product_id = $1, quantity = $2, user_sessions_id = $3
      WHERE id = $4
    `
    const values = [data.items, data.total, req.sessionId, cartsId]
    db.query(query, values, (err, res) => {
        if (err) {
            console.log(err.stack)
        } else {
            console.log('Cart updated successfully')
        }
    })
    uptdateTotalCart();
}

async function uptdateTotalCart(cartId) {

    const query = `
    SELECT * FROM cart_item
    WHERE user_sessions_id = $1
  `
    const values = [req.sessionId]
    db.query(query, values, (err, res) => {
        if (err) console.log(err.stack)
        else {
            console.log('calcular, total')
        }
        // let reduce = personas.reduce((acumulador, actual) => acumulador.edad + actual.edad);
        // console.log(reduce)
    })
}




module.exports = {
    cartsRouter
}