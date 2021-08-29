const util = require("util");

var model = {};

model.aggiungiPrenotazione = async (dbPool, ref_cliente, ref_autista, tipo_veicolo, ref_veicolo, mancia, data_ritiro, data_riconsegna, luogo_ritiro, luogo_riconsegna, prezzo_stimato) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        var stato_prenotazione = 'Non Pagato';

        if(ref_autista == 1){ //il cliente ha richiesto un autista, altrimenti sarebbe null (poi verrà inserito come null perchè dovrà essere aggiornato quando un autista accetta la corsa)
            var stato_autista = 'Da confermare';
        }
        if(mancia > 0){
            var prezzo_finale = prezzo_stimato + mancia;
        }
        else{
            var prezzo_finale = prezzo_stimato;
        }

        PrenotazioneId = (await query(`
                INSERT INTO prenotazioni
                    (ref_cliente, ref_autista, tipo_veicolo, ref_veicolo, mancia, stato_prenotazione, stato_autista, data_ritiro, data_riconsegna, luogo_ritiro, luogo_riconsegna, prezzo_stimato, prezzo_finale) 
                VALUES
                    (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                `,
                [ref_cliente, null, tipo_veicolo, ref_veicolo, mancia, stato_prenotazione, stato_autista, data_ritiro, data_riconsegna, luogo_ritiro, luogo_riconsegna, prezzo_stimato, prezzo_finale]
            )).insertId;
        console.log('Prenotazione creata con successo con stato "Non Pagato"');
        return PrenotazioneId;
    }
    catch(error){
        throw error;
    }
};

model.confermaPrenotazione = async (dbPool, id_prenotazione, ref_carta) => { //prenotazione pagata

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET ref_carta = ?, stato_prenotazione = ? 
                WHERE id_prenotazione = ?
                `, [ref_carta, 'Pagato', id_prenotazione]);
            console.log('Stato prenotazione aggiornato in "Pagato"');
    }
    catch(error){
        throw error;
    }
};

model.getCorse = async (dbPool, ref_autista) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT *
                FROM prenotazioni
                WHERE (ref_autista = ? AND stato_prenotazione = ?) OR stato_autista = ?
                `, [ref_autista, 'Pagato', 'Da confermare']
                );
        
        if(results.length == 0){
            throw {'message' : 'Non hai accettato nessuna corsa'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.accettaCorsa = async (dbPool, id_prenotazione,  ref_autista) => { //autista accetta la prenotazione

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET ref_autista = ?, stato_prenotazione = ? 
                WHERE id_prenotazione = ?`,
                [ref_autista, 'Confermato', id_prenotazione]
            );
        console.log('Stato autista aggiornato in "Confermato"');
    }
    catch(error){
        throw error;
    }
};

model.setStatoPrenotazione = async (dbPool, id_prenotazione, stato_prenotazione) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET stato_prenotazione = ?
                WHERE id_prenotazione = ?`,
                [stato_prenotazione, id_prenotazione]
            );
            console.log('Stato prenotazione aggiornato in' + stato_prenotazione);
    }
    catch(error){
        throw error;
    }
};

