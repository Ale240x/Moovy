const accountModel = require('../models/accountModel');


var controller = {};

controller.getSchermataIniziale = (req, res) => {  
    
    res.render('general/Home.ejs');   //renderizza Home.ejs   

};

controller.getRegistrazioneCliente = (req, res) => {  

    res.render('general/RegistrazioneForm.ejs');   
    
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
  res.render('general/loginForm.ejs');   
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
  
          res.redirect('/utente/cliente/AreaPersonaleCliente'); 
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

controller.getRecuperaPass =(req,res)=>{

        res.render('general/RecuperaPass.ejs')
};

controller.postRecuperaPass =(req,res)=>{
    var dbPool = req.dbPool;
    try{

        let email= req.body;
        console.log(email);
        let codice = Math.floor(Math.random() * 10000);
        //DOVE DEVO SALVARE questo codice per poi confrontare con codice immesso dall'utente?? localstorage? 
        recuperoPasswordEmail(req.transporter,email, codice);
        res.render('general/CodiceP.ejs',{
            'codice':codice,
            'email':email
        });

    }catch(error){

        throw error;

    }

};


controller.postCodice =(req,res)=>{
    var dbPool = req.dbPool;
    try{
        let codiceInserito= req.body;
        if (codiceInserito == codice){
            res.render('general/NuovaPass.ejs')
        }else{
            
            res.redirect('general/CodiceP.ejs');
        }

    }catch(error){

    }
    res.render('general/NuovaPass.ejs')
   
};


controller.postNuovaPass = async (req,res)=>{
    var dbPool = req.dbPool;
    try{
        let NuovaPassword = req.body.nuovaPass;
        req.session.utente
        await accountModel.recuperoPassword(dbPool, req.session.utente);
        
    }catch(error){
        throw error;
    }
  
    
}


controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('general/TipiVeicoli_B.ejs');   
};

//Regione Ricerca Veicolo
controller.postRicercaTipoVeicoli = async (req, res) => { 
    
    var tipo = req.body.tipo_veicolo;

    res.render('cliente/FormRicercaA.ejs', {
        'tipo' : tipo,
        
    });

};



controller.postRicercaVeicoli = async (req,res) => {
    var dbPool = req.dbPool;
    var pre_prenotazione = req.body;   //contiene tutti i dati dei filtri inseriti+ il tipo
    try {

        if(pre_prenotazione.tipo_veicolo != "Auto " || pre_prenotazione.tipo_veicolo != "Moto"){

        let filtri = {
            'luogoritiro' : pre_prenotazione.luogo_ritiro,
            'luogoriconsegna' : pre_prenotazione.luogo_riconsegna,
            'dataritiro' : pre_prenotazione.data_ritiro,
            'datariconsegna' : pre_prenotazione.data_riconsegna,
            'tipo_veicolo' : pre_prenotazione.tipo_veicolo
        };

        let veicoli = await prenotazioneModel.cercaVeicolo( 
                req.dbPoolConnection, 
                filtri
            );
        
        res.render('cliente/Risultati_ricerca.ejs', {
           'veicoli' : veicoli, 
           'pre_prenotazione' : pre_prenotazione,
                });
        }
        else{
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
                req.dbPoolConnection, 
                filtri
            );
        
        res.render('cliente/Risultati_ricerca.ejs', {
           'veicoli' : veicoli, 
           'pre_prenotazione' : pre_prenotazione,
                });

        }

    } catch (error) {

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }

        
    
    }

};


controller.postInfoVeicolo= async (req, res) => { 
       var dbPool = req.dbPool;
        var veicolo = req.body.veicolo;
        var pre_prenotazione = req.body.pre_prenotazione;
    
    try {     
        res.render('cliente/InfoVeicolo.ejs', {
            'veicolo' : veicolo,
            'pre_prenotazione' : pre_prenotazione,
        });
    
    } catch (error) {
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }


    }
};


async function recuperoPasswordEmail(transporter, email, codice ){

    try{
        
        let mailSubject = 

        `
        Recupera Password.
        <br>
        Gentile Utente,
        ecco il codice ${codice} per resettare la tua password;
        <br>
        <br>
        Saluti,
        <br>
        -Il team Moovy.
        <hr>
        `;

        let mailOpt ={
            'from': '',
            'to':email,
            'subject':'Reset Password - Moovy',
            'html': mailSubject

        };

        transporter.sendmail(mailOpt);

    }catch(error){
        throw error;
    }
};


module.exports = controller;  