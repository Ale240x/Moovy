const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
const util = require("util");
const { render } = require('ejs');
//const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
////const convertitore = require('');

var controller ={};

//Gestione Prenotazioni

controller.getElencoPrenotazioniAttive= async (req,res)=>{
    var dbPool= req.dbPool;
    try{ 
    var prenotazioni= await prenotazioneModel.getPrenotazioniAttiveA(dbPool);
    res.render('amministratore/ElencoPrenotazioniAttive.ejs',{
        prenotazioni : prenotazioni,

    });
    }catch(err){
        throw err;
    }
};

/*controller.postElencoPrenotazioniAttive= async (req,res)=>{
    var dbConnection=req.dbPool;
    
    try{
        let id_prenotazione= req.body.id_prenotazione;
        let prenotazione= await prenotazioneModel.getPrenotazione(dbConnection,id_prenotazione); // dovremmo aggiungere nel model
        
        res.render('amministratore/InfoPrenotAmm.ejs',{
            'prenotazione':prenotazione,
        });

    }catch(error){
        throw error;
    };      

};
*/

controller.getInfoPrenotAmm =async (req,res)=>{
    var dbPool= req.dbPool;
    var id_prenotazione= req.params.id;
    //console.log(id_prenotazione);
    try{
        var prenotazione = await prenotazioneModel.getPrenotazione(dbPool,id_prenotazione);
        //console.log(prenotazione);
        res.render("amministratore/InfoPrenotAmm.ejs",{
            prenotazione: prenotazione,
        });

    }catch(error){
        throw error;
    }
    
};
//elimina prenotazione
controller.getCancellaPrenotazione=async(req,res)=>{
    var dbPool=req.dbPool;
    var id= req.params.id;
    console.log("sono su get cancella controller")

    try{
        await prenotazioneModel.annullaPrenotazione(dbPool,id);

        req.session.alert = {
            'style' : 'alert-success',
            'message' : "Prenotazione annullata con successo!"
        };
        
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');

    }catch(error){
        req.session.alert={
            'style':'alert-warining',
            'message': error.message
        };
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};
//modifica prenotazione
controller.getModificaPrenotazione=async(req,res)=>{
    var dbPool=req.dbPool;
    var id = req.params.id;
   // console.log("sono su get modifica controller")
    try{ 

    var prenotazione= await prenotazioneModel.getPrenotazione(dbPool,id); 
       // console.log(prenotazione);
    res.render("amministratore/DatiPrenotAmm.ejs",{
        prenotazione :prenotazione,

    });
    
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};

controller.postModificaPrenotazione = async(req,res)=>{
    var dbPool=req.dbPool;
    try{ 

      // console.log(req.params.id); 
     //  console.log(req.body.data_riconsegna);
      // console.log(req.body.luogo_riconsegna);
        
       await prenotazioneModel.modificaPrenotazione(
            dbPool,
            req.params.id,
            req.body.data_riconsegna,
            req.body.luogo_riconsegna,
            );
            req.session.alert = {
                'style' : 'alert-success',
                'message' : "La prenotazione è modificata con successo!"
            };
            
            res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};

//Rimborso
controller.getElencoPrenotAmm=async(req,res)=>{
    var dbConnection=req.dbPool;
    try{ 
    
        let prenotazioni=await prenotazioneModel.getUltimePrenotazioni(dbConnection);
        res.render('/amministratore/ElencoPrenotAmm.ejs',{
            'idprenotazione':prenotazioni.idprenotazione,
            'nomecliente':prenotazioni.nomecliente,
            'data':prenotazioni.data,
            'stato':prenotazioni.stato,
            'prezzototale':prenotazioni.prezzototale
        
        });
    }catch(error){
        throw error;

    }
};

controller.postElencoPrenotAmm=async(req,res)=>{
    var dbConnection=req.dbPool;

    try{
        let id=req.body.idprenotazione;
        let prenotazione= await prenotazioneModel.getPrenotazione(dbConnection,id);
        res.render('/amministratore/Rimborso.ejs', {
            'prenotazione':prenotazione
        })

    }catch(error){
        throw error;
    }
};

controller.getRimborso= async(req,res)=>{
    res.render('/amministratore/Rimborso.ejs');
}

controller.postRimborso=async(req,res)=>{
    var dbConnection=dbPool;

    try{
        let rimborso= req.body;
        let importo=req.body.importo;
        let metodoPagamento=req.body.metodo;
        await prenotazioneModel.statoRimborso(   ///da aggiungere al model?
            dbConnection,
            importo,
            metodoPagamento
        );

    }catch(error){
        throw error;
    }
}

module.exports = controller;