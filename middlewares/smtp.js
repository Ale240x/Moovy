const nodemailer = require('nodemailer');

var middleware = {};

middleware.options = {
    service: 'gmail',
    auth: {
        user: 'moovyprogetto@gmail.com',
        pass: 'Progetto@10'
    }
};

middleware.transporter = nodemailer.createTransport(middleware.options);

module.exports = middleware;