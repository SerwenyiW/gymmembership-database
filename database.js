const sqlite3 = require("sqlite3").verbose();

let db = new sqlite3.Database("db.sqlite", (err)=>{
    if(err) {
        console.error(err);
        throw err;
    } else {
        console.log("gym adatbázis elindítva");
        db.run(`CREATE TABLE gym (
            name TEXT,
            tickettype TEXT,
            ticketday TEXT,
            dayleft INTEGER,
            updated TEXT
            )`, (err)=>{}
        );
    }
});

module.exports = db