const express = require('express');

const OspiteRouter = require("./OspiteRouter");
const UtenteRouter = require("./UtenteRouter");

var router = express.Router();

/*router.use("", (req, res, next) =>{
    var locals = res.locals;
    locals.alert =req.session.alert; //alert non è definito
    delete req.session.alert;  //delete??
    next();
});*/
//radice reinderizza o a ospite o utente
router.use("/", OspiteRouter);
router.use ("/utente", UtenteRouter);

/*router.get("", (req,res) => {

    res.redirect("/");
});*/

module.exports = router;