const express = require('express');
const OspiteController = require("../OspiteController");
const ClienteController = require("../cliente/ClienteController");
const PrenotazioniClienteController = require("../cliente/PrenotazioniClienteController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;
    var pre = req.session.prenotazione;

    //console.log(utente[0].ruolo);

    if(utente[0].ruolo == 'Cliente'){
        next();  
    }
    else{
        res.redirect("/autenticazione");
    }
});


//Regione SchermataInizialeCliente
router.get("/", ClienteController.getSchermataIniziale);

router.get("/disconnetti", OspiteController.getDisconnetti);

//Regione AreaPersonale
router.get("/AreaPersonaleCliente", ClienteController.getAreaPersonaleCliente);
router.get("/AreaPersonaleCliente/mostrastorico", ClienteController.getStoricoPrenotazioni);
router.get("/AreaPersonaleCliente/mostrastorico/:id", ClienteController.getInfoPrenotazione);
router.get("/AreaPersonaleCliente/formModifica", ClienteController.getModificaDati);
router.post("/AreaPersonaleCliente/formModifica", ClienteController.postModificaDati);


//Regione Ritiro
router.get("/AreaPersonaleCliente/veicoliPrenotati", PrenotazioniClienteController.getElencoVeicoliDaRitirareC);
router.get("/AreaPersonaleCliente/veicoliPrenotati/:id/InfoRitiro", PrenotazioniClienteController.getInfoVeicoloDaRitirare);
router.post("/AreaPersonaleCliente/veicoliPrenotati/:id/InfoRitiro", PrenotazioniClienteController.postRitiroVeicolo);

//Regione Riconsegna
router.get("/AreaPersonaleCliente/VeicoliRitirati", PrenotazioniClienteController.getElencoVeicoliDaRiconsegnareC); 
router.get("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", PrenotazioniClienteController.getModificaLuogo);
router.post("/AreaPersonaleCliente/VeicoliRitirati/:id/luogoriconsegna", PrenotazioniClienteController.postModificaLuogo);



// Regione Modifica e elimina prenotazione
router.get("/AreaPersonaleCliente/ElencoPrenotazioni", PrenotazioniClienteController.getElencoPrenotazioni);
router.get("/AreaPersonaleCliente/ElencoPrenotazioni/:id", PrenotazioniClienteController.getModificaPrenotazione);
router.post("/AreaPersonaleCliente/ElencoPrenotazioni/:id", PrenotazioniClienteController.postModificaPrenotazione);
router.get("/AreaPersonaleCliente/ElencoPrenotazioniE", PrenotazioniClienteController.getElencoPrenotazioniE);
router.get("/AreaPersonaleCliente/ElencoPrenotazioniE/:id", PrenotazioniClienteController.getEliminaPrenotazione);

// Ricerca veicolo
router.get("/TipoVeicoli", PrenotazioniClienteController.getRicercaTipoVeicoli);
router.get("/TipoVeicoli/FormA", PrenotazioniClienteController.getFormA);
router.post("/TipoVeicoli/FormA/RisultatiRicerca", PrenotazioniClienteController.postFormA);
router.get("/TipoVeicoli/FormA/RisultatiRicerca/:id/InfoVeicolo", PrenotazioniClienteController.getInfoVeicolo);
router.get("/Riepilogo", PrenotazioniClienteController.getRiepilogo);

//Regione prenotazione
router.post("/Riepilogo", PrenotazioniClienteController.postRiepilogo);
router.get("/Riepilogo/Mancia", PrenotazioniClienteController.getMancia);
router.post("/Riepilogo/Mancia", PrenotazioniClienteController.postMancia);
router.get("/Riepilogo/FormPatente", PrenotazioniClienteController.getPatente);
router.post("/Riepilogo/FormPatente", PrenotazioniClienteController.postAggiungiPatente);

router.get("/Riepilogo/Pagamento", PrenotazioniClienteController.getPagamento);
router.post("/Riepilogo/Pagamento", PrenotazioniClienteController.postPagamento);
router.get("/Riepilogo/Pagamento/NuovoMetodo", PrenotazioniClienteController.getNuovoMetodoPagamento);
router.post("/Riepilogo/Pagamento/NuovoMetodo", PrenotazioniClienteController.postNuovoMetodoPagamento);
router.get("/Riepilogo/Pagamento/StatoPagamento", PrenotazioniClienteController.getStatoPagamento);

module.exports = router;