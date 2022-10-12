require('dotenv').config({ path: './config.env' })
const { createConnection } = require('mysql')
const express = require('express')


const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set("view engine", "ejs")


const MysqlConnection = createConnection({
    host: 'localhost',
    user: 'root',
    password: '4578',
    database: 'studentinfo'
})







//#########################################- Route -#############################################



// GET
app.get('/', (req, res) => {
    MysqlConnection.query('SELECT * FROM students', (error, rows, fields) => {
        if (error) throw error
        res.render('index', { title: 'crud application using nodejs and mysql', data: rows })
    })
})

app.get('/add-user', (req, res) => {
    res.render('add-user', { title: 'Add User' })
})

app.get('/edite/:id', (req, res) => {
    MysqlConnection.query(`SELECT * FROM students WHERE StudentID = ${req.params.id}`, (error, rows, fields) => {
        if (error) throw error
        res.render('edit-user', { title: 'Edit User', data: rows })
    })
})

//* Delete User
app.get('/delete/:id', (req, res) => {
    MysqlConnection.query(`DELETE FROM students WHERE StudentID = ${req.params.id}`, (error, rows, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})




// POST -> Add User
app.post('/addUser', (req, res) => {
    const { FirstName, LastName, Age, Email, Password, Country } = req.body
    let data = { FirstName, LastName, Age, Email, Password, Country }

    MysqlConnection.query('INSERT INTO students SET ?', data, (error, rows, fields) => {
        if (error) throw error
        res.redirect('/')
    })
})




// Update -> Edit User
app.post('/updateUser', (req, res) => {
    const { StudentID, FirstName, LastName, Age, Email, Password, Country } = req.body

    const query = 'UPDATE students ' +
        'SET FirstName = ?, LastName = ?, Age = ?, Email = ?, Password = ?, Country = ?' +
        'WHERE StudentID = ?';
    const values = [FirstName, LastName, Age, Email, Password, Country, StudentID]


    MysqlConnection.query(query, values, (error, result) => {
        if (error) throw error
        res.redirect('/')
    })
})



//#########################################- Route -#############################################







const PORT = process.env.PORT || 5001
app.listen(PORT, () => console.log(`http://localhost:${PORT}`)).on('error', (error) => console.error('listen Error: ' + error))
