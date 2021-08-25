const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
const util = require("util");
const convertitore = require('../../utilities/Convertitore');  // Per gestire le date



var controller = {}; 

//funzione che controlla se ci sono le condizioni per il rimborso
async function checkRimborso(prenotazione,datacorrente){
    
    if(getOre(prenotazione.data_ritiro,datacorrente)>2){
        return true;
       
    }
    else{
        return false;
    }

};

//Funzione che calcola prezzo
async function calcolaPrezzo(pre,veicolo){

    ore= getOre((pre.data_ritiro,pre.data_riconsegna));
    importo = ore * veicolo.tariffa;

return importo;
};

//controlla se abbiamo la giusta patente
async function checkPatente(veicolo) {
var utente = req.session.utente;
var veicolo = req.body;
var tipo = veicolo.patente_richiesta
if(utente.tipo==true){
    return true;
    
}
else return false; 
};


controller.getMancia = (req,res) => {
    res.render("cliente/RiepilogoPrenot.ejs");   
};

controller.postRiepilogoPrenotazione = (req,res) => {

    var dbPool = req.dbPool;
    var veicolo = req.body.veicolo; 
    var pre = req.body.pre;

    try{

    res.render('cliente/RiepilogoPrenot.ejs', {
     'pre' : pre,  
     'veicolo' : veicolo,  
    });

    if (pre_prenotazione.stato_autista != null){
        res.render('cliente/mancia.ejs',{
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


controller.postPrenotaVeicolo = async (req,res) => {

    var dbPool = req.dbPool;
    var mancia = req.body.mancia;
    var pre = req.body.pre;
    var veicolo = req.body.veicolo;
    var prezzo_stimato= calcolaPrezzo(pre,veicolo);
    var utente = req.session.utente;

    try{
       if( checkPatente(veicolo)){
       prenotazioneId = await prenotazioneModel.aggiungiPrenotazione( dbPool, utente.id_cliente, pre.ref_autista, pre.tipo_veicolo, pre.ref_veicolo, mancia, pre.data_ritiro, pre.data_riconsegna, pre.luogo_ritiro, pre.luogo_riconsegna, prezzo_stimato);
       res.render('cliente/Pagamento.ejs',{
           'prenotazioneId' : prenotazioneId ,
           'prezzo_stimato' : prezzo_stimato,
           'utente' : utente
       });

       }else{
        res.render('cliente/FormPatente.ejs',{
           
        });

       }
 
} catch (error) {
        
    req.session.alert = {
        
        'style' : 'alert-warning',
        'message' : error.message

    }
   
}
};

controller.postAggiungiPatente = async (req,res) =>{
    var dbPool = req.dbPool;
    var utente = req.session.utente;


    try{

    await prenotazioneModel.modificaDatiClienti(dbPool,utente.id_account,req.body.codice_patente,req.body.scadenza_patente, req.body.tipo_a, req.tipo_b, req.tipo_am, req.tipo_a1, req.tipo_a2);

    }catch(error){
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }   
};

controller.getNuovoMetodoPagamento = (req,res) => {
    res.render("cliente/NuovoMetodo.ejs");   
};



controller.postNuvoMetodoPagamento = async (req,res) =>{
    var dbPool = req.dbPool;
    var utente = req.session.utente;


    try{

    await prenotazioneModel.modificaDatiClienti(dbPool,utente.id_account,req.body.numero_carta, req.body.scadenza_carta, req.body.cvv);

    }catch(error){
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
    }
       
};

controller.getStatoPagamento = (req,res) => {
    res.render("cliente/StatoPagamento.ejs");   
};

controller.postStatoPagamento = async (req,res) => {

    var dbPool = req.dbPool;
    var prenotazione =req.body;

    try{
        await prenotazioneModel.confermaPrenotazione(dbPool,prenotazione.id_prenotazione,prenotazione.ref_carta);

  
} catch (error) {
        
    req.session.alert = {
        
        'style' : 'alert-warning',
        'message' : error.message

    }
   
}
};

controller.getElencoVeicoliDaRitirareC = async(req,res) =>{

    var dbPool = req.dbPool;
    var utente = req.session.utente;
    
    try{

        let veicoli= await prenotazioneModel.getVeicoliDaRitirareC(dbPool, utente.id_account);

        res.render('cliente/VeicoliPrenotatiC.ejs',{
            'veicoli' : veicoli,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        
    }    
};

controller.getInfoVeicoloDaRitirare= async(req,res)=>{

        var dbPool = req.dbPool;
        var veicolo = req.body;
        var id_veicolo = veicolo.id_veicolo; // per dopo

    try{       
        res.render("cliente/InfoRitiro",{
            'veicolo': veicolo,
        });

    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }

    }
}

controller.postCodiceRitiro = async(req,res)=>{

    var dbPool = req.dbPool;
    var codice = req.body.codice;
    var idPrenotazione = req.body.id_prenotazione;
    

    if (idVeicolo == codice){
        await prenotazioneModel.setStatoPrenotazione(dbPool,pidPrenotazione, "Ritirato");
    } 

    res.redirect("utente/cliente/AreaPersonaleC");
};


controller.getElencoVeicoliDaRiconsegnareC = async(req,res) =>{

    var dbPool = req.dbPool;
    var utente = req.session.utente;
    

    try{

        let veicoli= await prenotazioneModel.getVeicoliDaRiconsegnareC(dbPool, utente.id_account);

        res.render('cliente/VeicoliRitiratiC',{
            'veicoli' : veicoli,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        

        }    
}
/*
controller.getElencoVeicoliDaRiconsegnareC = async(req,res) =>{

    var dbPool = req.dbPool;
    var utente = req.session.utente;
    

    try{

        let veicoli= await prenotazioneModel.getVeicoliDaRiconsegnareC(dbPool, utente.id_account);

        res.render('cliente/VeicoliRitiratiC',{
            'veicoli' : veicoli,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        

        }    
}

*/

controller.getFormModificaRiconsegna= async(req,res)=>{

    var dbPool = req.dbPool;
    var veicolo = req.body.veicolo;
try{       
    res.render("cliente/ModificaLuogo.ejs",{
        'veicolo': veicolo,
    });


}catch(error){
    req.session.alert={
        'style' : 'alert-warning',
        'message' : error.message
    }

}
}

controller.postFormModificaRiconsegna = async(req,res) =>{
    var dbPool = req.dbPool;
    var nuovoluogo = req.body.luogo_riconsegna;
    var prenotazione= req.body.prenotazione;
    var utente = req.session.utente;

    try{
        if(nuovoluogo != prenotazione.luogo_riconsegna){

        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,prenotazione.id_prenotazione, nuovoluogo);
        let datacorrente= new Date();
        let oreSovrapprezzo = convertitore.getOre(datacorrente,prenotazione.data_riconsegna);
        var sovrapprezzo = oreSovrapprezzo*getPrezzoVeicolo(prenotazione.ref_veicolo());
        var prezzo_totale = sovrapprezzo + prenotazione.prezzo_finale;

        res.render("cliente/Sovrapprezzo.ejs",{
            'prezzo_totale' :  prezzo_totale,
            'prenotazione' : prenotazione,
            'nuovo_luogo' : nuovo_luogo,
        });
        }
        
    }catch(error){
        req.sessione.alert={
            'style' : 'aler-warning',
            'message' : error.message
        }
       
    }

};

controller.postRiconsegnaEffettuata = async(req,res) =>{
    var dbPool = req.dbPool;
    var prenotazione= req.body.prenotazione;
    var prezzo_totale = req.body.prezzo_totale;
    var nuovoluogo = req.body.luogo_riconsegna;
  

    try{

        await prenotazioneModel.riconsegnaVeicolo,(dbPool,prenotazione.id_prenotazione, "Veicolo Riconsegnato", prenotazione.ref_veicolo,nuovoluogo,prezzo_totale); //Da rivederee
           
    }catch(error){
        req.sessione.alert={
            'style' : 'aler-warning',
            'message' : error.message
        }
       
    }

};


controller.getElencoPrenotazioni= async(req,res) => {
    var dbPool = req.dbPool;
    var utente = req.session.utente;
    try{

        let prenotazioni = await prenotazioneModel.getPrenotazioniAttiveC(dbPool, utente.id_account);

        res.render('cliente/ElencoPrenotazioni.ejs',{
            'prenotazioni' : prenotazioni,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        

    }    

};

controller.getModificaPrenotazione = (req,res) => {
    res.render("cliente/DatiPrenotazione.ejs");   
};

controller.postModificaPrenotazione = async (req,res) => {
    var dbPool = req.dbPool;
    var idPrenotazione = req.params.id_prenotazione;
    var nuovadata= req.params.data_riconsegna;
    var nuovoluogo = req.params.luogo_riconsegna;   

    try{

        await prenotazioneModel.getModificaPrenotazione(dbPool, idPrenotazione, nuovadata,nuovoluogo);
        pagaSovrapprezzi(utente.id_account,idPrenotazione);

        res.render('cliente/DatiPrenotazione_B',{
            'veicoli' : veicoli,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        

        }    

};


//Calcola se il rimborso è ottenibile e mostra messaggio direttamente nella schermata dell'elenco
controller.getEliminaPrenotazione = (req,res) => {

    var dbPool = req.dbPool;
    var idPrenotazione = req.prenotazione.id_prenotazione;
   

    try{

        datacorrente= new Date();
        if (checkRimborso(idPrenotazione,datacorrente)){
        await.prenotazioneModel.annullaPrenotazione(dbPool,prenotazione.id_prenotazione);
        res.render('clienteB/AvvisoRimborso.ejs',{});
        }
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        

    }    

};


  //controllare 

async function recuperoPasswordEmail(transporter,  account){

    codice = Math.round(Math.random()*10000) ;

    try {
        
        let mailSubject = 
            `
            Recupero password.
            <br/>
            Gentile ${accounte.nome} ${account.cognome},
           Ecco il codice per effettuare il recupero password
            - Codice identificativo: ${codice};<br/>
            Inseriscilo nel form che compare nella schermata per scegliere una nuova password!
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
            'from' : '',
            'to' : account.email,
            'subject' : 'Recupero password -Moovy',
            'html' : mailSubject
            };

        transporter.sendMail(mailOpt);

    } catch (error) {
        
        throw error;
        
    }
};
