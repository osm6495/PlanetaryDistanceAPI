const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./db.sqlite3');
const {generateSecretHash} = require('../utils/apiKey');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, api_key_hash TEXT, disallowed_routes TEXT)");
});

function registerHash(hash){
    db.run("INSERT INTO users (api_key_hash) VALUES (?)", [hash]);
}

function getHashes(callback){
    const query = 'SELECT api_key_hash FROM users';

    db.all(query, [], (err, rows) => {
    if (err) {
        console.error('Error getting hashes from DB: ', err.message);
        callback(err, null);
    } else {
        const keyHashes = rows.map(row => row.key_hash);
        callback(null, keyHashes);
    }
    });
}

function getRoutes(hash, callback){
    const query = "SELECT disallowed_routes FROM users WHERE (api_key_hash) = (?)";

    db.run(query, [hash], (err, row) => {
        if (err) {
            console.error('Error getting allowed routes from DB: ', err.message);
            callback(err, null);
        } else {
            callback(null, row.disallowed_routes);
        }
    });
}

process.on('exit', () => {
    db.close(err => {
      if (err) {
        return console.error('Error closing database: ', err.message);
      }
      console.log('Closed the SQLite database connection.');
    });
});

module.exports = {db, registerHash, getHashes, getRoutes};