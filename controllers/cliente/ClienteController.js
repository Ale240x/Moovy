const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');

var controller = {}; //assegna al controller un valore nullo

//Regione Area Personale Cliente

controller.getSchermataIniziale = (req, res) => {  
    res.render('general/HomeAutenticato.ejs');   
};
//logout.ejs non serve? 
controller.getLogout = (req, res) => {  
    res.render('general/logout.ejs');   
};

//Regione Disconnetti
controller.getDisconnetti = (req, res) => {
    
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/");
};
controller.getAreaPersonaleCliente = (req, res) => {  
    res.render('cliente/areaPersonaleC.ejs');   
};

//per visualizzare storico prenotazioni
controller.getStoricoPrenotazioni = async (req, res) => {
    
    var dbPoolConnection = req.dbPool;
    var utente = req.session.utente;

    let prenotazioni = await prenotazioneModel.getStoricoPrenotazioni(req.dbPoolConnection,utente.id);
    res.render('cliente/Storico_B.ejs', {
     'prenotazioni' : prenotazioni}
    );  
    
};

controller.getInfoPrenotazione = async (req, res) => {  
  
    try {

        var dbConnection = req.dbPool;
        var prenotazione = req.body;

            res.render('cliente/InfoPrenotazione_B.ejs', {
                'prenotazione' : prenotazione,
               
            });
    } catch (error) {
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/AreaPersonaleCliente');
    }
};




//Per la modifica dei dati personali del cliente
controller.getModificaDati = (req, res) => {  
    res.render('cliente/DatiCliente.ejs');   
};

controller.postModificaDati = async (req, res) => {  

    // connessione + richiama autenticazione utente
    var dbPool = req.dbPool;
    var utente = req.session.utente;
    var modifiche = req.body.account;

    try {
        
            await accountModel.modificaDatiCliente(
                dbPool, 
                modifiche 
                //devo mettere tutti i dati?
                );
        

        await aggiornaSessioneUtente(req.dbConnection, req.session);
        
        req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Dati utente modificati con successo'
        };

        res.redirect('/AreaPersonaleCliente');
        
    } catch (error) {

        req.session.alert = {
            'style' : 'alert-warning',
            'message' : error.message
        }

        res.redirect('/utente/home'); //o '' ?

    }
}; 

async function aggiornaSessioneUtente(dbConnection, session){

    try {

        session.utente = await accountModel.getAccount(dbPool, session.utente.id);
        
        
    } catch(error) {

        throw error;

    }
};

module.exports = controller;