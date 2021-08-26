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
           req.body.nomeIntestatario, // Da mettere?
           req.body.cognomeIntestatario,// Da mettere?
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

      res.render('general/Home.ejs', { 'alert' : alert }); //mostra la home

    }
};


controller.getAutenticazione = (req, res) => { 
  res.render('general/LoginForm.ejs');   
};

controller.postAutenticazione = async (req, res) => {

  try {

      let attempt = req.body;
              
      req.session.utente = await accountModel.login(req.dbPool, attempt.email, attempt.psw); 
      if(req.session.utente.ruolo == "Cliente"){ // Cliente 
                  
          req.session.alert = {

              'style' : 'alert-info',
              'message' : 'Benvenuto su Moovy! ' + req.session.utente.nome,
          
          };
  
          res.redirect('/AreaPersonaleCliente'); 
      }
      else if(req.session.utente.ruolo == "Amministratore"){
         
          req.session.alert = {

              'style' : 'alert-success',
              'message' : 'Benvenuto su Moovy! ' + req.session.utente.nome,
          
          };

          res.redirect('/AreaPersonaleAmministratore'); 
      }
      else if(req.session.utente.ruolo == "Autista"){
     
        req.session.alert = {

            'style' : 'alert-success',
            'message' : 'Benvenuto su Moovy!' + req.session.utente.nome,
        
        };

        res.redirect('/AreaPersonaleAutista'); 
    }
    else {
        req.session.alert = {

            'style' : 'alert-success',
            'message' : 'Benvenuto su Moovy!' + req.session.utente.nome,
        
        };

        res.redirect('/AreaPersonaleAddetto'); 
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


controller.getFormA = async (req, res) => { 
    
    var tipo = req.body;
     //prende il tipo scelto dal body e poi fa il rendering del FormRicerca, che avrà più o meno campi in base al tipo   

    res.render('generale/FormRicercaA.ejs', {
        'tipo' : tipo,

});
};


controller.postFormA = async (req,res) =>{
    var dbPool = req.dbPool;
    var pre = req.body;
    try {

        let filtri = {
            'luogoritiro' : pre.luogo_ritiro,
            'luogoriconsegna' : pre.luogo_riconsegna,
            'dataritiro' : pre.data_ritiro,
            'datariconsegna' : pre.data_riconsegna,
            'categoria' : pre.categoria,
            'prezzo' : pre.prezzo,
            'tipo_veicolo' : pre.tipo_veicolo
        };

        let veicoli = await prenotazioneModel.cercaVeicolo( 
                dbPool, 
                filtri
            );
        
            res.render('generale/Risultati_ricerca.ejs', {
           'veicoli' : veicoli, 
           'pre' : pre,
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
    });
};

//Mostra schermata riepilogo con veicolo selezionato e i filtri 
controller.getRiepilogo = async(req,res) =>{
    res.render('generale/RiepilogoPrenot.ejs', {
        'veicolo' : veicolo,
        'pre' : pre,
    });
};



module.exports = controller;  