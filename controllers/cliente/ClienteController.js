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

    var dbPool = req.dbPool;
    var utente = accountModel.getAccount(dbPool, req.session.utente[0].id_account)
    console.log(utente[0].nome);

    try{
        
        res.render('cliente/DatiCliente.ejs',
        utente);  
    

    }catch(err){
        throw err;
    }

     
};

controller.postModificaDati = async (req, res) => {  

    // connessione + richiama autenticazione utente
    var dbPool = req.dbPool;
    var utente = req.session.utente;
    var modifiche = req.body.account;

    try {
        
            await accountModel.modificaDatiCliente(
                dbPool,
                req.body.nome,
                req.body.cognome,
                req.body.email,
                req.body.dataNascita,
                req.body.numeroTelefono,
                req.body.password, 
                req.body.codicePatente,
                req.body.dataScadenza,
                req.body.a,
                req.body.b,
                req.body.am,
                req.body.a1,
                req.body.a2, 
                req.body.numeroCarta,
                req.body.nomeIntestatario, // Da mettere?
                req.body.cognomeIntestatario,// Da mettere?
                req.body.scadenzaCarta,
                req.body.cvv,    
                
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

        res.redirect('/utente/cliente'); //o '' ?

    }
}; 

async function aggiornaSessioneUtente(dbConnection, session){

    try {

        session.utente = await accountModel.getAccount(dbPool, session.utente[0].id_account);
        
        
    } catch(error) {

        throw error;

    }
};

module.exports = controller;