const express = require('express');

const ClienteController = require("../cliente/ClienteController");
const PrenotazioniClienteController = require("../cliente/PrenotazioniClienteController");
const OspiteController = require("../OspiteController");

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

//Regione SchermataInizialeCliente
router.get("/", ClienteController.getSchermataIniziale);
router.get("/disconnetti", ClienteController.getDisconnetti);

//Regione AreaPersonale
router.get("/AreaPersonaleCliente", ClienteController.getAreaPersonaleCliente);
router.get("/AreaPersonaleCliente/mostrastorico", ClienteController.getStoricoPrenotazioni);
router.get("/AreaPersonaleCliente/mostrastorico/:id/InfoPrenotazione", ClienteController.getInfoPrenotazione);
router.get("/AreaPersonaleCliente/formmodifica", ClienteController.getModificaDati);
router.post("/AreaPersonaleCliente/formmodifica", ClienteController.postModificaDati);


//Regione Ritiro
router.get("/AreaPersonaleCliente/VeicoliPrenotati", PrenotazioniClienteController.getElencoVeicoliDaRiconsegnareC);
router.get("/AreaPersonaleCliente/VeicoliPrenotati/:id/InfoRitiro", PrenotazioniClienteController.getInfoVeicoloDaRitirare);
router.post("/AreaPersonaleCliente/VeicoliPrenotati/:id/InfoRitiro", PrenotazioniClienteController.postRitiroVeicolo);
//Regione riconsegna
router.get("/AreaPersonaleCliente/VeicoliRitirati", PrenotazioniClienteController.getInfoVeicoloDaRitirare);
//router.post("/AreaPersonaleCliente/VeicoliRitirati", PrenotazioniClienteController.postInfoVeicoloDaRitirare); //non esiste
router.get("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", PrenotazioniClienteController.getModificaLuogo);
router.post("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna/sovrapprezzo", PrenotazioniClienteController.postModificaLuogo);
router.post("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", PrenotazioniClienteController.postRiconsegnaEffettuata);

// Regione Modifica e elimina prenotazione
router.get("/AreaPersonaleCliente/ElencoPrenotazioni", PrenotazioniClienteController.getElencoPrenotazioni);
router.get("/AreaPersonaleCliente/ElencoPrenotazioni/:id/modificaPrenotazione", PrenotazioniClienteController.getModificaPrenotazione);
router.post("/AreaPersonaleCliente/ElencoPrenotazioni/:id/modificaPrenotazione", PrenotazioniClienteController.postModificaPrenotazione);
router.get("/AreaPersonaleCliente/ElencoPrenotazioni/:id/eliminaPrenotazione", PrenotazioniClienteController.getEliminaPrenotazione);

//Regione ricerca 
router.get("/TipoVeicoli", OspiteController.getRicercaTipoVeicoli);
//router.get("/TipoVeicoli/FormA", OspiteController.getFormA); //non esiste
router.post("/TipoVeicoli/FormA/RisultatiRicerca", OspiteController.postFormA);
router.get("/TipoVeicoli/FormA/RisultatiRicerca/:id/InfoVeicolo", OspiteController.getInfoVeicolo);
router.get("/TipoVeicoli/FormA/RisultatiRicerca/:id/InfoVeicolo/Riepilogo", OspiteController.getRiepilogo);

//Regione prenotazione
router.get("/Riepilogo", OspiteController.getRiepilogo);
router.get("/Riepilogo/Mancia", PrenotazioniClienteController.getMancia);
router.post("/Riepilogo", PrenotazioniClienteController.postPrenotaVeicolo);
router.get("/Riepilogo/FormPatente",PrenotazioniClienteController.getPatente);
router.post("/Riepilogo/FormPatente",PrenotazioniClienteController.postAggiungiPatente);
router.get("/Riepilogo/Pagamento",PrenotazioniClienteController.getPagamento);
router.get("/Riepilogo/Pagamento/NuovoMetodo",PrenotazioniClienteController.getNuovoMetodoPagamento);
router.post("/Riepilogo/Pagamento/NuovoMetodo",PrenotazioniClienteController.postNuovoMetodoPagamento);
router.get("/Riepilogo/Pagamento/StatoPagamento",PrenotazioniClienteController.getStatoPagamento);
router.post("/Riepilogo/Pagamento/StatoPagamento",PrenotazioniClienteController.postStatoPagamento);









module.exports = router;