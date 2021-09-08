const { copyFileSync } = require("fs");
const util = require("util");
const checkDati = require('../utilities/checkDati');
const crittografo = require('../utilities/crittografo');

var model = {};

//entity utente

////AGGIUSTARE LA QUERY
model.getAccount = async (dbPool, utenteId) => {
    
    try {
        //console.log("sono sul getAccount " + utenteId)
        let query = util.promisify(dbPool.query).bind(dbPool);

        ruolo = (await query(`SELECT ruolo
                            FROM account 
                            WHERE id_account = ?`,
                            [utenteId]));
        
        if(ruolo[0].ruolo == 'Cliente'){
            
            return (await query(`SELECT a.*, c.*, p.*
                                FROM account AS a, carte_di_credito AS c, patenti AS p
                                WHERE a.id_account = c.ref_account AND c.ref_account = p.ref_account
                                AND a.id_account = ?`,
                                [utenteId]));
        }
        else if(ruolo == 'Autista' || ruolo == 'Addetto'){
            return (await query(`SELECT a.*, p.*
                                FROM account AS a, patenti AS p
                                WHERE a.id_account = p.ref_account
                                AND a.id_account = ?`,
                                [utenteId]));
        }
        else{
            return (await query(`SELECT *
                                FROM account 
                                WHERE id_account = ?`,
                                [utenteId]));
        }

    } catch(error) {

        throw error;
    }
};

model.getImpiegato =async (dbPool, utenteId) =>{
     
    try{

        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query(`SELECT  
                                *
                            FROM 
                                account AS a,
                                patenti AS p
                            WHERE a.id_account = p.ref_account AND a.id_account = ?`,
                            [utenteId]));

    }catch(err){

        req.session.alert = {
            
            'style' : 'alert-warning',
            'message' : error.message
    
        }    
    
    }

}

model.getAccountsImpiegati = async (dbPool) => {
    
    try {
        //console.log("gli account degli impiegati");
        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query(`SELECT  
                                *
                            FROM 
                                account AS a
                            WHERE ruolo = ?  OR  ruolo =?`,
                            ['Addetto', 'Autista']));

    } catch(error) {

        throw error;
    }
};

model.getAccountsFiltrati = async (dbPool,nome, cognome, ruolo) => {
    
    try {
        //console.log("gli account degli impiegati");
        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query(`SELECT  
                                *
                            FROM 
                                account AS a
                            WHERE a.nome = ? OR a.cognome = ? OR a.ruolo = ? OR a.ruolo= ?  OR a.ruolo= ? OR a.ruolo= ?`,
                            [nome,cognome,ruolo, 'Autista','Addetto', 'Cliente']));

    } catch(error) {

        throw error;
    }
};

//login
model.login = async (dbPool, email, clearPassword) => {

    try {

        if(!(
            checkDati.isEmail(email)
            )){
            throw {message:  'Email non valida'}
        }

        let query = util.promisify(dbPool.query).bind(dbPool);

        let utenteId = (await query(
            'SELECT id_account FROM account WHERE email = ?', 
            [email]));
        
        //let realPassword = (await query(
        //    'SELECT password FROM account WHERE id_account = ?', 
        //    [utenteId]));
        
        //let cryptPass = crittografo.cryptPass(clearPassword);
        //let autenticated = (realPassword == cryptPass);

        let realPassword = (await query(
            'SELECT password FROM account WHERE email = ?', 
            [email]));
        
        //console.log(utenteId[0].id_account);

        let autenticated = (realPassword[0].password == clearPassword);
       // console.log("controllo effettuato!");
        if(!autenticated){
            //console.log("autenticazione fallita")
            throw {message : `Autenticazione fallita`};
        }
        else{
           // console.log("Autenticato con successo!")
            utente =(await model.getAccount(dbPool, utenteId[0].id_account)); 
            //console.log('utente: '+utente);
            return utente;
        }
        
    } catch (error) {

        throw error;
    
    }        
};

