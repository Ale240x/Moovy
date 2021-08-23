const express = require('express');
const ClienteRouter = require("./ClienteRouter");
const AmministratoreRouter = require("./AmministratoreRouter");
const AutistaRouter = require("./AutistaRouter");
const AddettoRouter = require("./AddettoRouter");
const { response } = require('express');
var router = express.Router();

router.use("", (req, res, next) =>{
    var utente = req.session.utente;
    var locals = res.locals;
  

    if(utente){
        locals.utente = utente;
       

        next();  
    }
    else{
        res.redirect("/");
    }
});

//rotte di  Router
router.use("/cliente", ClienteRouter);
router.use("/amministratore", AmministratoreRouter);
router.use("/addetto", AddettoRouter);
router.use("/autista", AutistaRouter);

router.get("", (req,res) =>{

    if(req.session.utente.ruolo == 'cliente'){
        res.redirect("/utente/cliente");
    }
    else if(req.session.utente.ruolo=='amministratore'){
        res.redirect("/utente/amministratore");
    }else if(req.session.utente.ruolo=='autista'){
        res.redirect("/utente/autista");
    }else 
        res.redirect("/utente/addetto");
});
 
module.exports = router;

