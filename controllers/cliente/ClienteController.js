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
    res.render('cliente/areaPersonaleC.ejs');   
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


controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('cliente/TipiVeicoli.ejs');  
};


controller.getFormA = (req, res) => {
    var url = req.url.split('=');
    var tipo_veicolo = url[1];
    res.render('cliente/FormRicercaA.ejs', { 'tipo_veicolo' : tipo_veicolo });
};


controller.postFormA = async (req,res) =>{
    var dbPool = req.dbPool;
    var sel = req.body;
    
    sel.data_ritiro = req.body.data_ritiro.replace('T', ' ') + ':00';
    sel.data_riconsegna = req.body.data_riconsegna.replace('T', ' ') + ':00';
    
    luogo_ritiro = req.body.luogo_ritiro.split(',');
    sel.luogo_ritiro = luogo_ritiro[0];

    /*console.log('Luogo ritiro: '+ sel.luogo_ritiro); //test
    console.log('Autista: '+ sel.autista); //test
    console.log('Categoria: '+ sel.modello_auto); //test
    console.log('Luogo partenza: ' + sel.luogo_partenza); //test
    console.log('Data ritiro: '+ sel.data_ritiro); //test*/
    
    try {

        var veicoli = await prenotazioneModel.cercaVeicolo( 
                dbPool, 
                sel
            );
        
        res.render('cliente/RisultatiRicerca.ejs', 
        { 
            veicoli: veicoli,
            /*sel: {
                tipo_veicolo: sel.tipo_veicolo,
                autista: sel.autista,
                luogo_partenza: sel.luogo_partenza,
                luogo_arrivo: sel.luogo_arrivo,
                luogo_ritiro: sel.luogo_ritiro,
                luogo_riconsegna: sel.luogo_riconsegna,
                data_ritiro: sel.luogo_ritiro,
                luogo_riconsegna: sel.luogo_riconsegna,
                modello_auto: sel.modello_auto,
                modello_moto: sel.modello_moto
            }*/
        });
        

    } catch (error) {

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }      
    
    }
};

controller.getInfoVeicolo = async(req,res) =>{
    var dbPool = req.dbPool;
    var id_veicolo = req.params.id;
    console.log('id_veicolo: '+id_veicolo); //test  
    
    try{
        var veicolo = await prenotazioneModel.getVeicolo(dbPool, id_veicolo);
        
        res.render('cliente/InfoVeicolo.ejs', {
            veicolo: veicolo
        });
        

    } catch (error) {

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }      
    }   
};

//Mostra schermata riepilogo con veicolo selezionato e i filtri 
controller.getRiepilogo = async(req,res) =>{
    res.render('cliente/RiepilogoPrenotazione.ejs');
};

module.exports = controller;