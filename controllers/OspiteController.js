const accountModel = require('../models/accountModel');


var controller = {};

controller.getSchermataIniziale = (req, res) => {  
    
    res.render('/Home.ejs');   //renderizza Home.ejs   

};

controller.getRegistrazioneCliente = (req, res) => {  

    res.render('cliente/RegistrazioneForm.ejs');   
    
};

controller.postRegistrazioneCliente = async (req, res) => {  

    var dbPool = req.dbPool;

    try{
           await accountModel.registrazioneCliente( 
           dbPool,
           req.body.nome,
           req.body.cognome,
           req.body.email,
           req.body.dataNascita,
           req.body.numeroTelefono,
           req.body.psw, 
           req.body.codicePatente,
           req.body.dataScadenza,
           req.body.a,
           req.body.b,
           req.body.am,
           req.body.a1,
           req.body.a2, 
           req.body.numeroCarta,
           req.body.nomeIntestatario, //
           req.body.cognomeIntestatario,//
           req.body.scadenzaCarta,
           req.body.cvv,         
           );


      } catch(error){
        
      let alert = {
          'style' : 'alert-danger',
          'message' : error.message
      };
      
      if(error.code == "ER_DUP_ENTRY"){ //se c'è duplicazione email
          alert.message = "email già in uso";
      }

      res.redirect('general/Home.ejs', { 'alert' : alert }); //mostra la home

    }
};


controller.getAutenticazione = (req, res) => { 
  res.render('general/Autenticazione.ejs');   
};

controller.postAutenticazione = async (req, res) => {

  try {

      let attempt = req.bod;
              
      req.session.utente = await accountModel.login(req.dbPool, attempt.email, attempt.psw); 
      if(req.session.utente.ruolo == "Cliente"){ //1 Cliente 
                  
          req.session.alert = {

              'style' : 'alert-info',
              'message' : 'Benvenuto su Moovy! ' + req.session.utente.nome,
          
          };
  
          res.redirect('/utente/cliente/AreaPersonaleC'); 
      }
      else if(req.session.utente.ruolo == "Amministratore"){
         
          req.session.alert = {

              'style' : 'alert-success',
              'message' : 'Benvenuto su Moovy! ' + req.session.utente.nome,
          
          };

          res.redirect('/utente/amministratore/AreaPersonaleAmm'); 
      }
      else if(req.session.utente.ruolo == "Autista"){
     
        req.session.alert = {

            'style' : 'alert-success',
            'message' : 'Benvenuto su Moovy!' + req.session.utente.nome,
        
        };

        res.redirect('/utente/autista/AreaPersonaleAut'); 
    }
    else {
        req.session.alert = {

            'style' : 'alert-success',
            'message' : 'Benvenuto su Moovy!' + req.session.utente.nome,
        
        };

        res.redirect('/utente/addetto/AreaPersonaleAdd'); 
    }


  } catch(error) { 
  
      let alert = {
          'style' : 'alert-danger',
          'message' : error.message
      }
      
     

  }
};


controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('generale/TipiVeicoli_B.ejs');   
};

//Regione Ricerca Veicolo
controller.postRicercaTipoVeicoli = async (req, res) => { 
    
    var tipo = req.body.tipo_veicolo;

    try{

    res.render('generale/FormRicercaA.ejs', {
        'tipo' : tipo,
        
    });

    if(tipo=="Moto"||tipo=="Auto"){
        res.render('generale/FormRicercaB.ejs')
    }


    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message

    }

};


controller.postFormA = (req,res) =>{
    var dbPool = req.dbPool;
    var pre_prenotazione = req.body;
    try {

        let filtri = {
            'luogoritiro' : pre_prenotazione.luogo_ritiro,
            'luogoriconsegna' : pre_prenotazione.luogo_riconsegna,
            'dataritiro' : pre_prenotazione.data_ritiro,
            'datariconsegna' : pre_prenotazione.data_riconsegna,
            'tipo_veicolo' : pre_prenotazione.tipo_veicolo
        };

        let veicoli = await prenotazioneModel.cercaVeicolo( 
                req.dbPool, 
                filtri
            );
        
            res.render('generale/Risultati_ricerca.ejs', {
           'veicoli' : veicoli, 
           'pre_prenotazione' : pre_prenotazione,
                });

    } catch (error) {

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }      
    
    }
    };

    controller.postFormB = (req,res) =>{
        var dbPool = req.dbPool;
        var pre_prenotazione = req.body;
        try {
    
            let filtri = {
                'luogoritiro' : pre_prenotazione.luogo_ritiro,
                'luogoriconsegna' : pre_prenotazione.luogo_riconsegna,
                'dataritiro' : pre_prenotazione.data_ritiro,
                'datariconsegna' : pre_prenotazione.data_riconsegna,
                'categoria' : pre_prenotazione.categoria,
                'prezzo' : pre_prenotazione.prezzo,
                'tipo_veicolo' :pre_prenotazione.tipo_veicolo
            };
    
            let veicoli = await prenotazioneModel.cercaVeicolo( 
                    req.dbPool, 
                    filtri
                );
            
                res.render('generale/Risultati_ricerca.ejs', {
               'veicoli' : veicoli, 
               'pre_prenotazione' : pre_prenotazione,
                    });
    
        } catch (error) {
    
            req.session.alert = {
                
                'style' : 'alert-warning',
                'message' : error.message
        
            }      
        
        }
        };

controller.getInfoVeicolo = async(req,res) =>{
    res.render('generale/InfoVeicolo.ejs', {
        'veicolo' : veicolo,
        'pre_prenotazione' : pre_prenotazione,
    });
};

controller.getPrenotazioneTemporanea= async (req, res) => { 
       var dbPool = req.dbPool;
        var veicolo = req.body.veicolo;
        var pre_prenotazione = req.body.pre_prenotazione;
    
    try {  
        prenotazioneId = await prenotazioneModel.aggiungiPrenotazione( dbPool, null , null, pre_prenotazione.tipo_veicolo, pre_prenotazione.ref_veicolo, null, pre_prenotazione.data_ritiro, pre_prenotazione.data_riconsegna, pre_prenotazione.luogo_ritiro, pre_prenotazione.luogo_riconsegna, 0);
        
        res.render('generale/RiepilogoPrenot.ejs', {
            'prenotazioneId': prenotazioneId,
        });
    
    } catch (error) {
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }


    }
};

controller.getControlloAutenticazione= async (req, res) => { 
    var dbPool = req.dbPool;
 
 try { 
     if(req.sessione.utente == null) {
        await this.getAutenticazione();
     }
     else{
         res.redirect ('/cliente/prenota');
     }
 
 } catch (error) {
     
     req.session.alert = {
         
         'style' : 'alert-warning',
         'message' : error.message
 
     }


 }
};








module.exports = controller;  