const express = require('express');
const OspiteController = require("../OspiteController");
const AutistaController = require("../autista/AutistaController");

var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente[0].ruolo == 'Autista'){
        next();  
    }
    else{
        res.redirect("/");
    }
});

////area personale
router.get("/", AutistaController.getAreaPersonaleAutista);
router.get("/disconnetti", AutistaController.getDisconnetti);

//Gestione Corse
router.get("/corse", AutistaController.getCorse);
//router.post("/corse", AutistaController.postCorse);
router.get("/corse/:id/info", AutistaController.getInfoCorsa);
router.get("/corse/:id/info/accetta", AutistaController.getAccettaCorsa);
router.get("/corse/id/info/rifiuta", AutistaController.getRifiutaCorsa);

//RitiraVeicolo
router.get("/veicoliPrenotati", AutistaController.getVeicoliPrenotatiAut);
router.get("/veicoliPrenotati/:id/InfoRitiro", AutistaController.getInfoRitiro);
router.post("/veicoliPrenotati/:id/InfoRitiro", AutistaController.postInfoRitiro);

//Riconsenga Veicolo
router.get("/veicoliRitirati", AutistaController.getVeicoliRitiratiAut);
router.get("/veicoliRitirati/:id/luogoRiconsegna", AutistaController.getModificaLuogo);
router.post("/veicoliRitirati/:id/luogoRiconsegna", AutistaController.postModificaLuogo);

module.exports=router;