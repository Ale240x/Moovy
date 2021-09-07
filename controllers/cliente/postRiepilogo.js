const controller = require("./PrenotazioniClienteController");

function checkPatente(utente, patente_richiesta){
    if(patente_richiesta == 'tipo_b' && utente.tipo_b == 1 
    || patente_richiesta == 'tipo_a' && utente.tipo_a == 1
    || patente_richiesta == 'tipo_am' && utente.tipo_am == 1
    || patente_richiesta == 'tipo_a1' && utente.tipo_a1 == 1
    || patente_richiesta == 'tipo_a2' && utente.tipo_a2 == 1){
        return true;
    }
    else {
        return false;
    }
}

controller.postRiepilogo = async (req, res) =>{
    var dbPool = req.dbPool;
    info = req.body;
    utente = req.session.utente;
    req.session.prenotazione.prezzo_stimato = info.prezzo_stimato.slice(' ')[0];
    if(info.mancia && Number(info.mancia) > 0){
        req.session.prenotazione.mancia = info.mancia;
    }
    var pre = req.session.prenotazione;

    if(info.luogo_partenza){ //se è stato richiesto un autista
        res.redirect('/Riepilogo/Mancia');
    }
    else if((pre.tipo_veicolo == 'Automobile' || pre.tipo_veicolo == 'Moto') && !info.mancia){
        
        if(!checkPatente(utente, pre.patente_richiesta)){
            res.redirect('/Riepilogo/FormPatente');
        }
        else{
            try {
                prenotazioneId = await prenotazioneModel.aggiungiPrenotazione( dbPool, utente.id_account, pre.ref_autista, pre.tipo_veicolo, pre.ref_veicolo, pre.mancia, pre.data_ritiro, pre.data_riconsegna, pre.luogo_ritiro, pre.luogo_riconsegna, pre.prezzo_stimato);
                        req.session.prenotazione.id = prenotazioneId;
                        res.render('cliente/Pagamento.ejs',{
                            'prenotazioneId' : prenotazioneId ,
                            'prezzo_stimato' : pre.prezzo_stimato,
                            'utente' : utente
                        });
            } catch(error) {
                req.session.alert = {
                    
                    'style' : 'alert-warning',
                    'message' : error.message
            
                }   
            }
        }
    
    }
    else{
        try {
            prenotazioneId = await prenotazioneModel.aggiungiPrenotazione( dbPool, utente.id_account, pre.ref_autista, pre.tipo_veicolo, pre.ref_veicolo, pre.mancia, pre.data_ritiro, pre.data_riconsegna, pre.luogo_ritiro, pre.luogo_riconsegna, pre.prezzo_stimato);
                    req.session.prenotazione.id = prenotazioneId;
                    res.render('cliente/Pagamento.ejs',{
                        'prenotazioneId' : prenotazioneId ,
                        'prezzo_stimato' : pre.prezzo_stimato,
                        'utente' : utente
                    });
        } catch(error) {
            req.session.alert = {
                
                'style' : 'alert-warning',
                'message' : error.message
        
            }   
        }
    }
    
    
};