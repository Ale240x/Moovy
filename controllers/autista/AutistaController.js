const accountModel = require('../../models/accountModel');
const { modificaLuogoRiconsegna } = require('../../models/prenotazioneModel');
const prenotazioneModel = require('../../models/prenotazioneModel');


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
    var dbPool=req.dbPool;
    try{ 
        var utente = req.session.utente;
        var corse = await prenotazioneModel.getCorse(dbPool,utente[0].id_account);

        //console.log(corse);

        res.render('autista/Corse.ejs',{
            corse : corse,
        });

    }catch(error){

        throw error;
    }
}

controller.getInfoCorsa= async(req,res)=>{

    var dbPool=req.dbPool;
    try{ 
        var id = req.params.id;
        var prenotazione = await prenotazioneModel.getPrenotazione(dbPool,id);
        
        //console.log(corsa);

        res.render('autista/InfoCorsa.ejs',{
            prenotazione: prenotazione,
        });

    }catch(error){

        throw error;
    }

    
}

controller.getAccettaCorsa = async(req,res)=>{
    var dbPool = req.dbPool;
    var id_prenotazione = req.params.id;
    try{
        var prenotazione= await prenotazioneModel.getPrenotazione(dbPool,id_prenotazione);
        var utente= req.session.utente[0].id_account;

        await prenotazioneModel.accettaCorsa(dbPool,id_prenotazione,utente);

        var cliente = await accountModel.getAccount(dbPool, prenotazione[0].ref_cliente)

        confermaCorsaCliente(req.transporter,id_prenotazione,cliente[0].email,cliente[0].nome, cliente[0].cognome);
        

        req.session.alert = {
            
            'style' : 'alert-success',
            'message' : 'la corsa è stata accettata!'
    
        };
        res.redirect('/utente/autista/');

    }catch(error){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message,
    
        };
        res.redirect('/utente/autista/');
    }

}

controller.getRifiutaCorsa= (req,res)=>{
   
    res.redirect('/utente/autista/');
}
//Ritiro Veicolo

controller.getVeicoliPrenotatiAut = async(req,res) =>{
    
    var dbPool = req.dbPool;

    try{
        var utente = req.session.utente;

        var veicoli= await prenotazioneModel.getVeicoliDaRitirareAut(dbPool, utente[0].id_account);

        //console.log(utente[0].id_account);
        //console.log(veicoli);
        
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
            var prenot_veicolo = await prenotazioneModel.getVeicoloDaPrenotazione(dbPool,id);
            res.render("autista/InfoRitiro.ejs",{
                veicolo: prenot_veicolo,           
            });

        }catch (error){
            throw error;
        }
};

controller.postInfoRitiro= async (req, res) => { 
    var dbPool = req.dbPool;
    var id_veicolo = req.body.id_veicolo;
    try{
        var codice = req.body.codiceVeicolo;
        var id_prenotazione= req.params.id;
        
       // console.log(codice);
       // console.log(id_veicolo);
        
        var stato = "Veicolo Ritirato";

       // console.log(prenotazione);

        if (id_veicolo == codice){

            await prenotazioneModel.setStatoPrenotazione(dbPool, id_prenotazione ,stato);
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
    var dbPool=req.dbPool;
    var utente=req.session.utente;
    try{
        let veicoli = await prenotazioneModel.getVeicoliDaRiconsegnareAut(dbPool,utente[0].id_account);
        res.render('autista/VeicoliRitiratiAut.ejs',{
            veicoli: veicoli
        });
    }catch (error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/autista/veicoliRitirati')
    }
};



controller.getModificaLuogo = async (req, res) =>{

    var id_veicolo= req.params.id;
    var dbPool = req.dbPool;

    try {
       
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicoloRitirato(dbPool,id_veicolo);
        
        res.render('autista/ModificaLuogo_B.ejs', {
            prenotazione : prenotazione[0],
            id_veicolo : id_veicolo
        });
        

    }catch (error){
        throw error;
    }

  
    
};

controller.postModificaLuogo = async(req,res) =>{

    var dbPool = req.dbPool;
    var nuovoluogo = req.body.luogo_riconsegna;   
    var idVeicolo = req.params.id;

    try{
        var prenotazioneV = await prenotazioneModel.getPrenotazioneDelVeicoloRitirato(dbPool,idVeicolo);
     
        if(nuovoluogo != prenotazioneV[0].luogo_riconsegna){
        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,prenotazioneV[0].id_prenotazione, nuovoluogo);
       }

       var prezzo_totale = prenotazioneV[0].prezzo_finale;
       await prenotazioneModel.riconsegnaVeicolo(dbPool,prenotazioneV[0].id_prenotazione ,'Veicolo Riconsegnato',idVeicolo,prenotazioneV[0].luogo_riconsegna,prezzo_totale);
    req.session.alert = {
        'style' : 'alert-success',
        'message' : 'Riconsegna effettuata!'
    };
    res.redirect('/utente/autista/');     
   
       
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/');  
   
    }  

};



async function confermaCorsaCliente(transporter,id_prenotazione,email,clientenome, clientecognome){

    try {
        
        let mailSubject = 
            `
            La corsa è confermata.
            <br/>
            Gentile ${clientenome} ${clientecognome},
            è stato richiesto l'autista per la prenotazione con id: ${id_prenotazione}.
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
            'from' : 'moovyprogetto@gmail.com',
            'to' : email,
            'subject' : 'la prenotazione è confermata',
            'html' : mailSubject
            };

            transporter.sendMail(mailOpt, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
              ;

    } catch (error) {
        
        throw error;
        
    }

};


async function aggiornaSessionePrenotazioni(dbPool, session,id_account, stato_prenotazione){

    try {
        
        return (session.prenotazioni = await prenotazioneModel.getPrenotazioniAttiveC(dbConnection, utenteId, stato_prenotazione));
        
    } catch(error) {

        throw error;
    }
};

module.exports= controller;