const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
const util = require("util");
const { render } = require('ejs');
const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
////const convertitore = require('');

var controller ={};

//Gestione Prenotazioni

controller.getAreaPersonaleAmministratore = ( req, res) => {
    res.render('amministratore/AreaPersonaleAmministratore.ejs');
};

controller.getElencoPrenotazioniAttive= async (req,res)=>{
    var dbConnection= req.dbPool;
    let prenotazioniA= await prenotazioneModel.getPrenotazioniAttiveA(dbConnection);
    res.render('amministratore/ElencoPrenotazioniAttive.ejs',{
        'prenotazioniA' : prenotazioniA 

    });
};

controller.postElencoPrenotazioniAttive= async (req,res)=>{
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

controller.getInfoPrenotAmm =(req,res)=>{
    req.render('amministratore/InfoPrenotAmm.ejs');
};
//elimina prenotazione
controller.getCancellaPrenotazione=async(req,res)=>{
    var dbConnection=req.dbPool;
    var id= req.body.id_prenotazione;

    try{
        var stato_prenotazione="Annullata";
        await prenotazioneModel.annullaPrenotazione(dbConnection,id);
    }catch(error){
        req.session.alert={
            'style':'alert-warining',
            'message': error.message
        };
        res.redirect('/amministratore/AreaPersonaleAmministratore');
    };
};
//modifica prenotazione
controller.getDatiPrenotAmm=async(req,res)=>{
    var dbConnection=req.dbPool;
    try{ 

    let id_prenotazione= req.body.id_prenotazione;

    let prenotazione= await prenotazioneModel.getPrenotazione(dbConnection,id_prenotazione); // dovremmo aggiungere nel model
    render('amministratore/DatiPrenotAmm.ejs',{
        'luogodiritiro':prenotazione.luogodiritiro,
        'luogodiriconsegna':prenotazione.luogodiriconsegna,
        'datadiritiro':prenotazione.datadiritiro,
        'orariodiritiro':prenotazione.orariodiritiro,
        'datadiriconsegna':prenotazione.datadiriconsegna,
        'orariodiriconsgna':prenotazione.orariodiriconsgna,
        'tipoveicolo':prenotazione.tipoveicolo,
        'modelloveicolo':prenotazione.modelloveicolo,
        'autista':prenotazione.autista,
        'statoprenotazione':statoprenotazione,
        'imprevisti':prenotazione.imprevisti,
        'prezzototale':prenotazione.prezzototale
//OPPURE DIRETTAMENTE
    //  'prenotazione':prenotazione

    });
    
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    res.redirect('/amministratore/AreaPersonaleAmministratore/');
    };
};

controller.postDatiPrenotAmm=async(req,res)=>{
    var dbConnection=req.dbPool;
    try{ 

        let attempt= req.body;
        await prenotazioneModel.modificaPrenotazione(
            dbConnection,
            req.body.id_prenotazione,
            req.body.data_riconsegna,
            req.body.luogo_riconsegna
            );
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
        res.redirect('/amministratore/AreaPersonaleAmministratore/');
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