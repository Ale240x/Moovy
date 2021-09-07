const { render } = require('ejs');
const { redirect } = require('ejs');
const accountModel = require('../models/accountModel');
const prenotazioneModel = require('../models/prenotazioneModel');

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

    try{
           await accountModel.registrazioneCliente( 
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
    //var referer = req.get('referer').split('3000')[1];
    res.render('general/loginForm.ejs' 
  /*{ 'referer' : referer }*/);   
};

controller.postAutenticazione = async (req, res) => {

    try {
  
        let attempt = req.body;
        //var referer = req.body.referer;

        req.session.utente = await accountModel.login(req.dbPool, attempt.email, attempt.password); 
        //console.log(req.session.utente[0].ruolo);
        //res.redirect(referer);

        if(req.session.utente[0].ruolo == "Cliente"){ // Cliente 
                    
            req.session.alert = {
  
                'style' : 'alert-info',
                'message' : 'Benvenuto su Moovy! ' + req.session.utente[0].nome,
            
            };
            //res.render('cliente/areaPersonaleC.ejs');
            res.redirect('back');
            //res.redirect('/utente/cliente/AreaPersonaleCliente'); 
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

//Regione Ricerca Veicoli
controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('general/TipiVeicoli.ejs');  
};


controller.getFormA = (req, res) => {
    var url = req.url.split('=');
    var tipo_veicolo = url[1];
    res.render('general/FormRicercaA.ejs', { 'tipo_veicolo' : tipo_veicolo });
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
        
        res.render('general/RisultatiRicerca.ejs', 
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