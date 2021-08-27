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

//Regione Registrazione 
router.get("/registrazione", UtenteController.getRegistrazioneCliente);
router.post("/registrazione", UtenteController.postRegistrazioneCliente);

//Regione Autenticazione
router.get("/autenticazione", UtenteController.getAutenticazione);
router.post("/autenticazione", UtenteController.postAutenticazione);

//Regione recupera password? e controllo codice nuova pass
// Da aggiungere AL CONTROLLER OSPITE/UTENTE NON SO!
router.get("/recuperaPass", UtenteController.getRecuperaPass);
router.post("/recuperaPass",UtenteController.postRecuperaPass);
router.post("/recuperaPass/codice", UtenteController.postCodice);
router.post("/recuperaPass/codice/nuovaPass", UtenteController.postNuovaPass);

module.exports = router;