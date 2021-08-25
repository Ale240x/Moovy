const prenotazioneModel = require('../../models/prenotazioneModel');
const accountModel = require('../../models/accountModel');
const util = require("util");


var controller = {};

//Regione Disconnetti
controller.getDisconnetti = (req, res) => {
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/home");
};

controller.getLogout = (req, res) => {  
    res.render('general/Logout.ejs');   
};

//Regione Area Personale
controller.getAreaPersonaleAdd = (req, res) => {
    res.render('/addetto/AreaPersonaleAdd.ejs');
};

//Regione Ritiro Veicolo
controller.getVeicoliPrenotatiAdd = async(req, res) => {
   
    var dbPool = req.dbPool;
    var id_addetto = req.session.utente.id_account;
    try{
        
        let parcheggioAdd = await accountModel.getParcheggioAdd(dbPool, id_addetto);
        let veicoliDaRitirareAdd = await prenotazioneModel.getVeicoliDaRitirareAdd(dbPool, parcheggioAdd);

        res.render('Addetto/VeicoliPrenotatiAddetto.ejs', {'veicoli' : veicoliDaRitirareAdd});

    }
    catch(error){
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    };
};

controller.postInfoRitiro = (req, res) =>{
    var veicolo = req.body.veicolo; 
    res.render('general/InfoRitiro.ejs', {'veicolo' : veicolo});
};

controller.postRitiroVeicolo = async (req, res) => { 
    var dbPool = req.dbPool;
    var codice = req.body.codice;
    var idPrenotazione = req.params.id_prenotazione;
    var veicolo = req.body.veicolo;

    try{
        if (veicolo.id_veicolo == codice){
            await prenotazioneModel.setStatoPrenotazione(dbPool,idPrenotazione, "Ritirato");
        } 
    
       
    }
    catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
    res.redirect("addetto/AreaPersonaleAdd");
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