//
// GPS Development Configuration
//


//
// CONFIG
//


// Database name.
// exports.db_name = 'gps';
//
// // Database connection string.
// exports.db_connect_str = 'localhost:5432';
//
// exports.cn = {
//     host: 'localhost',
//     port: 5432,
//     database: 'gps',
//     user: 'gps',
//     password: 'gps-tracks'
// };


let jsonfile =require('jsonfile');                        // Reading and writing JSON files.
let secrets = jsonfile.readFileSync('../../secrets.json');

exports.secretResetKey = secrets.passwordReset;
console.log(secrets.servicesRoot)
exports.java_be = secrets.servicesRoot ||  'https://test.goopti.com/tracker';
