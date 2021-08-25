const md5 = require('md5');

var crittografo = {};

crittografo.cryptPass = (password) => {

    return md5(password);

}

module.exports = crittografo; 