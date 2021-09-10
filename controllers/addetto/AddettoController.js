const prenotazioneModel = require('../../models/prenotazioneModel');
const accountModel = require('../../models/accountModel');
const util = require("util");


var controller = {};

//Regione Area Personale
controller.getAreaPersonaleAdd = (req, res) => {
    res.render('addetto/areaPersonaleAdd.ejs');
};

//Regione Disconnetti
controller.getDisconnetti = (req, res) => {
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/");
};




//Regione Ritiro Veicolo
controller.getVeicoliPrenotatiAdd = async(req, res) => {
   
    var dbPool = req.dbPool;
    
    try{
        var utente = req.session.utente;

        let parcheggioAdd = await accountModel.getParcheggioAdd(dbPool, utente[0].id_account);
       // console.log(parcheggioAdd[0].indirizzo);
        let veicoli  = await prenotazioneModel.getVeicoliDaRitirareAdd(dbPool, parcheggioAdd[0].id_parcheggio);
       // console.log(veicoli);

        res.render("Addetto/VeicoliPrenotatiAddetto.ejs",{
            veicoli : veicoli
        
        });

    }
    catch(error){
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/utente/addetto/'); 
    };
};


controller.getInfoVeicoloDaRitirare = async(req,res)=>{
        var dbPool= req.dbPool;
        var id= req.params.id;
        try {
            var veicolo = await prenotazioneModel.getVeicolo(dbPool,id);
            res.render("addetto/InfoRitiro.ejs",{
                veicolo: veicolo,           
            });

        }catch (error){
            throw error;
        }
};

controller.postRitiroVeicolo = async (req, res) => { 
    var dbPool = req.dbPool;

    try{
        var codice = req.body.codiceVeicolo;
        var id_veicolo= req.params.id;
        
       // console.log(codice);
       // console.log(id_veicolo);
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,id_veicolo);
        var stato = "Veicolo Ritirato";

       // console.log(prenotazione);

        if (id_veicolo == codice){

            await prenotazioneModel.setStatoPrenotazione(dbPool, prenotazione[0].id_prenotazione ,stato);
        } 

        req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Veicolo ritirato con successo!'
        };

        res.redirect('/utente/addetto/');
       
    }
    catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/utente/addetto/');
    }
   
};


controller.getVeicoliRitiratiAdd = async (req, res) =>{

    var dbPool = req.dbPool;
    var utente=req.session.utente;

    try{
        let veicoli = await prenotazioneModel.getVeicoliDaRiconsegnareAdd(dbPool,utente[0].id_account);
        res.render('addetto/VeicoliRitiratiAdd.ejs', {veicoli : veicoli});
    }
    catch(error){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/utente/addetto/veicoliRitirati')
    }
};



controller.getModificaLuogo = async (req, res) =>{

    var id_veicolo= req.params.id;
    var dbPool = req.dbPool;

    try {
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicoloRitirato(dbPool,id_veicolo);
        res.render('addetto/ModificaLuogo_B.ejs', {
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
        
        var prenotazioneV = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,idVeicolo);
     
        if(nuovoluogo != prenotazioneV[0].luogo_riconsegna){
        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,prenotazioneV[0].id_prenotazione, nuovoluogo);
    
       }
      var x = new Date();
      var y= new Date(prenotazioneV[0].data_riconsegna);

       //controllo sovrapprezzi
       if(((x.getTime() - y.getTime())/3600000)>0){
        var oreSovrapprezzo = (x.getTime() - y.getTime())/3600000;
        var prezzoOrario = await prenotazioneModel.getPrezzoVeicolo(dbPool, idVeicolo);
        var sovrapprezzo = oreSovrapprezzo*prezzoOrario[0].tariffa;
        var prezzo_totale = sovrapprezzo + prenotazioneV[0].prezzo_finale;



        sovrapprezzo = sovrapprezzo.toFixed();
        await prenotazioneModel.riconsegnaVeicolo(dbPool,prenotazioneV[0].id_prenotazione ,'Veicolo Riconsegnato',idVeicolo,prenotazioneV[0].luogo_riconsegna,prezzo_totale);
        res.render("addetto/Sovrapprezzo_B.ejs",{

            sovrapprezzo : sovrapprezzo,
            idVeicolo : idVeicolo
        });
          
   }
   else{
       var prezzo_totale = prenotazioneV[0].prezzo_finale;
       await prenotazioneModel.riconsegnaVeicolo(dbPool,prenotazioneV[0].id_prenotazione ,'Veicolo Riconsegnato',idVeicolo,prenotazioneV[0].luogo_riconsegna,prezzo_totale);
    req.session.alert = {
        'style' : 'alert-success',
        'message' : 'Riconsegna effettuata in orario, nessun sovrapprezzo!'
    };
    res.redirect('/utente/addetto');
   }
     
        
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/addetto');  
        

    }  

};






/*async function aggiornaSessionePrenotazioni(dbConnection, session, utenteId, stato_prenotazione){

    try {
        
        return (session.prenotazioniadd = await prenotazioneModel.getPrenotazioniC(dbConnection, utenteId, stato_prenotazione));
        
    } catch(error) {

        throw error;
    }
};*/

module.exports =controller;