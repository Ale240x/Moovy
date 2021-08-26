const express = require('express');

const AmministratoreController = require("../amministratore/AmministratoreController");
const PrenotazioniAmministratoreController = require("../amministratore/PrenotazioneAmministratoreController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente.ruolo == 'amministratore'){
        next();  
    }
    else{
        res.redirect("/amministratore");
    }
});
// homepage accessibile a tutti
//router.get("/", AmministratoreController.getHome);
router.get("/disconnetti", AmministratoreController.getDisconnetti);

//area personale?? 
router.get("/AreaPersonaleAmministratore", AmministratoreController.getAreaPersonaleAmministratore);

//registrazione Impiegati
//router.get("/registrazioneImpiegati",AmministratoreController.getRegistazioneImpiegati);
//router.post("/registrazioneImpiegati",AmministratoreController.postRegistazioneImpiegati);

//modifica dati impiegati
router.get("/datiImpiegati",AmministratoreController.getDatiImpiegati);
router.post("/datiImpigati",AmministratoreController.postDatiImpiegati);
router.get("/datiImpigati/:id/modificaDatiImpiegati",AmministratoreController.getFormModifica);
router.post("/datiImpigati/:id/modificaDatiImpiegati",AmministratoreController.postFormModifica);

//elimina account
router.post("/datiAccounts",AmministratoreController.getFormFiltraggio);
router.post("/datiAccounts",AmministratoreController.postFormFiltraggio);
router.get("/datiAccounts/:id/eliminaAccount",AmministratoreController.getDatiAccount);
router.post("/datiAccounts/:id/eliminaAccount",AmministratoreController.postDatiAccount);

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