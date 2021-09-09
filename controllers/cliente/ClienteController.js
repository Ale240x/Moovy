const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');

var controller = {}; //assegna al controller un valore nullo

//Regione Area Personale Cliente
//schermata iniziale dopo l'autenticazione Cliente
controller.getSchermataIniziale = (req, res) => {  
    res.render('cliente/HomeAutenticatoCliente.ejs');   
};
//logout.ejs non serve? 
controller.getLogout = (req, res) => {  
    res.render('general/logout.ejs');   
};

//Regione Disconnetti
controller.getDisconnetti = (req, res) => {
    
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/"); //ospite
};
controller.getAreaPersonaleCliente = (req, res) => {  
    console.log('arriva dentro area personale');
    var pre = req.session.prenotazione;
    
    if(!pre){
        let prezzo_stimato = null;
        let prezzo_totale = null;

        res.render('cliente/areaPersonaleC.ejs',
        { prezzo_stimato: prezzo_stimato,
        prezzo_totale: prezzo_totale}); 
    }
    else{
        res.render('cliente/areaPersonaleC.ejs',
        { prezzo_stimato: pre.prezzo_stimato,
        prezzo_totale: pre.prezzo_totale}); 
    }
      
};

//per visualizzare storico prenotazioni
controller.getStoricoPrenotazioni = async (req, res) => {

    try{
    
    var dbPool = req.dbPool;

    let prenotazioni = await prenotazioneModel.getStoricoPrenotazioni(dbPool, req.session.utente[0].id_account);
    res.render('cliente/Storico_B.ejs', {
     'prenotazioni' : prenotazioni
    });  
} catch (error) {
        
    req.session.alert = {
        
        'style' : 'alert-warning',
        'message' : error.message

    }
   
}
    
};

controller.getInfoPrenotazione = async (req, res) => {  
  
    try {

        var dbPool= req.dbPool;
        var id_prenotazione = req.params.id;

        let prenotazioneC = await prenotazioneModel.getPrenotazione(dbPool, id_prenotazione);

        
            res.render('cliente/InfoPrenotazione_B.ejs', {
                'prenotazione' : prenotazioneC[0],
               
            });
    } catch (error) {
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        
    }
};



//Per la modifica dei dati personali del cliente
controller.getModificaDati = (req, res) => {          
        res.render('cliente/DatiCliente.ejs');   
};

controller.postModificaDati = async (req, res) => {  
    var dbPool = req.dbPool;
    var dati = req.body;
    
    if(!dati.tipo_a){
        dati.tipo_a = 0;
    }
    if(!dati.tipo_am){
        dati.tipo_am = 0;
    }
    if(!dati.tipo_a1){
        dati.tipo_a1 = 0;
    }
    if(!dati.tipo_a2){
        dati.tipo_a2 = 0;
    }
    if(!dati.tipo_b){
        dati.tipo_b = 0;
    }
    // connessione + richiama autenticazione utente
    try {
       
        var utente = req.session.utente;
               
            await accountModel.modificaDatiCliente(
                dbPool,
                req.session.utente[0].id_account,
                req.body.nome,
                req.body.cognome,
                req.body.data_di_nascita,
                req.body.num_telefono, 
                req.body.email,
                req.body.ruolo,
                req.body.numero_carta,
                req.body.nome_intestatario,
                req.body.cognome_intestatario,
                req.body.cvv,
                req.body.scadenza_carta,
                req.body.codice_patente,
                req.body.scadenza_patente,
                dati.tipo_a,
                dati.tipo_b,
                dati.tipo_am,
                dati.tipo_a1,
                dati.tipo_a2,          
                );
        
        
        await aggiornaSessioneUtente(req.dbPool, req.session);
        
        req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Dati utente modificati con successo'
        };

        res.redirect('/utente/cliente/AreaPersonaleCliente');
        
    } catch (error) {

        req.session.alert = {
            'style' : 'alert-warning',
            'message' : error.message
        }

        res.redirect('/utente/cliente/AreaPersonaleCliente'); 

    }
}; 

async function aggiornaSessioneUtente(dbPool, session){

    try {

        session.utente = await accountModel.getAccount(dbPool, session.utente[0].id_account);
        
        
    } catch(error) {

        throw error;

    }
};

module.exports = controller;