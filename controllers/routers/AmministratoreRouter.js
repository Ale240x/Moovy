const express = require('express');

const AmministratoreController = require("../amministratore/AmministratoreController");
const PrenotazioniAmministratoreController = require("../amministratore/PrenotazioneAmministratoreController");
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
// homepage accessibile a tutti
router.get("/", AmministratoreController.getSchermataIniziale);
router.get("/disconnetti", AmministratoreController.getDisconnetti);

//area personale amministratore
router.get("/AreaPersonaleAmministratore", AmministratoreController.getAreaPersonaleAmministratore);

//registrazione Impiegati
router.get("/AreaPersonaleAmministratore/registrazioneImpiegati",AmministratoreController.getRegistrazioneImpiegati);
router.post("/AreaPersonaleAmministratore/registrazioneImpiegati",AmministratoreController.postRegistrazioneImpiegati);

//modifica dati impiegati
router.get("/AreaPersonaleAmministratore/datiImpiegati",AmministratoreController.getDatiImpiegati);
//router.post("/AreaPersonaleAmministratore/datiImpigati",AmministratoreController.postDatiImpiegati);
router.get("/AreaPersonaleAmministratore/datiImpiegati/:id/modificaDatiImpiegati",AmministratoreController.getFormModifica);
router.post("/AreaPersonaleAmministratore/datiImpiegati/:id/modificaDatiImpiegati",AmministratoreController.postFormModifica);

//elimina account
router.get("/AreaPersonaleAmministratore/datiAccounts",AmministratoreController.getFormFiltraggio);
router.post("/AreaPersonaleAmministratore/datiAccounts",AmministratoreController.postFormFiltraggio);
router.get("/AreaPersonaleAmministratore/datiAccounts/:id/eliminaAccount",AmministratoreController.getDatiAccount);
router.post("/AreaPersonaleAmministratore/datiAccounts/:id/eliminaAccount",AmministratoreController.postDatiAccount);

//gestione prenotazione
/*router.get("/prenotazioniAttive", PrenotazioniAmministratoreController.getElencoPrenotazioniAttive);
router.post("/prenotazioneAttive",PrenotazioniAmministratoreController.postElencoPrenotazioniAttive);
router.get("/prenotazioniAttive/infoPrenotazione/:id", PrenotazioniAmministratoreController.getInfoPrenotAmm);
router.get("/prenotazioneAttive/infoPrenotazione/:id/eliminaPrenotazione",PrenotazioniAmministratoreController.getCancellaPrenotazione);
router.get("/prenotazioniAttive/infoPrenotazione/:id/modificaPrenotazione", PrenotazioniAmministratoreController.getDatiPrenotAmm);
router.post("/prenotazioneAttive/infoPrenotazione/:id/modificaPrenotazione",PrenotazioniAmministratoreController.postDatiPrenotAmm);

//rimborso
router.get("/rimborso", PrenotazioniAmministratoreController.getElencoPrenotAmm);
router.post("/rimborso",PrenotazioniAmministratoreController.postElencoPrenotAmm);
router.get("/rimborso/:id/effettuaRimborso", PrenotazioniAmministratoreController.getRimborso);
router.post("/rimborso/:id/effettuaRimborso",PrenotazioniAmministratoreController.postRimborso);
*/

module.exports= router;