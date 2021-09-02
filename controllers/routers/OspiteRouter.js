const express = require('express');
const OspiteController = require("../OspiteController");
const UtenteRouter = require("./UtenteRouter");

var router = express.Router();

router.use ("/utente", UtenteRouter);

router.use("", (req,res,next) =>{
    var user = req.session.utente; //utente non definito
    
    if(!user){
        next();  
    }
    else{
        res.redirect("/utente");
    }
});


router.get("", OspiteController.getSchermataIniziale);

//Regione Registrazione 
router.get("/registrazione", OspiteController.getRegistrazioneCliente);
router.post("/registrazione", OspiteController.postRegistrazioneCliente);

//Regione Autenticazione
router.get("/autenticazione", OspiteController.getAutenticazione);
router.post("/autenticazione", OspiteController.postAutenticazione);

//Regione Ricerca Veicolo
router.get("/TipoVeicoli", OspiteController.getRicercaTipoVeicoli);
router.get("/TipoVeicoli/FormA", OspiteController.getFormA);
router.post("/TipoVeicoli/FormA/RisultatiRicerca", OspiteController.postFormA);
router.get("/TipoVeicoli/FormA/RisultatiRicerca/:id/InfoVeicolo", OspiteController.getInfoVeicolo);
router.get("/TipoVeicoli/FormA/RisultatiRicerca/:id/InfoVeicolo/Riepilogo", OspiteController.getRiepilogo);

//Regione recupera password? e controllo codice nuova pass
// Da aggiungere AL CONTROLLER OSPITE/UTENTE NON SO!
router.get("/recuperaPass", OspiteController.getRecuperaPass);
router.post("/recuperaPass",OspiteController.postRecuperaPass);
router.post("/recuperaPass/codice", OspiteController.postCodice);
router.post("/recuperaPass/codice/nuovaPass", OspiteController.postNuovaPass);

module.exports = router;