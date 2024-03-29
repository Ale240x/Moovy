const express = require('express');

const AmministratoreController = require("../amministratore/AmministratoreController");
const PrenotazioneAmministratoreController = require("../amministratore/PrenotazioneAmministratoreController");
const OspiteController = require("../OspiteController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente[0].ruolo == 'Amministratore'){
        next();  
    }
    else{
        res.redirect("/");
    }
});
// home
router.get("/", AmministratoreController.getSchermataIniziale);
router.get("/disconnetti", AmministratoreController.getDisconnetti);

//area personale amministratore
router.get("/AreaPersonaleAmministratore", AmministratoreController.getAreaPersonaleAmministratore);

//registrazione Impiegati
router.get("/AreaPersonaleAmministratore/registrazioneImpiegati",AmministratoreController.getRegistrazioneImpiegati);
router.post("/AreaPersonaleAmministratore/registrazioneImpiegati",AmministratoreController.postRegistrazioneImpiegati);

//modifica dati impiegati
router.get("/AreaPersonaleAmministratore/datiImpiegati",AmministratoreController.getDatiImpiegati);
router.get("/AreaPersonaleAmministratore/datiImpiegati/:id/modificaDatiImpiegati",AmministratoreController.getFormModifica);
router.post("/AreaPersonaleAmministratore/datiImpiegati/:id/modificaDatiImpiegati",AmministratoreController.postFormModifica);

//elimina account
router.get("/AreaPersonaleAmministratore/datiAccounts",AmministratoreController.getFormFiltraggio);
router.post("/AreaPersonaleAmministratore/datiAccounts",AmministratoreController.postFormFiltraggio);
router.get("/AreaPersonaleAmministratore/datiAccounts/:id/eliminaAccount",AmministratoreController.getDatiAccount);


//gestione prenotazione
router.get("/AreaPersonaleAmministratore/prenotazioniAttive",PrenotazioneAmministratoreController.getElencoPrenotazioniAttive );
router.get("/AreaPersonaleAmministratore/prenotazioniAttive/:id", PrenotazioneAmministratoreController.getInfoPrenotAmm);
router.get("/AreaPersonaleAmministratore/prenotazioniAttive/:id/eliminaPrenotazione", PrenotazioneAmministratoreController.getCancellaPrenotazione);
router.get("/AreaPersonaleAmministratore/prenotazioniAttive/:id/modificaPrenotazione", PrenotazioneAmministratoreController.getModificaPrenotazione);
router.post("/AreaPersonaleAmministratore/prenotazioniAttive/:id/modificaPrenotazione",PrenotazioneAmministratoreController.postModificaPrenotazione);

//rimborso
router.get("/AreaPersonaleAmministratore/rimborso", PrenotazioneAmministratoreController.getElencoPrenotAmm);
router.get("/AreaPersonaleAmministratore/rimborso/:id/effettuaRimborso", PrenotazioneAmministratoreController.getRimborso);
router.post("/AreaPersonaleAmministratore/rimborso/:id/effettuaRimborso/effettuato", PrenotazioneAmministratoreController.postRimborso);






module.exports= router;