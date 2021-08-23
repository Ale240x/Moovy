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

//Regione Area Personale
controller.getAreaPersonaleAdd = (req, res) => {
    res.render('/addetto/AreaPersonaleAdd.ejs');
};

//Regione Ritiro Veicolo
controller.getVeicoliPrenotatiAdd = async(req, res) => {
    res.render('/addetto/RitiroVeicolo.ejs');

    var dbPool = req.dbPool;
    var id_addetto = req.session.utente.id_account;
    try{
        
        let parcheggioAdd = await accountModel.getParcheggioAdd(dbPool, id_addetto);
        let veicoliDaRitirareAdd = await prenotazioneModel.getVeicoliDaRitirareAdd(dbPool, parcheggioAdd);

        res.render('VeicoliPrenotatiAddetto.ejs', {'veicoli' : veicoliDaRitirareAdd});

    }
    catch(error){
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    };
};

controller.postInfoRitiro = (req, res) =>{
    var info_veicolo = req.body.info_veicolo; //è una riga della query getVeicoliDaRitirareAdd del metodo precedente
    res.render('InfoRitiro.ejs', {'info_veicolo' : info_veicolo});
};

controller.postRitiroVeicolo = async (req, res) => {
    var dbPool = req.dbPool;
    var id_prenotazione = req.params.id_prenotazione; //può essere params se nella route c'è /:id, altrimenti è body

    try{
        await prenotazioneModel.setStatoPrenotazione(dbPool, id_prenotazione, 'Veicolo ritirato');
    }
    catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
    res.render('AreaPersonaleAdd.ejs');
};

//Regione Riconsegna Veicolo
controller.getVeicoliRitiratiAdd = async (req, res) =>{
    res.render('/addetto/RiconsegnaVeicolo.ejs');
    var dbPool = req.dbPool;

    try{
        let veicoliDaRiconsegnareAdd = await prenotazioneModel.getVeicoliDaRiconsegnareAdd(dbPool);
        res.render('VeicoliRitiratiAdd.ejs', {'veicoli' : veicoliDaRiconsegnareAdd});
    }
    catch(error){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
};

controller.getModificaLuogo = (req, res) =>{
    var luogo_riconsegna = req.body.luogo_riconsegna; //si fa con sessionStorage??
    res.render('ModificaLuogo.ejs', {'luogo_riconsegna' : luogo_riconsegna});
    
};

controller.postModificaLuogo = async (req, res) => {
    var dbPool = req.dbPool;
    var id_prenotazione = req.params.id_prenotazione;
    var luogo_r = req.body.luogo_riconsegna; //luogo_riconsegna inserito dall'addetto
    //prendere luogo_riconsegna dalla entity per verificare se sono diversi
    var luogo_riconsegna = req.session.prenotazione.luogo_riconsegna; //non so se è giusto o dove si debba definire
    if(luogo_r != luogo_riconsegna){

        try{
            await prenotazioneModel.modificaLuogoRiconsegna(dbPool, id_prenotazione, luogo_r);
        }
        catch(error){
    
            req.session.alert = {
                
                'style' : 'alert-warning',
                'message' : error.message
        
            }
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

function calcolaSovrapprezzo(tariffa, diffOre, prezzo_finale){

    return prezzo_finale + (tariffa * diffOre);
};

/*async function aggiornaSessionePrenotazioni(dbConnection, session, utenteId, stato_prenotazione){

    try {
        
        return (session.prenotazioniadd = await prenotazioneModel.getPrenotazioniC(dbConnection, utenteId, stato_prenotazione));
        
    } catch(error) {

        throw error;
    }
};*/