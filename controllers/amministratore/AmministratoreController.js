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
    res.render('amministratore/RegistrazioneImpiegati.ejs');

};
/// SI DEVE IMPLEMENTARE CON WHILE? NEL SEQUENCE è RAPPRESENTATO CON UN LOOP
controller.postRegistrazioneImpiegati = async(req,res)=> {
    var dbPool = req.dbPool;

    try{
        let emailnuovo =req.body.email;
        let query=util.promisify(dbPool.query).bind(dbPool);

        let mail = (await await query(`
                    SELECT id_account
                    FROM account
                    WHERE email=emailnuovo
                    `));
        if (mail == 0){ 
            await accountModel.aggiungiAccount(
                dbPoolConncection,
                req.body.nome,
                req.body.cognome,
                req.body.email,
                req.body.datadinascita,
                req.body.ruolo,
                req.body.numerodicellulare,
                req.body.codicepatente,
                req.body.datarilasciopatente,
                req.body.scadenzapatente,
                req.body.tipipatente,
                req.body.password,
                1
                );
            }else{
                let alert={
                    'style':'alert-danger',
                    'message': error.message
                };
                alert.message="email già esistente";

                res.render('amministratore/RegistrazioneImpiegati.ejs', {'alert':alert});
                
            }
        
        res.redirect(307,"amministratore/AreaPersonaleAmministratore");
    }catch(error){

        let alert={
            'style': 'alert-danger',
            'message': error.message
            };
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

    try{ 
       var accounts =  await accountModel.getAccountsFiltrati( //account filtrati metodo da aggiugere al model account 
            dbPool,
            req.body.nome,
            req.body.cognome,
            req.body.ruolo,
            );
        
       // console.log(accounts);

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


controller.getDatiAccount = (req, res) => { 
    let id= req.params.id; 
   // console.log("sono su get " + id);
    res.render('amministratore/Elimina.ejs',{
        id : id,
    });   
}; 

controller.postDatiAccount = async (req, res) => {  
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