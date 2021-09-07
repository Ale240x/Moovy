const accountModel = require('../../models/accountModel');
const prenotazioneModel = require('../../models/prenotazioneModel');
const util = require("util");
//const convertitore = require('../../utilities/Convertitore');  // Per gestire le date
const { render } = require('ejs');


var controller = {}; 

//funzione che controlla se ci sono le condizioni per il rimborso
function checkRimborso(prenotazione,datacorrente){
    
    if(getOre(prenotazione.data_ritiro,datacorrente)>2){
        return true;
       
    }
    else{
        return false;
    }

};

//Funzione che calcola prezzo
function calcolaPrezzo(pre,veicolo){

    ore= getOre((pre.data_ritiro,pre.data_riconsegna));
    importo = ore * veicolo.tariffa;

return importo;
};

//controlla se abbiamo la giusta patente
function checkPatente(patente_richiesta) {
var utente = req.session.utente;
var tipo = patente_richiesta
if(tipo=="a" && utente.a==true || tipo=="a1" && utente.a1==true ||tipo=="a2" && utente.a2==true ||tipo=="am" && utente.am==true || tipo=="b" && utente.b==true){
    return true;
    
}
else return false; 
};

//Regione Ricerca Veicolo
controller.getRicercaTipoVeicoli = (req, res) => {  
    res.render('cliente/TipiVeicoli.ejs');  
};


