const { render } = require('ejs');
const { redirect } = require('ejs');
const accountModel = require('../models/accountModel');
const prenotazioneModel = require('../models/prenotazioneModel');
const util = require("util");

var controller = {};

controller.getSchermataIniziale = (req, res) => {  
    
    res.render('general/Home.ejs');   //renderizza Home.ejs   

};

controller.getDisconnetti = (req, res) => {

    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/");  //ospite
};

controller.getRegistrazioneCliente = (req, res) => {  

    res.render('general/RegistrazioneForm.ejs');   
    
};

controller.postRegistrazioneCliente = async (req, res) => {  

    var dbPool = req.dbPool;
    var data = new Date(req.body.data_di_nascita);
    var scadenza_patente = new Date(req.body.scadenza_patente);
    console.log(req.body);
    try{
           await accountModel.registrazioneCliente( 
           dbPool,
           req.body.nome,
           req.body.cognome,
           req.body.email,
           data,
           req.body.num_telefono,
           req.body.password, 
           req.body.codice_patente,
           scadenza_patente,
           req.body.tipo_a,
           req.body.tipo_b,
           req.body.tipo_am,
           req.body.tipo_a1,
           req.body.tipo_a2, 
           req.body.numero_carta,
           req.body.nome_intestatario, 
           req.body.cognome_intestatario,
           req.body.scadenza_carta,
           req.body.cvv,         
           );
        req.session.alert = {
  
            'style' : 'alert-info',
            'message' : 'Sei registrato! ',
        
        };
        
        console.log("sono registrata!");

        res.render('general/Home.ejs');

      } catch(error){
        
      let alert = {
          'style' : 'alert-danger',
          'message' : error.message
      };
      console.log(req.body.password);

      console.log(error.message);
      
      if(error.code == "ER_DUP_ENTRY"){ //se c'è duplicazione email
          alert.message = "email già in uso";
      }
      res.redirect('/');

    }
};


controller.getAutenticazione = (req, res) => { 

    res.render('general/loginForm.ejs');   
};

controller.postAutenticazione = async (req, res) => {

    try {
  
        let attempt = req.body;
        //var referer = req.body.referer;

        req.session.utente = await accountModel.login(req.dbPool, attempt.email, attempt.password); 
        //console.log('utente: ' +req.session.utente);
        //res.redirect(referer);
        console.log(req.session.prenotazione);
        if(req.session.utente[0].ruolo == "Cliente"){ // Cliente 
         
            req.session.alert = {
  
                'style' : 'alert-info',
                'message' : 'Benvenuto su Moovy! ' + req.session.utente[0].nome,
            
            };
            //res.render('cliente/areaPersonaleC.ejs');
            //res.redirect('back');
            res.redirect('/utente/cliente/AreaPersonaleCliente'); 
        }
        else if(req.session.utente[0].ruolo == "Amministratore"){
           
            req.session.alert = {
  
                'style' : 'alert-success',
                'message' : 'Benvenuto su Moovy! ' + req.session.utente[0].nome,
            
            };
            //res.render('amministratore/areaPersonaleAmm.ejs');
            res.redirect('/utente/amministratore/AreaPersonaleAmministratore'); 
        }
        else if(req.session.utente[0].ruolo == "Autista"){
       
          req.session.alert = {
  
              'style' : 'alert-success',
              'message' : 'Benvenuto su Moovy!' + req.session.utente[0].nome,
          
          };
         // res.render('autista/areaPersonaleAut.ejs');
          res.redirect('/utente/autista/AreaPersonaleAutista'); 
      }
      else {
          req.session.alert = {
  
              'style' : 'alert-success',
              'message' : 'Benvenuto su Moovy!' + req.session.utente[0].nome,
          
          };
          //res.render('addetto/areaPersonaleAdd.ejs');
          res.redirect('/utente/addetto/'); 
      }
      
  
    } catch(error) { 
    
        let alert = {
            'style' : 'alert-danger',
            'message' : error.message
        }
        console.log(error);
        console.log(error.message);
        res.redirect('/autenticazione');
  
    }
  };

controller.getRecuperaPass =(req,res)=>{

    res.render('general/RecuperaPass.ejs')
};

