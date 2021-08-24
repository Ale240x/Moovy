const express = require('express');

const AutistaController = require("../autista/AutistaController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente.ruolo == 'autista'){
        next();  
    }
    else{
        res.redirect("/autista");
    }
});

////area personale
router.get("/", AutistaController.getAreaPersonaleAutista);
router.get("/disconnetti", AutistaController.getDisconnetti);

//Gestione Corse
router.get("/corse", AutistaController.getCorse);
router.post("/corse", AutistaController.postCorse);
router.get("/corse/info", AutistaController.getInfoCorsa);
router.get("/corse/info/accetta", AutistaController.getAccettaCorsa);
router.get("/corse/info/rifiuta", AutistaController.getRifiutaCorsa);

//RitiraVeicolo
router.get("/veicoliPrenotati", AutistaController.getVeicoliPrenotatiAut);
router.get("/veicoliPrenotati/:id/infoRitiro", AutistaController.getInfoRitiro);
router.post("/veicoliPrenotati/:id/infoRitiro", AutistaController.postInfoRitiro);

//Riconsenga Veicolo
router.get("/veicoliRitirati", AutistaController.getVeicoliRitiratiAut);
router.post("/veicoliRitirati", AutistaController.postVeicoliRitiratiAut);
router.get("/veicoliRitirati/:id/luogoRiconsegna", AutistaController.getModificaLuogo);
router.get("/veicoliRitirati/:id/luogoRiconsegna", AutistaController.postModificaLuogo);
router.get("/veicoliRitirati/:id/luogoRiconsegna/sovrapprezzo", AutistaController.getSovrapprezzo);

module.exports=router;