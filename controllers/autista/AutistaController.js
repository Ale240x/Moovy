const accountModel = require('../../models/accountModel');
const { modificaLuogoRiconsegna } = require('../../models/prenotazioneModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
////const convertitore = require('');

var controller={};
//Area Personale Autista
controller.getAreaPersonaleAutista = ( req, res) => {
    res.render('autista/areaPersonaleAut.ejs');
};

//Disconnetti

controller.getDisconnetti = (req, res) => {
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/");  // OSPITE
};

//Gestione Corse
controller.getCorse = async (req,res)=>{
    var dbConnection=req.dbPool;
    try{ 
        var utente = req.session.utente;
        let corse = await prenotazioneModel.getCorse(dbConnection,utente[0].id_account);

        res.render('autista/Corse.ejs',{
            corse : corse,
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

controller.getVeicoliPrenotatiAut = async(req,res) =>{
    
    var dbPool = req.dbPool;

    try{
        var utente = req.session.utente;

        var veicoli= await prenotazioneModel.getVeicoliDaRitirareAut(dbPool, utente[0].id_account);

        //console.log(veicoli[0].id_veicolo);
        
        res.render("autista/VeicoliPrenotatiAutista.ejs",{
            veicoli: veicoli,
        });

    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }  
        res.redirect('/utente/autista/');   

    }    
};

controller.getInfoRitiro = async(req,res)=>{
        var dbPool= req.dbPool;
        var id= req.params.id;
        try {
            var veicolo = await prenotazioneModel.getVeicolo(dbPool,id);
            res.render("autista/InfoRitiro.ejs",{
                veicolo: veicolo,           
            });

        }catch (error){
            throw error;
        }
};

controller.postInfoRitiro= async (req, res) => { 
    var dbPool = req.dbPool;

    try{
        var codice = req.body.codiceVeicolo;
        var id_veicolo= req.params.id;
        
       // console.log(codice);
       // console.log(id_veicolo);
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,id_veicolo);
        var stato = "Ritirato";

       // console.log(prenotazione);

        if (id_veicolo == codice){

            await prenotazioneModel.setStatoPrenotazione(dbPool, prenotazione[0].id_prenotazione ,stato);
        } 

        req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Veicolo ritirato con successo!'
        };

        res.redirect('/utente/autista/');
       
    }
    catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/utente/autista/');
    }
   
};


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