const express = require('express')
const mysql = require('mysql')
const cors = require('cors')
var bodyParser = require('body-parser');
const TokenGenerator = require('uuid-token-generator');

const tokgen25662 = new TokenGenerator(256, TokenGenerator.BASE62) 
const tokgen51262 = new TokenGenerator(512, TokenGenerator.BASE62) 
const app = express()

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "iNCZuJy7DyJ6Quv",
    database : "mech_db",
    insecureAuth : true
  });

const main_token = 'QNHMwSXwmnznTy7U5zFM9LamqkHn7HCncezPyVzAmECrJGgD3nbyhQ6JvA5CwPDP24EbEjk3q6HX8g8qtNYupBwwp88FX8XXKwe5'

app.get('/api/user/all', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        
        if(auth_key === main_token)
        {
            con.query('SELECT * FROM mech_db.users', function (err, result, fields) {
                if (err) throw err
                res.status(200).json(result[0])
                return
              })
            return
        }
        else{
            res.status(403).json({message: 'Forbidden access'})
            return
        }
        
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})
app.get('/api/order/done', (req, res) => {
    console.log(12121)
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1;`, (err, result, fields) =>{
            if(result.length > 0){
                
                con.query(`UPDATE orders SET status='done' WHERE accepted_id = '${result[0].id}' AND status='accepted';`, (err, result2, fields) =>{
                    if (err) throw err
                    
                    res.status(200).json({message: 'Success'})
                    return
                })
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
            }
            return
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/user/', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT * FROM mech_db.users WHERE auth_key='${auth_key}'`, function (err, result, fields) {
            if (err) throw err
            if(result.length > 0)
            {
                if(auth_key === result[0].auth_key){
                    res.status(200).json(result[0])
                    return
                }
                else{
                    res.status(403).json({message: 'Forbidden access'})
                    return
                }
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return 
            }
                
        })
        
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.put('/api/user/', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT auth_key FROM users WHERE auth_key = '${auth_key}';`, function (err, result, fields) {
            if (err) throw err
            
            if(result.length > 0)
            {
                if(auth_key === result[0].auth_key){
                    const user_data = {
                        firstname: req.body.firstname,
                        lastname: req.body.lastname,
                        email: req.body.email,
                        phone: req.body.phone
                    }
                    // console.log(user_data)
                    con.query(`UPDATE users SET firstname='${user_data.firstname}', lastname='${user_data.lastname}', email='${user_data.email}', phone='${user_data.phone}' WHERE auth_key='${auth_key}'`, function (err, result, fields) {
                        if (err) throw err
                        res.status(200).json({message: 'Successfully changed'})
                        return
                    })
                    return
                }
                else{
                    res.status(403).json({message: 'Forbidden access'})
                    return
                }
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return 
            }    
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
    
})

app.get('/api/order/accept/:id/:vehicle_id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1;`, function (err, result, fields) {
            if (err) throw err
            
            if(result.length > 0)
            {
                con.query(`UPDATE orders SET accepted_id = '${result[0].id}', status = 'accepted', accepted_vehicle_id = ${req.params.vehicle_id} WHERE id = ${req.params.id};`, function (err, result, fields) {
                    // if(err) throw err
                    res.status(200).json({message: 'Success'})
                    return 
                })
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return 
            }    
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.post('/api/user', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        if(auth_key === main_token)
        {
            const user_data = {
                id: tokgen25662.generate(),
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email: req.body.email,
                password: req.body.password,
                phone: req.body.phone,
                auth_key: tokgen51262.generate()
            }

            console.log(user_data)
            
            con.query(`INSERT INTO mech_db.users VALUES ("${user_data.id}", "${user_data.firstname}", "${user_data.lastname}", "${user_data.email}", "${user_data.password}", "${user_data.phone}", NOW(), "${user_data.auth_key}", 0)`, function (err, result, fields) {
                if (err) throw err
                res.status(200).json({auth_key: user_data.auth_key})
                return
            })
            
            return
        }
        else{
            res.status(403).json({message: 'Forbidden access'})
            return
        }
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
    
})

app.delete('/api/user/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query('SELECT auth_key FROM mech_db.users WHERE id="'+req.params.id+'"', function (err, result, fields) {
            if (err) throw err
            if(result.length > 0)
            {
                if(auth_key === result[0].auth_key){
                    con.query('DELETE FROM mech_db.users WHERE id="'+req.params.id+'"', function (err, result, fields) {
                        if (err) throw err
                        res.status(200).json({message: 'User deleted'})
                        return
                    })
                    return
                }
                else{
                    res.status(403).json({message: 'Forbidden access'})
                    return
                }
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return 
            }
                
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/order/all', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, function (err, result, fields) {
            if(result.length > 0){
                con.query('SELECT * FROM orders', function (err, result, fields)
                {
                    res.status(200).json(result)
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
            
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/orders', (req,res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, function (err, result, fields) {
            if (err) throw err
            if(result.length > 0){
                con.query(`SELECT * FROM orders WHERE user_id = '${result[0].id}' ORDER BY id DESC`, function (err, result2, fields)
                {
                    res.status(200).json(result2)
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/order/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, function (err, result, fields) {
            if (err) throw err
            if(result.length > 0){
                con.query(`SELECT * FROM orders WHERE id = '${req.params.id}'`, function (err, result2, fields)
                {
                    res.status(200).json(result2)
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.post('/api/order', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if(result.length > 0){
                const order_data = {
                    location: req.body.location,
                    description: req.body.description,
                    vehicle: req.body.vehicle,
                    vehicle_number: req.body.vehicle_number,
                    user_id: result[0].id
                }
                con.query(`INSERT INTO orders(location, description, vehicle, vehicle_number, user_id, date, status) VALUES ('${order_data.location}', '${order_data.description}', '${order_data.vehicle}', '${order_data.vehicle_number}', '${order_data.user_id}', NOW(), 'active')`, function (err, result2, fields)
                {
                    if(err) throw err
                    res.status(200).json({message: 'Order created'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.put('/api/order/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if(result.length > 0){
                const order_data = {
                    location: req.body.location,
                    description: req.body.description,
                    vehicle: req.body.vehicle,
                    vehicle_number: req.body.vehicle_number
                }
                con.query(`UPDATE orders SET location='${order_data.location}', description='${order_data.description}', vehicle='${order_data.vehicle}', vehicle_number='${order_data.vehicle_number}' WHERE id = '${req.params.id}'`, function (err, result2, fields)
                {
                    if(err) throw err
                    res.status(200).json({message: 'Order updated'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.post('/api/authentification', (req, res) => {
    console.log(req.body)
    if(req.body !== 'undefined'){  
        console.log(req.body)
        con.query(`SELECT auth_key FROM users WHERE email = '${req.body.email}' AND password = '${req.body.password}'`, (err, result, fields) =>{
            if(result.length > 0)
            {
                
                res.status(200).json({auth_key: result[0].auth_key})
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
        }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.delete('/api/order/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if(result.length > 0){
                con.query(`DELETE FROM orders WHERE user_id = '${result[0].id}' AND id=${req.params.id}`, (err, result2, fields) =>{
                    if (err) throw err  
                    if(result2.affectedRows > 0){
                        res.status(200).json({message: 'Order deleted'})
                    }
                    else{
                        res.status(403).json({message: 'Forbidden access'})
                    }
                    return
                })
                return
            }   
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/vehicle/driver', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`
        SELECT vehicle.model as model, vehicle.numbers as numbers, vehicle.id as id
        FROM vehicle 
        INNER JOIN users
        ON vehicle.user_id = users.id 
        WHERE users.auth_key = '${auth_key}' AND vehicle.mech = 0`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                res.status(200).json(result)
                return
            }
            else{
                res.status(200).json([{message: 'No vehicle found'}])
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.post('/api/vehicle/driver', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`SELECT id FROM vehicle WHERE user_id = '${result[0].id}' AND mech = 0`, (err, result2, fields) =>{
                    if(result2.length < 5){
                        con.query(`INSERT INTO vehicle(model, numbers, mech, user_id) VALUES ('${req.body.model}', '${req.body.numbers}', 0, '${result[0].id}')`, (err, result2, fields) =>{
                            if(err) throw err
                            res.status(200).json({message: 'Vehicle added'})
                            return
                        })   
                        return    
                    }
                    else{
                        res.status(403).json({message: 'Too many items'})
                        return
                    }
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.put('/api/vehicle/driver/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`UPDATE vehicle SET model = '${req.body.model}', numbers = '${req.body.numbers}' WHERE user_id = '${result[0].id}' AND id = ${req.params.id}`, (err, result2, fields) =>{
                    if (err) throw err
                    res.status(200).json({message: 'Changed successfully'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.delete('/api/vehicle/driver/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}'`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`DELETE FROM vehicle WHERE user_id = '${result[0].id}' AND id = ${req.params.id}`, (err, result2, fields) =>{
                    if (err) throw err
                    res.status(200).json({message: 'Deleted successfully'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/vehicle/mechanic', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, (err, result2, fields) =>{
            if(err) throw err
            if(result2.length > 0){
                con.query(`
                SELECT vehicle.model as model, vehicle.numbers as numbers, vehicle.id as id
                FROM vehicle 
                INNER JOIN users
                ON vehicle.user_id = users.id 
                WHERE users.auth_key = '${auth_key}' AND vehicle.mech = 1`, (err, result, fields) =>{
                    if (err) throw err
                    if(result.length > 0){
                        res.status(200).json(result)
                        return
                    }
                    else{
                        res.status(200).json([{message: 'No vehicle found'}])
                        return
                    }
                })
            }
            else{
                res.status(403).json({message: 'Account not paid'})
                return
            }
                
            })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})



app.post('/api/vehicle/mechanic', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`SELECT id FROM vehicle WHERE user_id = '${result[0].id}' AND mech = 1`, (err, result2, fields) =>{
                    if(result2.length < 5){
                        con.query(`INSERT INTO vehicle(model, numbers, mech, user_id) VALUES ('${req.body.model}', '${req.body.numbers}', 1, '${result[0].id}')`, (err, result2, fields) =>{
                            if(err) throw err
                            res.status(200).json({message: 'Vehicle added'})
                            return
                        })   
                        return    
                    }
                    else{
                        res.status(403).json({message: 'Too many items'})
                        return
                    }
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.put('/api/vehicle/mechanic/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`UPDATE vehicle SET model = '${req.body.model}', numbers = '${req.body.numbers}' WHERE user_id = '${result[0].id}' AND id = ${req.params.id}`, (err, result2, fields) =>{
                    if (err) throw err
                    res.status(200).json({message: 'Changed successfully'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})
app.delete('/api/vehicle/mechanic/:id', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, (err, result, fields) =>{
            if (err) throw err
            if(result.length > 0){
                con.query(`DELETE FROM vehicle WHERE user_id = '${result[0].id}' AND id = ${req.params.id}`, (err, result2, fields) =>{
                    if (err) throw err
                    res.status(200).json({message: 'Deleted successfully'})
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})



app.get('/api/orders/accepted', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1;`, (err, result, fields) =>{
            if(result.length > 0){
                con.query(`SELECT * FROM orders WHERE accepted_id = '${result[0].id}' AND status='accepted';`, (err, result2, fields) =>{
                    if (err) throw err
                    res.status(200).json(result2[0])
                    
                    return
                })
            }
            return
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/orders/accepted/history', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1;`, (err, result, fields) =>{
            if(result.length > 0){
                con.query(`SELECT * FROM orders WHERE accepted_id = '${result[0].id}'`, (err, result2, fields) =>{
                    if(err) throw err
                    res.status(200).json(result2)
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.get('/api/orders/non-accepted', (req, res) => {
    const auth_key = req.get('Akey')
    if(auth_key !== 'undefined'){
        con.query(`SELECT id FROM users WHERE auth_key = '${auth_key}' AND paid = 1`, (err, result, fields) =>{
            if(result.length > 0){
                con.query(`SELECT * FROM orders WHERE status='active'`, (err, result2, fields) =>{
                    if(err) throw err
                    res.status(200).json(result2)
                    return
                })
                return
            }
            else{
                res.status(403).json({message: 'Forbidden access'})
                return
            }
        })
        return
    }
    else{
        res.status(403).json({message: 'Forbidden access'})
        return
    }
})

app.listen(3002, () => console.log('Server is running on port 3002'))