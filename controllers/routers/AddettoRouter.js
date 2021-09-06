const express = require('express');

const AddettoController = require("../addetto/AddettoController");


var router = express.Router();

router.use("", (req,res,next) =>{
    var utente = req.session.utente;

    if(utente[0].ruolo == 'Addetto'){
        next();  
    }
    else{
        res.redirect("/");
    }
});

//area personale
router.get("/", AddettoController.getAreaPersonaleAdd);
router.get("/disconnetti", AddettoController.getDisconnetti);

//RitiraVeicolo
router.get("/veicoliPrenotati", AddettoController.getVeicoliPrenotatiAdd);
router.get("/veicoliPrenotati/:id/InfoRitiro", AddettoController.getInfoVeicoloDaRitirare);
router.post("/veicoliPrenotati/:id/InfoRitiro", AddettoController.postRitiroVeicolo);
/*

//Riconsenga Veicolo
router.get("/veicoliRitirati", AddettoController.getVeicoliRitiratiAdd);
router.get("/veicoliRitirati/:id/luogoRiconsegna", AddettoController.getModificaLuogo);
router.post("/veicoliRitirati/:id/luogoRiconsegna/sovrepprezzo", AddettoController.postModificaLuogo);
router.post("/veicoliRitirati/:id/luogoRiconsegna", AddettoController.postRiconsegnaEffettuata);
*/
module.exports=router;