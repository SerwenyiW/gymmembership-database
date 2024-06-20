const express = require("express");
const app = express();
const path = require("path");
const db = require("./database");
const bodyParser = require("body-parser");

const currentDate = new Date();
const year = currentDate.getFullYear();
let month = currentDate.getMonth() + 1;
let day = currentDate.getDate();
month < 10 ? `0${month}` : month;
day < 10 ? `0${day}` : day;
let formattedday = `${year}.${month}.${day}`;
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.listen(8080, ()=>{
    console.log("Gym szerver fut!");
    db.all(`SELECT * FROM gym`, (err, rows) => {
        if (err) return;
        rows.forEach(row => {
            if (row.updated !== formattedday) {
                db.run(`UPDATE gym SET updated = '${formattedday}' WHERE name = ?`, [row.name]);
            }
            const daydiff = day - parseInt(row.ticketday.split(".")[2]);
            if (daydiff > 0) db.run(`UPDATE gym SET dayleft = ${row.dayleft - daydiff} WHERE name = ?`, [row.name]);
            if((row.dayleft - daydiff) <= 0) db.run(`DELETE FROM gym WHERE name = ?`, [row.name]);
        });
    });
});

app.get('/getUsers', (req, res) => {
    db.all("SELECT * FROM gym", (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "data":rows
        });
      });
});

app.post("/newuser", (req, res)=>{
    const username = req.body.user;
    const ticketType = req.body.tickettype;
    let leftday = ticketType === "1hetes" ? 7 : 30;
    db.run(`INSERT INTO gym VALUES (?,?,?,?,?)`, [username, ticketType, formattedday, leftday, formattedday]);
    res.redirect("/");
});

app.post("/deleteUser", (req, res)=>{
    const username = req.body.user;
    db.run(`DELETE FROM gym WHERE name = ?`, [username]);
    res.redirect("/");
});