model.annullaPrenotazione = async (dbPool, id_prenotazione) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET stato_prenotazione = ?
                WHERE id_prenotazione = ? `,
                ['Annullato', id_prenotazione]
            );
            console.log('Stato prenotazione aggiornato in "Annullato"');
    }
    catch(error){
        throw error;
    }
};

model.getStoricoPrenotazioni = async (dbPool, ref_cliente) => {
    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT *
                FROM prenotazioni
                WHERE ref_cliente = ?
                `, [ref_cliente]
                );
        
        if(results.length == 0){
            throw {'message' : 'Non hai ancora effettuato nessuna prenotazione'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.modificaPrenotazione = async (dbPool, id_prenotazione, data_riconsegna, luogo_riconsegna) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET data_riconsegna = ?, luogo_riconsegna = ?
                WHERE id_prenotazione = ? `,
                [data_riconsegna, luogo_riconsegna, id_prenotazione]
            );
            console.log('Dati prenotazione aggiornati con successo');
    }
    catch(error){
        throw error;
    }
};

model.getPrenotazioniAttiveC = async (dbPool, ref_cliente) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT *
                FROM prenotazioni
                WHERE ref_cliente = ? AND (stato_prenotazione = ? OR stato_prenotazione = ?)
                `, [ref_cliente, 'Pagato', 'Veicolo ritirato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono prenotazioni attive'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getPrenotazioniAttiveA = async (dbPool) => { //prenotazioni attive amministratore

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT p.*, a.nome, a.cognome
                FROM prenotazioni AS p, account AS a
                WHERE p.ref_cliente = a.id_account 
                AND (stato_prenotazione = ? OR stato_prenotazione = ?)`, 
                ['Pagato', 'Veicolo ritirato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono prenotazioni attive'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.cercaVeicolo = async (dbPool, sel) => {

    try{ 
        let query = util.promisify(dbPool.query).bind(dbPool); 
        //AND (v.ref_parcheggio = ? OR v.posizione = ?) si riferisce al parcheggio o posizione fuori stallo in cui si trova il veicolo
        //2° SELECT prende i veicoli non prenotati nell'intervallo richiesto
        var sql = 'SELECT v.id_veicolo, v.nome_veicolo, v.descrizione, v.patente_richiesta, v.tariffa '+
        'FROM parcheggi AS pa, veicoli AS v '+
        'WHERE pa.id_parcheggio = v.ref_parcheggio '+
        'AND (v.ref_parcheggio = ? OR v.posizione = ?) '+
        'AND v.tipo_veicolo = ? '+
        'AND v.id_veicolo NOT IN (SELECT pr.ref_veicolo '+
                                'FROM veicoli AS v, prenotazioni AS pr '+
                                'WHERE v.id_veicolo = pr.ref_veicolo '+
                                'AND ((? BETWEEN pr.data_ritiro AND pr.data_riconsegna) '+
                                'OR (? BETWEEN pr.data_ritiro AND pr.data_riconsegna)))'

        if(sel.tipo_veicolo == 'Automobile' || sel.tipo_veicolo == 'Moto'){  
            if(sel.modello_auto){
                sql = sql +' AND v.modello_auto = ' + sel.modello_auto;
            }
            else if(sel.modello_moto){
                sql = sql +' AND v.modello_auto = ' + sel.modello_moto;
            }
            
            veicoli = (await query(sql, 
            [sel.luogo_ritiro, sel.luogo_ritiro, sel.tipo_veicolo, sel.data_ritiro, sel.data_riconsegna]));

            console.log(veicoli.sql);
            return veicoli;

            
        }
        else{ //bici e monopattini

            var sql = 'SELECT v.id_veicolo, v.nome_veicolo, v.descrizione, v.tariffa '+
            'FROM parcheggi AS pa, veicoli AS v '+
            'WHERE pa.id_parcheggio = v.ref_parcheggio '+
            'AND v.ref_parcheggio = ? '+
            'AND v.tipo_veicolo = ? '+
            'AND v.id_veicolo NOT IN (SELECT pr.ref_veicolo '+
                                    'FROM veicoli AS v, prenotazioni AS pr '+
                                    'WHERE v.id_veicolo = pr.ref_veicolo '+
                                    'AND ((? BETWEEN pr.data_ritiro AND pr.data_riconsegna) '+
                                    'OR (? BETWEEN pr.data_ritiro AND pr.data_riconsegna)))'

            veicoli = (await query( sql, 
            [sel.luogo_ritiro, sel.tipo_veicolo, sel.data_ritiro, sel.data_riconsegna])
            );
            console.log(query.sql);
            return veicoli;
        }   
    }
    catch(error) {
        console.log(error);
        throw error;
    }
};

model.getUltimePrenotazioni = async (dbPool) =>{

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        let mese = new Date().getMonth();
        /*let anno = new Date().getFullYear();
        let dataLimite = new Date(anno + "-" + mese + "-01");*/

        results =  await query(`
        SELECT p.*, a.nome, a.cognome
        FROM prenotazioni AS p, account AS a
        WHERE p.ref_cliente = a.id_account 
        AND MONTH(p.data_ritiro) >= ?`,
        [mese]
        );
        
        if(results.length == 0){
            throw {'message' : 'Non esistono prenotazioni per l\'ultimo mese'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRitirareC = async (dbPool, ref_cliente) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT p.*, v.id_veicolo, v.nome_veicolo, v.posizione
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                p.ref_cliente = ? AND p.stato_prenotazione = ? AND p.data_ritiro <= SYSDATETIME()
                `, [ref_cliente, 'Pagato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da ritirare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRitirareAut = async (dbPool, ref_autista) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT p.*, id_veicolo, v.nome_veicolo, v.posizione
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                p.ref_autista = ? AND p.stato_prenotazione = ? AND p.data_ritiro <= SYSDATETIME()
                `, [ref_autista, 'Pagato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da ritirare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRitirareAdd = async (dbPool, luogo_ritiro) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        results =  await query(`
                SELECT p.*, id_veicolo, v.nome_veicolo, v.posizione
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                p.luogo_ritiro = ? AND p.stato_prenotazione = ? AND p.data_ritiro <= SYSDATETIME() 
                `, [luogo_ritiro, 'Pagato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da ritirare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRiconsegnareC = async (dbPool, ref_cliente) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT p.*, v.id_veicolo, v.nome_veicolo
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                p.ref_cliente = ? AND p.stato_prenotazione = ?
                `, [ref_cliente, 'Veicolo ritirato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da Riconsegnare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRiconsegnareAut = async (dbPool, ref_autista) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT p.*, id_veicolo, v.nome_veicolo
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                p.ref_autista = ? AND p.stato_prenotazione = ?
                `, [ref_autista, 'Veicolo ritirato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da Riconsegnare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.getVeicoliDaRiconsegnareAdd = async (dbPool) => { //prenotazioni attive cliente

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        results =  await query(`
                SELECT p.*, v.id_veicolo, v.nome_veicolo
                FROM prenotazioni AS p, veicoli AS v
                WHERE p.ref_veicolo = v.id_veicolo AND
                stato_prenotazione = ? 
                `, ['Veicolo ritirato']
                );

        if(results.length == 0){
            throw {'message' : 'Non esistono veicoli da Riconsegnare'};
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

model.modificaLuogoRiconsegna = async (dbPool, id_prenotazione, luogo_riconsegna) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET luogo_riconsegna = ?
                WHERE id_prenotazione = ? `,
                [luogo_riconsegna, id_prenotazione]
            );
            console.log('Luogo di riconsegna aggiornato con successo');
    }
    catch(error){
        throw error;
    }
};

model.setMotivoRitardo = async (dbPool, id_prenotazione, luogo_riconsegna, motivo_ritardo) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        await query(`
                UPDATE prenotazioni
                SET luogo_riconsegna = ?, motivo_ritardo = ?
                WHERE id_prenotazione = ? `,
                [luogo_riconsegna, motivo_ritardo, id_prenotazione]
            );
            console.log('Motivo del ritardo comunicato con successo');
    }
    catch(error){
        throw error;
    }
};

model.riconsegnaVeicolo = async (dbPool, id_prenotazione, stato_prenotazione, id_veicolo, luogo_riconsegna, prezzo_finale) => {
   
    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        await query(`
        UPDATE prenotazioni
        SET prezzo_finale = ?, stato_prenotazione = ?
        WHERE id_prenotazine = ? `,
        [prezzo_finale, stato_prenotazione, id_prenotazione]
        );

        results =  await query(`
                SELECT id_parcheggio
                FROM parcheggi
                WHERE indirizzo = ? 
                `, [luogo_riconsegna]);

        if(results.length == 0){ //veicolo riconsegnato fuori dal parcheggio
            await query(`
                UPDATE veicoli
                SET posizione = ?
                WHERE id_veicolo = ? `,
                [luogo_riconsegna, id_veicolo]
            );
            console.log('Posizione veicolo aggiornata con successo');
        }
        else{
            await query(`
                UPDATE veicoli
                SET ref_parcheggio = ?
                WHERE id_veicolo = ? `,
                [results.id_parcheggio, id_veicolo]
            );
            console.log('Parcheggio del veicolo aggiornato con successo');
        }
    }
    catch(error){
        throw error;
    }
};

model.getPrezzoVeicolo = async (dbPool, id_veicolo) =>{

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        results =  await query(`
                    SELECT tariffa
                    FROM veicoli
                    WHERE id_veicolo = ? 
                    `, [id_veicolo]);
        
        return results;
    }
    catch(error){
        throw error;
    }
    
};

model.getAutistiLiberi = async (dbPool, data_ritiro, data_riconsegna) =>{

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        results =  await query(`
                SELECT id_account
                FROM account
                WHERE ruolo = ? 
                AND id_account NOT IN (SELECT ref_autista
                                       FROM prenotazioni
                                       WHERE ref_autista != ?
                                       AND ((? BETWEEN pr.data_ritiro AND pr.data_riconsegna)
                                       OR (? BETWEEN pr.data_ritiro AND pr.data_riconsegna)))
                `, ['Autista', null, data_ritiro, data_riconsegna]
                ); //null in sql è maiuscolo o minuscolo?

        if(results.length == 0){
            console.log('Nessun autista disponibile');
        }
        return results;
    }
    catch(error){
        throw error;
    }
};

module.exports = model;

