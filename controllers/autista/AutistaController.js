const accountModel = require('../../models/accountModel');
const { modificaLuogoRiconsegna } = require('../../models/prenotazioneModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
////const convertitore = require('');

var controller={};
//Area Personale Autista
controller.getAreaPersonaleAutista = ( req, res) => {
    res.render('/autista/AreaPersonaleAutista.ejs');
};

//Disconnetti

controller.getDisconnetti = (req, res) => {
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/ospite");  ///??? OSPITE
};

//Gestione Corse
controller.getCorse = async (req,res)=>{
    var dbConnection=req.dbPool;
    try{ 
        let utente=req.session.utente.id;
        let corse = await prenotazioneModel.getCorse(dbConnection,utente);
    res.render('/autista/Corse.ejs',{
        'corse': corse
    });
    }catch(error){
        throw error;
    }
}

controller.postCorse=(req,res)=>{
    var dbConnection=req.dbPool;

    try{
        let corsa = req.body.corsa;
        res.render('/autista/InfoCorsa.ejs',{
            'corsa':corsa
        });
    }catch(error){
        throw error;
    }

}

controller.getInfoCorsa=(req,res)=>{

    res.render('/autista/InfoCorsa.ejs');
}

controller.getAccettaCorsa = async(req,res)=>{
    var dbConnection=req.dbPool;
    var corsa=req.params.corsa;
    try{
        
        let id_prenotazione= idprenotazione.corsa;
        let prenotazione= await prenotazioneModel.getPrenotazione(dbConnection,id_prenotazione);
        let utente= req.session.utente.id;
        let stato='Confermata'
        await prenotazioneModel.accettaCorsa(dbConnection,id_prenotazione,utente);
        await prenotazioneModel.setStatoAutista(dbConnection,id_prenotazione,stato);// da aggiungere al model=> HO AGGIUNTO IO
        confermaCorsaCliente(req.transporter,id_prenotazione,prenotazione.email)
        res.render('/autista/AreaPersonaleAutista')
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    }

}

controller.getRifiutaCorsa= (req,res)=>{
      
    res.redender('/autista/AreaPersonaleAutista');
}
//Ritiro Veicolo
controller.getVeicoliPrenotatiAut = async (req,res)=>{
    var dbConnection=req.dbPool;

    try{
        let utente= req.session.utente.id;
        let veicoli= await prenotazioneModel.getVeicoliDaRitirareAut(dbConnection,autista);
        res.render('/autista/VeicoliPrenotatiAut.ejs',{
            'veicoli':veicoli
        })
    }catch(error){
        req.session.alert = {
            'style' : 'alert-warning',
            'message' : error.message
        }

        res.redirect('/utente/autista/veicoliPrenotati/')
    }

};
/// in questo caso come passo al postiInfoRitiro id_veicolo?
controller.getInfoRitiro=(req,res)=>{
    var dbConnection=req.dbPool;
    var veicolo= req.body;
        res.render('/autista/InfoRitiro.ejs',{
            'id_veicolo':id_veicolo.veicolo
      
    });
};
//??
controller.postInfoRitiro= async (req,res)=>{
    var dbConnection=req.dbPool;
    var id_prenotazione=req.body;
    try{
        let codice=req.body;
        let stato='Veicolo ritirato'
        controllaCodice(codice,id.veicolo);
        await prenotazioneModel.setStatoPrenotazione(dbPool,id_prenotazione,stato);

    }catch (error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/autista/veicoliPrenotati/')
    }
}
//Riconsegno Veicolo

controller.getVeicoliRitiratiAut= async (req,res)=>{
    var dbConncection=req.dbPool;
    var utente=req.session.utente.id;
    try{
        let veicoliRitirati=await prenotazioneModel.getVeicoliDaRiconsegnareAut(dbPool,utente);
        res.render('/autista/VeicoliRitiratiAut.ejs',{
            'veicoliRitirati': veicoliRitirati
        });
    }catch (error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/autista/veicoliRitirati/')
    }
}

controller.postVeicoliRitiratiAut=(req,res)=>{
    var dbConnection=req.dbPool;

    try {
        let veicolo= req.body;
        res.render('/autista/ModificaLuogo.ejs',{
            'veicolo':veicolo
        })

    }catch(error){
        throw error;
    }
}

controller.getModificaLuogo = (req, res) =>{
    var luogo_riconsegna = req.body.luogo_riconsegna; //si fa con sessionStorage??
    res.render('ModificaLuogo.ejs', {'luogo_riconsegna' : luogo_riconsegna});
    
};

controller.postModificaLuogo= async (req,res)=>{
    var dbConnection=req.dbPool;

    try{
        let luogoRiconsegna = req.body;
        //????let id_prenotazione = 
        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,id_prenotazione,luogoRiconsegna);

    }catch(error){
        req.session.alert = {
                
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/autista/veicoliRitirati/')
    }

}


///???
controller.getSovrapprezzo=async(req,res)=>{
    var dbConnection=req.dbPool;

}

///

async function calcolaSovrapprezzo(){

}

async function controllaCodice(codice,id_veicolo){


    try{
        if(codice!=id_veicolo){
            res.render('/autista/InfoRitiro.ejs')
        }
    }catch(error){
        throw error;
    }

};


async function confermaCorsaCliente(transporter,prenotazione,email){

    try {
        
        let mailSubject = 
            `
            La corsa è confermata.
            <br/>
            Gentile ${cliente.nome} ${cliente.cognome},
            è stato richiesto l'autista per la prenotazione con id: ${prenotazione.id_prenotazione}.
            <br/>
            La prenotazione è confermata con l'autista.
            <br/>
            <br/>
            Saluti.
            <br/>
            Saluti,
            <br/>
            - Moovy.
            `;

        let mailOpt = {
            'from' : 'MAIL MOOVY',
            'to' : cliente.email,
            'subject' : 'la prenotazione è confermata',
            'html' : mailSubject
            };

        transporter.sendMail(mailOpt);

    } catch (error) {
        
        throw error;
        
    }

};

//????
async function aggiornaSessionePrenotazioni(dbPool, session,id_account, stato_prenotazione){

    try {
        
        return (session.prenotazioni = await prenotazioneModel.getPrenotazioniAttiveC(dbConnection, utenteId, stato_prenotazione));
        
    } catch(error) {

        throw error;
    }
};

module.exports= controller;