//recupero password
model.recuperoPassword = async (dbPool, utenteId, nuovaPassword) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

       // let newClearPassword = crittografo.cryptPass(nuovaPassword);
        
        await query('UPDATE account SET password = ? WHERE id_account = ?', 
        [nuovaPassword, utenteId]
        );
    } catch (error) {
        
        throw error;
    }
}

//registrazione cliente
model.registrazioneCliente = async (dbPool, nome, cognome, email, data_di_nascita, num_telefono, Password, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2,  numero_carta,nome_intestatario, cognome_intestatario, scadenza_carta, cvv) => {
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);

        //mettere check mail non registrata
       /* if(!(email == (await query('SELECT a.email FROM account AS a WHERE a.email = ?', [email]))

        ))throw {'message' : 'Email già registrata.'}; 
        
        if(
            !(
                checkDati.letteraMaiuscola(nome) &&
                checkDati.letteraMaiuscola(cognome) &&
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&& //serve?
                checkDati.controlloPassword(clearPassword) &&
                checkDati.controlloPatente(codice_patente) &&
                checkDati.controlloCarta(numero_carta) &&
                checkDati.isInt(cvv)

            )){ throw {'message' : 'Dati inseriti non validi'}; 
        }*/

        //let cryptPass = crittografo.cryptPass(clearPassword);

        let ruolo = "Cliente";
        console.log("sono nel account model")
        await query(
            `INSERT INTO account
            (ruolo, nome, cognome,data_di_nascita, num_telefono, Password, email) 
            VALUES (?, ?, ?, ?, ?, ?,?)`, 
            [
                'Cliente',
                nome,
                cognome,
                data_di_nascita,
                num_telefono,
                Password,
                email
            ]
        );
        let id = (await query(
            'SELECT id_account FROM account WHERE email = ?', 
            [email]));
            console.log(id[0].id_account);
        
      // dati patente
        await query(
            `INSERT INTO patenti
            (codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, ref_account)            
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, id[0].id_account]
        );
            
        //dati carta 
        await query(
            `INSERT INTO carte_di_credito
            (numero_carta, ref_account, nome_intestatario, cognome_intestatario, scadenza_carta, cvv)            
            VALUES (?, ?, ?, ?, ?, ?)`, 
            [numero_carta, id[0].id_account, nome_intestatario, cognome_intestatario, scadenza_carta, cvv]
        );
            
    } catch (error) {
        
        throw error;
    }
};

//registrazione impiegati

model.registrazioneImpiegato = async (dbPool, ruolo, nome, cognome, email, data_di_nascita, num_telefono, Password, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2) => {
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);
        
        //mettere check mail non registrata
       /* if(!(email == (await query('SELECT email FROM account WHERE email = ?', [email]))

        ))throw {'message' : 'Email già registrata.'}; 

        if(
            !(
                checkDati.letteraMaiuscola(nome) &&
                checkDati.letteraMaiuscola(cognome) &&
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&& //serve?
                checkDati.controlloPassword(clearPassword) &&
                checkDati.controlloPatente(codice_patente)

            )){ throw {'message' : 'Dati inseriti non validi'}; 
        }

        let cryptPass = crittografo.cryptPass(clearPassword);
        */
        
        await query(
            `INSERT INTO account
            (ruolo, nome, cognome, email, data_di_nascita  num_telefono, Password) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`, 
            [
                ruolo, 
                nome,
                cognome,
                email,
                data_di_nascita,
                num_telefono,
                //cryptPass,
                Password
            ]
        );
        let id = (await query(
            'SELECT id_account FROM account WHERE email = ?', 
            [email]));
        
       //dati patente
        await query(
            `INSERT INTO patenti
            (codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, ref_account)            
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, id[0].id_account]
        );

    } catch (error) {
        
        throw error;
    }
};

