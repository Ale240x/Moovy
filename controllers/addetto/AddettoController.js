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

//logout page??
controller.getLogout = (req, res) => {  
    res.render('general/Logout.ejs');   
};



//Regione Ritiro Veicolo
controller.getVeicoliPrenotatiAdd = async(req, res) => {
   
    var dbPool = req.dbPool;
    
    try{
        var utente = req.session.utente;

        let parcheggioAdd = await accountModel.getParcheggioAdd(dbPool, utente[0].id_account);
       // console.log(parcheggioAdd[0].indirizzo);
        let veicoli  = await prenotazioneModel.getVeicoliDaRitirareAdd(dbPool, parcheggioAdd[0].indirizzo);
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
        var stato = "Ritirato";

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




//Regione Riconsegna Veicolo
controller.getVeicoliRitiratiAdd = async (req, res) =>{

    var dbPool = req.dbPool;

    try{
        let veicoliDaRiconsegnareAdd = await prenotazioneModel.getVeicoliDaRiconsegnareAdd(dbPool);
        res.render('addetto/VeicoliRitiratiAdd.ejs', {'veicoli' : veicoliDaRiconsegnareAdd});
    }
    catch(error){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
};



controller.getModificaLuogo = (req, res) =>{
    var luogo_riconsegna = req.body.prenotazione.luogo_riconsegna; 
    res.render('ModificaLuogo.ejs', {'luogo_riconsegna' : luogo_riconsegna});
    
};


controller.postModificaLuogo = async(req,res) =>{
    var dbPool = req.dbPool;
    var nuovoluogo = req.body.luogo_riconsegna;
    var prenotazione= req.body.prenotazione;

    try{
        if(nuovoluogo != prenotazione.luogo_riconsegna){

        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,prenotazione.id_prenotazione, nuovoluogo);
        let datacorrente= new Date().getTime;
        let oreSovrapprezzo = (datacorrente - prenotazione.data_riconsegna.getTime)/3600000;
        var sovrapprezzo = oreSovrapprezzo*getPrezzoVeicolo(prenotazione.ref_veicolo);
        var prezzo_totale = sovrapprezzo + prenotazione.prezzo_finale;

        res.render("cliente/Sovrapprezzo.ejs",{
            'prezzo_totale' :  prezzo_totale,
            'prenotazione' : prenotazione,
            'nuovo_luogo' : nuovo_luogo,
        });
        }
        
    }catch(error){
        req.sessione.alert={
            'style' : 'aler-warning',
            'message' : error.message
        }
       
    }

};

controller.getSovrapprezzo = async (req, res) => {  //sbagliato
    var dbPool = req.dbPool;
    var ora_ric_stimata = req.session.prenotazione.data_riconsegna.getTime();
    var ora_riconsegna = new Date().getTime();
    let diffOre = (ora_riconsegna - ora_ric_stimata)/3600000;

    var p = req.params;
    //si deve fare una query getPrezzoVeicolo(dbPool, id_veicolo) ??
    if(ora_ric_stimata < ora_riconsegna){

        try{
            var tariffa = await prenotazioneModel.getPrezzoVeicolo(dbPool, p.ref_veicolo);
        }
        catch(error){
    
            req.session.alert = {
                
                'style' : 'alert-warning',
                'message' : error.message
        
            }
        }
        var sovrapprezzo = calcolaSovrapprezzo(tariffa, diffOre, prezzo_finale); //come ottengo il prezzo finale?
        res.render('Sovrapprezzo.ejs', {'sovrapprezzo' : sovrapprezzo});
    }

    try{
        await prenotazioneModel.riconsegnaVeicolo(dbPool, p.id_prenotazione, p.stato_prenotazione, p.ref_veicolo, p.luogo_riconsegna, p.prezzo_finale);
    }
    catch(error){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
};

controller.postRiconsegnaEffettuata = async(req,res) =>{
    var dbPool = req.dbPool;
    var prenotazione= req.body.prenotazione;
    var prezzo_totale = req.body.prezzo_totale;
    var nuovoluogo = req.body.luogo_riconsegna;
  

    try{

        await prenotazioneModel.riconsegnaVeicolo,(dbPool,prenotazione.id_prenotazione, "Veicolo Riconsegnato", prenotazione.ref_veicolo,nuovoluogo,prezzo_totale); //Da rivederee
   
    }catch(error){
        req.sessione.alert={
            'style' : 'aler-warning',
            'message' : error.message
        }
       
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