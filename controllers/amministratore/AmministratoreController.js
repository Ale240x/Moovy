const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
////const convertitore = require('');

var controller={};
//Area Personale Amministratore
controller.getAreaPersonaleAmministratore = ( req, res) => {
    res.render('amministratore/AreaPersonaleAmministratore.ejs');
};

//Disconnetti

controller.getDisconnetti = (req, res) => {
    req.session.destroy();
    res.clearCookie("SID");
    res.redirect("/ospite");  ///??? OSPITE
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
    var dbConnection=req.dbPool;

    try{ 
        let id=await accountModel.getAccounts(dbConnection);// DA AGGIUNGERE AL MODEL ACCOUNT PER PRENDERE TUTTI GLI ACCOUNT
        id.forEach(id_account => {
           if(  id.ruolo=='autista'|| 'addetto'){ 

            res.render('amministratore/DatiImpiegati.ejs',{
                'idaccount':idaccount,
                'ruolo':ruolo,
                'nome':nome,
                'cognome':cognome
                });

            };
        });
    }catch(error){
        req.session.alert={
            'style':'alert-warining',
            'message': error.message
        }
        res.redirect('/amministratore/AreaPersonaleAmministratore');

    }
};
controller.postDatiImpiegati =async(req,res)=>{
    var dbConnection= req.dbPool;

    try{
        let impiegato= req.body.id_account;

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

controller.getFormModifica=async(req,res)=>{
    res.render('/amministratore/FormModifica.ejs');
}
controller.postFormModifica=async(req,res)=>{
    var dbPoolConncection=req.dbPool;
    
    try{ 
        await accountModel.modificaDati(
            dbPoolConncection,
            req.body.id_account,
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
            );
            
            res.render('/amministratore/AreaPersonaleAmministratore');
       
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.render('/amministratore/AreaPersonaleAmministratore');
    }
    
}
// SESSIONE?

async function aggiornaSessioneAccount(dbConnection, session){

    try {

        session.account = await accountModel.getaccounnt(dbConnection, session.account.id);
      //  session.account.ddn = convertitore.getDataTypeData(session.account.ddn);
        
    } catch(error) {

        throw error;

    }
};

//eliminaAccount
controller.getFormFiltraggio= (req,res)=>{
    res.render('amministratore/FormFiltraggio.ejs',{
        'cognome':cognome,
        'nome':nome,
        'ruolo':ruolo
    });
};

controller.postFormFiltraggio = async(req,res)=>{
    var dbConnection= req.dbPool;
    try{ 
        await accountModel.getAccountsFiltrati( //account filtrati metodo da aggiugere al model account 
            dbConnection,
            req.body.nome,
            req.body.cognome,
            req.body.ruolo,
            );
    res.render('amministratore/DatiAccount.ejs',{
        'nome':nome,
        'cognome':cognome,
        'ruolo':ruolo
    });
    }catch(error){

       res.render('amministratore/DatiAccount.ejs');
    }
};


controller.getDatiAccount = (req, res) => {  
    res.render('amministratore/DatiAccount.ejs');   
};

controller.postDatiAccount = async (req, res) => {  
        var dbConnection= req.dbPool;
    
    
        try{
            let id =req.body.id_account;
            let account=await accountModel.getAccount(dbConnection,id);

            await accountModel.eliminaAccount(
                    dbConnection,
                    account,
                );
            req.render('amministratore/AreaPersonaleAmminstratore.ejs');
                
            }catch(error) { 
    
                req.render('amministratore/AreaPersonaleAmminstratore.ejs');
            } 
    
        
    }
    
module.exports = controller