const express = require('express');

const ClienteController = require("../cliente/ClienteController");
const PrenotazioniClienteController = require("../cliente/PrenotazioniClienteController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente.ruolo == 'Cliente'){
        next();  
    }
    else{
        res.redirect("/");
    }
});

//Regione SchermataInizialeCliente ??
//router.get("/", ClienteController.getSchermataIniziale);
router.get("/disconnetti", ClienteController.getDisconnetti);

//Regione AreaPersonale
router.get("/AreaPersonaleCliente", ClienteController.getAreaPersonaleCliente);
router.get("/AreaPersonaleCliente/mostrastorico", ClienteController.getStoricoPrenotazioni);
router.get("/AreaPersonaleCliente/mostrastorico/:id/InfoPrenotazione", ClienteController.getInfoPrenotazione);
router.get("/AreaPersonaleCliente/formmodifica", ClienteController.getModificaDati);
router.post("/AreaPersonaleCliente/formmodifica", ClienteController.postModificaDati);


//Regione Ritiro
/*router.get("/AreaPersonaleCliente/VeicoliPrenotati", ClienteController.getElencoVeicoliDaRiconsegnareC); //non esiste in ClienteController
router.get("/AreaPersonaleCliente/VeicoliPrenotati/:id/InfoVeicolo", ClienteController.getInfoVeicoloDaRitirare);
router.post("/AreaPersonaleCliente/VeicoliPrenotati/:id/InfoVeicolo", ClienteController.postCodiceRitiro);
//Regione riconsegna
router.get("/AreaPersonaleCliente/VeicoliRitirati", ClienteController.getInfoVeicoloDaRitirare);
router.post("/AreaPersonaleCliente/VeicoliRitirati", ClienteController.postInfoVeicoloDaRitirare);
router.get("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", ClienteController.getFormModificaRiconsegna);
router.post("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", ClienteController.postFormModificaRiconsegna);
// Regione Modifica e elimina prenotazione
router.get("/AreaPersonaleCliente/ElencoPrenotazioni", PrenotazioneClienteController.getElencoPrenotazioni);
router.get("/AreaPersonaleCliente/ElencoPrenotazioni/:id/modificaPrenotazione", PrenotazioneClienteController.getModificaPrenotazione);
router.post("/AreaPersonaleCliente/ElencoPrenotazioni/:id/modificaPrenotazione", PrenotazioneClienteController.postModificaPrenotazione);
router.get("/AreaPersonaleCliente/ElencoPrenotazioni/:id/eliminaPrenotazione", PrenotazioneClienteController.getEliminaPrenotazione);
*/


module.exports = router;