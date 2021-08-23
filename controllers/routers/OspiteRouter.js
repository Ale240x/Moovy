const express = require('express');
const UtenteController = require("../UtenteController");

var router = express.Router();

/*router.use("", (req,res,next) =>{
    var user = req.session.utente; //utente non definito

    if(!user){
        next();  
    }
    else{
        res.redirect("/utente");
    }
});*/

router.get("", UtenteController.getSchermataIniziale);

//Regione Registrazione Cliente
router.get("/registrazione", UtenteController.getRegistrazioneCliente);
router.post("/registrazione", UtenteController.postRegistrazioneCliente);

//Regione Autenticazione
router.get("/autenticazione", UtenteController.getAutenticazione);
router.post("/autenticazione", UtenteController.postAutenticazione);

module.exports = router;