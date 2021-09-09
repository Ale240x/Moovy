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


/*controller.postDatiImpiegati =async(req,res)=>{
    var dbPool= req.dbPool;

    try{
        console.log(req.body.id_account);
        let impiegato = await accountModel.getAccount(dbPool, req.body.id_account);
        console.log(impiegato[0].nome);

        req.render('amministratore/FormModifica.ejs',{
            'nome':impiegato.nome,
            'cognome':impiegato.cognome,
            'datadinascita':impiegato.datadinascita,
            'numerodicellulare':impiegato.numerodicellulare,
            'email':impiegato.email,
            'ruolo':impiegato.ruolo,
            'codicepatente':impiegato.codicepatente,
            'datadirilascio':impiegato.datadirilascio,
            'scadenzapatene':impiegato.scadenzapatene,
            'am':impiegato.am,
            'a1':impiegato.a1,
            'a2':impiegato.a2,
            'b':impiegato.b
        });
            
        }catch(error){
            req.session.alert={
                'style':'alert-warining',
                'message': error.message
            }
            res.redirect('/amministratore/AreaPersonaleAmministratore');
    
        }         
};
*/

controller.getFormModifica=async(req,res)=>{
    var dbPool =req.dbPool;
    var id_account = req.params.id;
   // console.log("sono su get modifica")
   // console.log(req.params.id);
    
    try{

        var impiegato = await accountModel.getImpiegato(dbPool, id_account);

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


/*controller.getDatiAccount = (req, res) => { 
    let id= req.params.id; 
   // console.log("sono su get " + id);
    res.render('amministratore/Elimina.ejs',{
        id : id,
    });   
}; 
*/
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