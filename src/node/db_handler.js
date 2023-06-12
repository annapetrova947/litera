const mysql = require("mysql2")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "literaDB",
  password: "0123456789",
})

connection.connect((err) => {
  if (err) {
    return console.error(`Ошибка: ${err.message}`)
  }
  console.log("Подключение к серверу MySQL успешно установлено")
})
