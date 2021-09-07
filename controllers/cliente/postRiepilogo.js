const controller = require("./PrenotazioniClienteController");

controller.postRiepilogo = async (req, res) =>{
    var dbPool = req.dbPool;
    info = req.body;
    utente = req.session.utente;

    if(info.luogo_ritiro){ //se è stato richiesto un autista
        res.render('cliente/Mancia.ejs');
    }
    else if(info.tipo_veicolo == 'Automobile' || info.tipo_veicolo == 'Moto'){
        try{
            if(checkPatente(utente, info.patente_richiesta)){
                prenotazioneId = await prenotazioneModel.aggiungiPrenotazione( dbPool, utente.id_cliente, pre.ref_autista, pre.tipo_veicolo, pre.ref_veicolo, mancia, pre.data_ritiro, pre.data_riconsegna, pre.luogo_ritiro, pre.luogo_riconsegna, info.prezzo_stimato);
                res.render('cliente/Pagamento.ejs',{
                    'prenotazioneId' : prenotazioneId ,
                    'prezzo_stimato' : info.prezzo_stimato,
                    'utente' : utente
                });
            }
        }
        catch{

        }
    }
}