//aggiungi patente
model.aggiungiPatenteC = async(dbPool, ref_account, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2) =>{

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);
        patente = await query(`
        SELECT *
        FROM patenti
        WHERE ref_account = ? AND codice_patente = ?
        `, [ref_account, codice_patente]);

        if(patente || patente.length != 0){ //se il cliente ha già inserito una patente

            if(patente[0].tipo_a == 1){
                tipo_a = 1;
            }
            if(patente[0].tipo_b == 1){
                tipo_b = 1;
            }
            if(patente[0].tipo_am == 1){
                tipo_am = 1;
            }
            if(patente[0].tipo_a1 == 1){
                tipo_a1 = 1;
            }
            if(patente[0].tipo_a2 == 1){
                tipo_a2 = 1;
            }
            
        }

        await query(`
                UPDATE patenti
                SET scadenza_patente = ?, tipo_a = ?, tipo_b = ?, 
                tipo_am = ?, tipo_a1 = ?, tipo_a2 = ?
                WHERE codice_patente = ? AND ref_account = ?
                `, [scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, codice_patente, ref_account]);   
            
    }
    catch(error){
        throw error;
    }
};

//modifica dati Cliente
model.modificaDatiCliente = async (dbPool,utenteId, nome, cognome,data_di_nascita, num_telefono,email,ruolo,  numero_carta, nome_intestatario, cognome_intestatario ,cvv , scadenza_carta,codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2) => {

    let query = util.promisify(dbPool.query).bind(dbPool);

    try{
        /*if(
            !(
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&& //serve?
                checkDati.controlloPatente(codice_patente) &&
                checkDati.controlloCarta(numero_carta) &&
                checkDati.isInt(cvv)
    
            )){} */
    
        await query('UPDATE account SET nome = ?, cognome = ?, num_telefono = ? WHERE id_account = ?', 
        [nome, cognome, num_telefono,utenteId]);
    
        await query('UPDATE patenti SET codice_patente = ?, scadenza_patente = ?  WHERE ref_account = ?', 
        [codice_patente, scadenza_patente, utenteId]);

        await query('UPDATE carte_di_credito SET numero_carta = ?,nome_intestatario = ?, cognome_intestatario = ?, cvv = ?,  scadenza_carta = ? WHERE ref_account = ?', 
        [ numero_carta, nome_intestatario, cognome_intestatario ,cvv , scadenza_carta, utenteId]);

    } catch (error) {

    throw error;
    }

};

//modifica dati impiegati 
model.modificaDatiImpiegato = async (dbPool, utenteId, nome, cognome, data_di_nascita, num_telefono , email,ruolo, codice_patente, scadenza_patente,tipi_patente) => {

    let query = util.promisify(dbPool.query).bind(dbPool);

    try{
       /* if(
            !(
                checkDati.letteraMaiuscola(nome) &&
                checkDati.letteraMaiuscola(cognome) &&
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&&
                checkDati.controlloPatente(codice_patente)
            )){}*/
    
        await query('UPDATE account SET nome = ?, cognome = ?, num_telefono = ?, email = ?, ruolo = ? WHERE id_account = ?', 
        [nome, cognome, email,ruolo, data_di_nascita, num_telefono, utenteId]);
    
        await query('UPDATE patenti SET codice_patente = ?, scadenza_patente = ?  WHERE ref_account = ?', 
        [codice_patente, scadenza_patente, utenteId]);

    } catch (error) {

    throw error;

    }
};

//elimina account
model.eliminaAccount = async (dbPool, utenteId) => {
    
    try {

    let query = util.promisify(dbPool.query).bind(dbPool);
    //console.log("sono su eliminaAccount -> model");
    await query(` DELETE  FROM account WHERE id_account = ? `, [utenteId] 
    );

    } catch(error) {

        throw error;
    
    }
}

//trova l'indirizzo del parcheggio a partire dall'id dell'addetto
model.getParcheggioAdd = async (dbPool, idAddetto) => {
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query('SELECT * FROM parcheggi WHERE ref_addetto = ?',
        [idAddetto]));

    } catch (error) {
        
        throw error;
    }
};


module.exports = model;