controller.postRecuperaPass = async (req,res)=>{

var dbPool = req.dbPool;

try{

    var email= req.body.email;

    console.log(email);

    var codice = Math.floor(Math.random() * 1000000);

    console.log(codice);

    let query = util.promisify(dbPool.query).bind(dbPool);
    var utente = (await query(
        'SELECT * FROM account WHERE email = ?', 
        [email]));
    console.log(utente);
    var id_account= utente[0].id_account;
    console.log(id_account);
   // recuperoPasswordEmail(req.transporter,email, codice);
    
    res.render('general/CodiceP.ejs',{
        codice: codice,
        id_account: id_account
        
    });

}catch(error){

    throw error;

}

};


controller.postCodice =(req,res)=>{

    var dbPool = req.dbPool;
    var id_account = req.body.id_account;
  //  var id = req.params.id;
   

        var codiceInserito= req.body.codice;
        console.log(codiceInserito);
        var codice= req.body.codiceP;
        console.log(codice);
        
        //console.log(id);
       
        if (codiceInserito == codice){

            res.render('general/NuovaPass.ejs', {id_account: id_account});

        }else{

            req.session.alert = {
  
                'style' : 'alert-warning',
                'message' : 'codice inserito non è valido!',
            
            };
        
            res.render('/recuperaPass/codice');
        }

    


};


controller.postNuovaPass = async (req,res)=>{

    var dbPool = req.dbPool;
    var id_account = req.body.id_account;

    try{

        var nuovaPassword = req.body.nuovaPassword;
        
        var utente = req.session.utente;
        await accountModel.recuperoPassword(dbPool, id_account, nuovaPassword);
        req.session.alert = {
  
            'style' : 'alert-info',
            'message' : 'Password aggiornata correttamente!',
        
        };
        res.redirect('/');
    }catch(error){

        req.session.alert = {
  
            'style' : 'alert-warning',
            'message' : error.message,
        
        };
        res. redirect('back');

    }


}  

//Regione Ricerca Veicoli
controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('general/TipiVeicoli.ejs');  
};


controller.getFormA = (req, res) => {
    var url = req.url.split('=');
    var tipo_veicolo = url[1];
    req.session.prenotazione = {'id': undefined};
    prenotazione = req.session.prenotazione;
    prenotazione.tipo_veicolo = tipo_veicolo;
    res.render('general/FormRicercaA.ejs', { 'tipo_veicolo' : tipo_veicolo });
};


controller.postFormA = async (req,res) =>{
    var dbPool = req.dbPool;
    req.body.data_ritiro = req.body.data_ritiro.replace('T', ' ') + ':00';
    req.body.data_riconsegna = req.body.data_riconsegna.replace('T', ' ') + ':00';
    req.body.luogo_ritiro = req.body.luogo_ritiro.split(',')[0];
    req.body.luogo_riconsegna = req.body.luogo_riconsegna.split(',')[0];

    req.session.prenotazione = req.body;
    var sel = req.session.prenotazione;
    
    try {

        var veicoli = await prenotazioneModel.cercaVeicolo( 
                dbPool, 
                sel
            );
        
        res.render('general/RisultatiRicerca.ejs', 
        { 
            veicoli: veicoli
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
    req.session.prenotazione.ref_veicolo = id_veicolo;
    console.log('id_veicolo: '+id_veicolo); //test  
    
    try{
        var veicolo = await prenotazioneModel.getVeicolo(dbPool, id_veicolo);
        
        req.session.prenotazione.patente_richiesta = veicolo[0].patente_richiesta;
        console.log(req.session.prenotazione);//test
        
        res.render('general/InfoVeicolo.ejs', {
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
    id_veicolo = req.params.id;
    prezzo_stimato = req.query.prezzo_stimato;
    req.session.prenotazione.prezzo_stimato = prezzo_stimato;
    res.render('general/RiepilogoPrenotazione.ejs'), { id_veicolo: id_veicolo };
};

//Regione Recupera Password
async function recuperoPasswordEmail(transporter, email, codice ){

    try{
        
        let mailSubject = 

        `
        Recupera Password.
        <br>
        Gentile Utente,
        ecco il codice ${codice} per resettare la sua password;
        <br>
        <br>
        Saluti,
        <br>
        -Il team Moovy.
        <hr>
        `;

        let mailOpt ={
            'from': 'moovyprogetto@gmail.com',
            'to':email,
            'subject':'Reset Password - Moovy',
            'html': mailSubject
           // 'text':'Prova prova email'

        };

        transporter.sendMail(mailOpt, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });
          ;

    }catch(error){
        throw error;
    }
};

module.exports = controller;  