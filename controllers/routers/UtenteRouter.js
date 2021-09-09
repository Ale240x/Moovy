const express = require('express');
const OspiteRouter =require("./OspiteRouter");
const ClienteRouter = require("./ClienteRouter");
const AmministratoreRouter = require("./AmministratoreRouter");
const AutistaRouter = require("./AutistaRouter");
const AddettoRouter = require("./AddettoRouter");


var router = express.Router();

router.use("", (req, res, next) =>{
    var utente = req.session.utente;
    var pre = req.session.prenotazione;
    var locals = res.locals;

    if(utente){
        locals.utente = utente;
        next();  
    }
    else{
        res.redirect("/autenticazione"); //se invece facciamo redirect a /autenticazione ?
    }
});


//rotte di  Router
router.use("/cliente", ClienteRouter);
router.use("/amministratore", AmministratoreRouter);
router.use("/addetto", AddettoRouter);
router.use("/autista", AutistaRouter);

router.get("", (req,res) =>{

  //  console.log(req.session.utente[0].ruolo);

    if(req.session.utente[0].ruolo == 'Cliente'){
    
        res.redirect("/utente/cliente");
    }
    else if(req.session.utente[0].ruolo=='Amministratore'){
        res.redirect("/utente/amministratore");

    }else if(req.session.utente[0].ruolo=='Autista'){
        res.redirect("/utente/autista");
    }else 
        res.redirect("/utente/addetto");
});
 
module.exports = router;

