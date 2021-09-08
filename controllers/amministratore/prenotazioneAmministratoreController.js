const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
const util = require("util");
const { render } = require('ejs');
//const { SSL_OP_ALLOW_UNSAFE_LEGACY_RENEGOTIATION } = require('constants');
////const convertitore = require('');

var controller ={};

//Gestione Prenotazioni

controller.getElencoPrenotazioniAttive= async (req,res)=>{
    var dbPool= req.dbPool;
    try{ 
    var prenotazioni= await prenotazioneModel.getPrenotazioniAttiveA(dbPool);
    res.render('amministratore/ElencoPrenotazioniAttive.ejs',{
        prenotazioni : prenotazioni,

    });
    }catch(err){
        throw err;
    }
};

/*controller.postElencoPrenotazioniAttive= async (req,res)=>{
    var dbConnection=req.dbPool;
    
    try{
        let id_prenotazione= req.body.id_prenotazione;
        let prenotazione= await prenotazioneModel.getPrenotazione(dbConnection,id_prenotazione); // dovremmo aggiungere nel model
        
        res.render('amministratore/InfoPrenotAmm.ejs',{
            'prenotazione':prenotazione,
        });

    }catch(error){
        throw error;
    };      

};
*/

controller.getInfoPrenotAmm =async (req,res)=>{
    var dbPool= req.dbPool;
    var id_prenotazione= req.params.id;
    //console.log(id_prenotazione);
    try{
        var prenotazione = await prenotazioneModel.getPrenotazione(dbPool,id_prenotazione);
        //console.log(prenotazione);
        res.render("amministratore/InfoPrenotAmm.ejs",{
            prenotazione: prenotazione,
        });

    }catch(error){
        throw error;
    }
    
};
//elimina prenotazione
controller.getCancellaPrenotazione=async(req,res)=>{
    var dbPool=req.dbPool;
    var id= req.params.id;
    console.log("sono su get cancella controller")

    try{
        await prenotazioneModel.annullaPrenotazione(dbPool,id);

        req.session.alert = {
            'style' : 'alert-success',
            'message' : "Prenotazione annullata con successo!"
        };
        
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');

    }catch(error){
        req.session.alert={
            'style':'alert-warining',
            'message': error.message
        };
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};
//modifica prenotazione
controller.getModificaPrenotazione=async(req,res)=>{
    var dbPool=req.dbPool;
    var id = req.params.id;
   // console.log("sono su get modifica controller")
    try{ 

    var prenotazione= await prenotazioneModel.getPrenotazione(dbPool,id); 
       // console.log(prenotazione);
    res.render("amministratore/DatiPrenotAmm.ejs",{
        prenotazione :prenotazione,

    });
    
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};

controller.postModificaPrenotazione = async(req,res)=>{
    var dbPool=req.dbPool;
    try{ 

      // console.log(req.params.id); 
     //  console.log(req.body.data_riconsegna);
      // console.log(req.body.luogo_riconsegna);
        
       await prenotazioneModel.modificaPrenotazione(
            dbPool,
            req.params.id,
            req.body.data_riconsegna,
            req.body.luogo_riconsegna,
            );
            req.session.alert = {
                'style' : 'alert-success',
                'message' : "La prenotazione è modificata con successo!"
            };
            
            res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    
    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
        res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};

//Rimborso
controller.getElencoPrenotAmm=async(req,res)=>{
    var dbPool=req.dbPool;
    try{ 
    
        let prenotazioni=await prenotazioneModel.getUltimePrenotazioni(dbPool);
        res.render('amministratore/ElencoPrenotAmm_B.ejs',{
            prenotazioni : prenotazioni
        
        });
    }catch(error){
        throw error;

    }
};



controller.getRimborso= async(req,res)=>{

    var dbPool = req.dbPool;
    var idPrenotazione=req.params.id;
    try{
        var prenotazione = await prenotazioneModel.getPrenotazione(dbPool,idPrenotazione);
        var utente = await accountModel.getAccount(dbPool,prenotazione[0].ref_cliente);
        var carte = await accountModel.getMetodiPagamento(dbPool,utente[0].id_account);
       
        idp= prenotazione[0].id_prenotazione;

        res.render('amministratore/Rimborso_B.ejs',{
            idp: idp,
            carte : carte
    
        });
        

    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
};

controller.postRimborso=async(req,res)=>{
    var dbPool = req.dbPool;
    var carta = req.body.scelta_carta;
    var importo = req.body.rimborso;
    var idPrenotazione = req.params.id;


    try{
        var prenotazione;
        prenotazione= await prenotazioneModel.getPrenotazione(dbPool,idPrenotazione);
        var utente = await accountModel.getAccount(dbPool,prenotazione[0].ref_cliente);

        prezzo_finale=prenotazione[0].prezzo_finale-importo;
 
        await prenotazioneModel.setStatoPrenotazione(dbPool,idPrenotazione,'Rimborsato');
        await prenotazioneModel.setPrezzoFinale(dbPool,idPrenotazione,prezzo_finale);
        //invia email per avvisare rimborso
        //AvvisoRimborso(req.transporter,utente[0],carta,importo,idPrenotazione);
        req.session.alert = {
            
            'style' : 'alert-success',
            'message' : 'Rimborso effettuato con successo!'
    
        };

    }catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        };
    res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
    };
    res.redirect('/utente/amministratore/AreaPersonaleAmministratore');
};


async function AvvisoRimborso(transporter,  account, carta, importo, idPrenotazione){


    try {
        
        let mailSubject = 
            `
            Avviso rimborso
            <br/>
            Gentile ${account.nome} ${account.cognome},
            Volevamo comunicarle che è stato effettuato un rimborso
            di ${importo} euro sul metodo di pagamento : ${carta},
            relativo alla prenotazione con id ${idPrenotazione}.<br>
            Ci scusiamo per eventuali disagi e la aspettiamo per un'altra corsa insieme.
            <br/>
            <br/>
            Grazie per aver utilizzato Moovy.
            <br/>
            Saluti,
            <br/>
            - Il team di Moovy.
            <hr>
            <h4>Proteggiti da email di phising.</h4>
            Non ti chiederemo mai la password in un'email.
            `;

        let mailOpt = {
            'from' : 'moovyprogetto@gmail.com',
            'to' : account.email,
            'subject' : 'Rimborso effettuato -Moovy',
            'html' : mailSubject
            };
            transporter.sendMail(mailOpt, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });


    } catch (error) {
        
        throw error;
        
    }
};


module.exports = controller;