controller.getFormA = (req, res) => {
    var url = req.url.split('=');
    var tipo_veicolo = url[1];
    res.render('cliente/FormRicercaA.ejs', { 'tipo_veicolo' : tipo_veicolo });
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
        
        res.render('cliente/RisultatiRicerca.ejs', 
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
        
        res.render('cliente/InfoVeicolo.ejs', {
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
    res.render('cliente/RiepilogoPrenotazione.ejs', { id_veicolo: id_veicolo });
};

controller.getMancia = (req,res) => {

    var dbPool = req.dbPool;
    var veicolo = req.body.veicolo; 
    var pre = req.body.pre;

    try{

    if (pre.stato_autista != null){
        res.render('cliente/Mancia.ejs',{
            'pre' : pre,    
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

controller.getPatente = (req, res) => {  
    res.redirect("/Riepilogo/FormPatente");  
};

controller.getPagamento = (req, res) => {  
    res.redirect("/Riepilogo/Pagamento");  
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



controller.postNuovoMetodoPagamento = async (req,res) =>{
    var dbPool = req.dbPool;
    var utente = req.session.utente;


    try{

    await prenotazioneModel.modificaDatiClienti(dbPool,utente.id_account,req.body.numero_carta, req.body.scadenza_carta, req.body.cvv);
        //nome e cognome dell'intestatario??  questo metodo non esiste!!
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

//Regione Ritiro Veicolo
controller.getElencoVeicoliDaRitirareC = async(req,res) =>{
    
    var dbPool = req.dbPool;

    try{
        var utente = req.session.utente;

        var veicoli= await prenotazioneModel.getVeicoliDaRitirareC(dbPool, utente[0].id_account);

        //console.log(veicoli[0].id_veicolo);
        
        res.render("cliente/VeicoliPrenotatiCliente.ejs",{
            veicoli : veicoli,
        });

    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }  
        res.redirect('/utente/cliente/AreaPersonaleCliente');   

    }    
};

controller.getInfoVeicoloDaRitirare = async(req,res)=>{
        var dbPool= req.dbPool;
        var id= req.params.id;
        try {
            var veicolo = await prenotazioneModel.getVeicolo(dbPool,id);
            res.render("cliente/InfoRitiro.ejs",{
                veicolo: veicolo,           
            });

        }catch (error){
            throw error;
        }
};

controller.postRitiroVeicolo = async (req, res) => { 
    var dbPool = req.dbPool;

    try{
        var codice = req.body.codiceVeicolo;
        var id_veicolo= req.params.id;
        
       // console.log(codice);
       // console.log(id_veicolo);
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,id_veicolo);
        var stato = "Veicolo Ritirato";

       // console.log(prenotazione);

        if (id_veicolo == codice){

            await prenotazioneModel.setStatoPrenotazione(dbPool, prenotazione[0].id_prenotazione ,stato);
        } 

        req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Veicolo ritirato con successo!'
        };

        res.redirect('/utente/cliente/AreaPersonaleCliente');
       
    }
    catch(error){
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente');
    }
   
};

//Regione Riconsegna Veicolo
controller.getElencoVeicoliDaRiconsegnareC = async(req,res) =>{


    var utente = req.session.utente;
    var dbPool = req.dbPool;
    try{
        

        let veicoli= await prenotazioneModel.getVeicoliDaRiconsegnareC(dbPool,utente[0].id_account);
 
        res.render('cliente/VeicoliRitiratiC_B.ejs',{
            veicoli : veicoli,
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente');  
        

    }    
};


controller.getModificaLuogo = async (req, res) =>{

    var id_veicolo= req.params.id;
    var dbPool = req.dbPool;

    try {
        var prenotazione = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,id_veicolo);
        res.render('cliente/ModificaLuogo_B.ejs', {
            prenotazione : prenotazione[0],
            id_veicolo : id_veicolo
        });
        

    }catch (error){
        throw error;
    }

  
    
};

controller.postModificaLuogo = async(req,res) =>{

    var dbPool = req.dbPool;
    var nuovoluogo = req.body.luogo_riconsegna;   
    var idVeicolo = req.params.id;

    try{
        
        var prenotazioneV = await prenotazioneModel.getPrenotazioneDelVeicolo(dbPool,idVeicolo);
     
        if(nuovoluogo != prenotazioneV[0].luogo_riconsegna){
        await prenotazioneModel.modificaLuogoRiconsegna(dbPool,prenotazioneV[0].id_prenotazione, nuovoluogo);
    
       }
      var x = new Date();
      var y= new Date(prenotazioneV[0].data_riconsegna);

       //controllo sovrapprezzi
       if(((x.getTime() - y.getTime())/3600000)>0){
        var oreSovrapprezzo = (x.getTime() - y.getTime())/3600000;
        var prezzoOrario = await prenotazioneModel.getPrezzoVeicolo(dbPool, idVeicolo);
        var sovrapprezzo = oreSovrapprezzo*prezzoOrario[0].tariffa;
        var prezzo_totale = sovrapprezzo + prenotazioneV[0].prezzo_finale;


        sovrapprezzo = sovrapprezzo.toFixed();
        await prenotazioneModel.riconsegnaVeicolo(dbPool,prenotazioneV[0].id_prenotazione ,'Veicolo Riconsegnato',idVeicolo,prenotazioneV[0].luogo_riconsegna,prezzo_totale);
        res.render("cliente/Sovrapprezzo_B.ejs",{

            sovrapprezzo : sovrapprezzo,
            idVeicolo : idVeicolo
        });
          
   }
   else{
       var prezzo_totale = prenotazioneV[0].prezzo_finale;
       await prenotazioneModel.riconsegnaVeicolo(dbPool,prenotazioneV[0].id_prenotazione ,'Veicolo Riconsegnato',idVeicolo,prenotazioneV[0].luogo_riconsegna,prezzo_totale);
    req.session.alert = {
        'style' : 'alert-success',
        'message' : 'Riconsegna effettuata in orario, nessun sovrapprezzo!'
    };
    res.redirect('/utente/cliente/AreaPersonaleCliente');
   }
     
        
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente');  
        

    }  

};


//Regione Modifica Prenotazione
controller.getElencoPrenotazioni= async(req,res) => {
    var dbPool = req.dbPool;
    var utente = req.session.utente[0];
    try{

        let prenotazioni = await prenotazioneModel.getPrenotazioniAttiveC(dbPool, utente.id_account);
       
        res.render('cliente/ElencoPrenotazioni.ejs',{
            prenotazioni : prenotazioni
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente'); 
        

    }    

};

controller.getElencoPrenotazioniE= async(req,res) => {
    var dbPool = req.dbPool;
    var utente = req.session.utente[0];
    try{
      
        let prenotazioni = await prenotazioneModel.getPrenotazioniAttiveC(dbPool, utente.id_account);
        res.render('cliente/ElencoPrenotazioniE.ejs',{
            prenotazioni : prenotazioni
        });
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente');  

    }    

};

controller.getModificaPrenotazione = async (req,res) => {
    try {

        var dbPool= req.dbPool;
        var id_prenotazione = req.params.id;

        let prenotazioneZ = await prenotazioneModel.getPrenotazione(dbPool, id_prenotazione);
        let veicoloC = await prenotazioneModel.getVeicolo(dbPool, prenotazioneZ[0].ref_veicolo);
      
        
        res.render("cliente/DatiPrenotazione.ejs",{
            'prenotazione' : prenotazioneZ[0],
            'veicolo': veicoloC[0]
        });   
    } catch (error) {
        
        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }
        
    }
  
};

controller.postModificaPrenotazione = async (req,res) => {
    var dbPool = req.dbPool;
    var nuovadata= req.body.data_riconsegna;
    var nuovoluogo = req.body.luogo_riconsegna;   
    var idPrenotazione = req.params.id;

    try{
        nuovadata= new Date(nuovadata);
        let prenotazione = await prenotazioneModel.getPrenotazione(dbPool,idPrenotazione);
        let today= new Date();
      
        x = new Date(nuovadata);
        if(x.getTime()<today.getTime()){
            req.session.alert = {
                'style' : 'alert-success',
                'message' : 'Non puoi inserire una data precedente ad oggi!'
            };

        }
        else{
            await prenotazioneModel.modificaPrenotazione(dbPool, idPrenotazione, nuovadata,nuovoluogo);
   
            x = new Date(nuovadata);
            y= new Date(prenotazione[0].data_riconsegna);
           
    
            var oreSovrapprezzo = (x.getTime() - y.getTime())/3600000;
            var prezzoOrario = await prenotazioneModel.getPrezzoVeicolo(dbPool, prenotazione[0].ref_veicolo);
    
            
            var sovrapprezzo = oreSovrapprezzo*prezzoOrario[0].tariffa;
            var prezzo_totale = sovrapprezzo + prenotazione[0].prezzo_finale
         
            await prenotazioneModel.setPrezzoFinale(dbPool,idPrenotazione,prezzo_totale);
    
          
           req.session.alert = {
            'style' : 'alert-success',
            'message' : 'Dati prenotazione modificati con successo e sovrapprezzi pagati'
        };
            
        }
 
  

    res.redirect('/utente/cliente/AreaPersonaleCliente');

      
    }catch(error){
        req.session.alert={
            'style' : 'alert-warning',
            'message' : error.message
        }
        res.redirect('/utente/cliente/AreaPersonaleCliente');
        

        }    

};


//Calcola se il rimborso è ottenibile e mostra messaggio direttamente nella schermata dell'elenco
controller.getEliminaPrenotazione = async (req,res) => {

    var dbPool = req.dbPool;
    var idPrenotazione = req.params.id;
   

    try{

    datacorrente= new Date();
       let prenotazione = await prenotazioneModel.getPrenotazione(dbPool,idPrenotazione);
        var data_riconsegna = prenotazione[0].data_riconsegna;
        var flag;

        x = new Date(datacorrente);
        y= new Date(data_riconsegna);

        //controllo rimborso
        if(((y.getTime() - x.getTime())/3600000)>2){
            flag=true;
    }
    else{
        flag=false;
    }
    await prenotazioneModel.annullaPrenotazione(dbPool,idPrenotazione);
    if(flag==true){
        await prenotazioneModel.setStatoPrenotazione(dbPool,idPrenotazione,'Rimborsato');
    }
  
        res.render('cliente/AvvisoRimborso.ejs',{
            'flag' : flag
        });
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

module.exports = controller;
