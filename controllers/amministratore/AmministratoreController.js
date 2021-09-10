const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
////const convertitore = require('');


var controller={};

//schermata iniziale dopo l'autenticazione Amministratore
controller.getSchermataIniziale = (req, res) => {  
    res.render('amministratore/HomeAutenticatoAmm.ejs');   
};


//Disconnetti

controller.getDisconnetti = (req, res) => {

    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/");  //ospite
};

//Area Personale Amministratore
controller.getAreaPersonaleAmministratore = ( req, res) => {
    res.render('amministratore/areaPersonaleAmm.ejs');
};

////Registrazione Impiegati
controller.getRegistrazioneImpiegati =(req,res)=> {
    res.render('amministratore/RegistrazioneImp.ejs');

};

controller.postRegistrazioneImpiegati = async(req,res)=> {

    var dbPool = req.dbPool;
    var data = new Date(req.body.data_di_nascita);
    var scadenza_patente = new Date(req.body.scadenza_patente);
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

    console.log(req.body);

    try{
           await accountModel.registrazioneImpiegato( 
           dbPool,
           req.body.ruolo,
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
           req.body.tipo_a2         
           );
        req.session.alert = {
  
            'style' : 'alert-info',
            'message' : 'Sei registrato! ',
        
        };
        
        console.log("Impiegato è stato registrato!");

        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');

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
      res.redirect('/utente/amministratore/AreaPersonaleAmministratore/');

    }
        
    
};

//Modifica Dati Impiegati

controller.getDatiImpiegati = async(req,res)=>{
    var dbPool = req.dbPool;

   try{ 
        var impiegati =await accountModel.getAccountsImpiegati(dbPool);
       // console.log(impiegati[0].id_account);
        res.render("amministratore/DatiImpiegati.ejs", 
            {impiegati : impiegati,
            
        })

    }catch(error){
        req.session.alert={
            'style':'alert-warining',
            'message': error.message
        }
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');

    }
};



controller.getFormModifica=async(req,res)=>{
    var dbPool =req.dbPool;
    var id_account = req.params.id;
   // console.log("sono su get modifica")
   // console.log(req.params.id);
    
    try{

        var impiegato = await accountModel.getImpiegato(dbPool, id_account);
        console.log(impiegato);
        res.render("amministratore/FormModifica.ejs",{
            impiegato: impiegato
        });

    }catch (error) {

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
        }    

        res.redirect('/utente/amministratore/AreaPersonaleAmministratore')
    }  
   
}


controller.postFormModifica=async(req,res)=>{
    var dbPool=req.dbPool;
   // console.log(req.params.id);
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
    try{ 
        await accountModel.modificaDatiImpiegato(
            dbPool,
            req.params.id,
            req.body.nome,
            req.body.cognome,
            req.body.data_di_nascita,
            req.body.num_telefono,
            req.body.email,
            req.body.ruolo,
            req.body.codice_patente,
            req.body.scadenza_patente,
            req.body.tipo_a,
            req.body.tipo_b,
            req.body.tipo_am,
            req.body.tipo_a1,
            req.body.tipo_a2
            

            );
            req.session.alert = {
                'style' : 'alert-success',
                'message' : "Dati dell'impiegato  modificati con successo!"
            };
            
            res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
       
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    }
    
}


//eliminaAccount

controller.getFormFiltraggio = (req,res) =>{

    res.render('amministratore/FormFiltraggio.ejs');
}

controller.postFormFiltraggio = async(req,res)=>{
    var dbPool= req.dbPool;
   // console.log(req.body.ruolo);
    try{ 
       var accounts =  await accountModel.getAccountsFiltrati( //account filtrati metodo da aggiugere al model account 
            dbPool,
            req.body.ruolo,
            );
        
        console.log(accounts);

        res.render('amministratore/DatiAccount.ejs',{
            accounts : accounts,
        });


    }catch(error){

        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    }
};



controller.getDatiAccount = async (req, res) => {  
        var dbPool= req.dbPool;
        try{
            
            let id =req.params.id;
            //console.log("sono su post  "+id);

            await accountModel.eliminaAccount(
                    dbPool,
                    req.params.id,
                );
            
            req.session.alert = {
                'style' : 'alert-success',
                'message' : "Account eliminato con successo!"
                };
            
            res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
                
            }catch(error) { 

                req.session.alert = {
                    'style' : 'alert-warning',
                    'message' : error.message
                    };
                
                res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
            } 
    
        
    };
    
module.exports = controller;