const { copyFileSync } = require("fs");
const util = require("util");
const checkDati = require('../utilities/checkDati');
const crittografo = require('../utilities/crittografo');

var model = {};

//entity utente
model.getAccount = async (dbPool, utenteId) => {
    
    try {
       // console.log("sono sul getAccount")
        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query(`SELECT  
                                *
                            FROM 
                                account AS a,
                                patenti AS p,
                                carte_di_credito AS c
                            WHERE a.id_account = p.ref_account OR c.ref_account = a.id_account
                            OR a.id_account = ?`,
                            [utenteId]));

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
            return (await model.getAccount(dbPool, utenteId[0].id_account)); 
        }
        
    } catch (error) {

        throw error;
    
    }        
};

//recupero password
model.recuperoPassword = async (dbPool, utenteId, nuovaPassword) => {

    try{
        let query = util.promisify(dbPool.query).bind(dbPool);

        let newClearPassword = crittografo.cryptPass(nuovaPassword);
    
        await query('UPDATE account SET password = ? WHERE id_account = ?', 
        [newClearPassword, utenteId][0]
        );
    } catch (error) {
        
        throw error;
    }
}

//registrazione cliente
model.registrazioneCliente = async (dbPool, nome, cognome, email, data_di_nascita, num_telefono, clearPassword, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2,  numero_carta, scadenza_carta, cvv) => {
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);

        //mettere check mail non registrata
        if(!(email == (await query('SELECT email FROM account WHERE email = ?', [email]))

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
        }

        let cryptPass = crittografo.cryptPass(clearPassword);

        let ruolo = "Cliente";
        
        await query(
            `INSERT INTO account
            (ruolo, nome, cognome, data_di_nascita, num_telefono, password, email) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                ruolo,
                nome,
                cognome,
                data_di_nascita,
                num_telefono,
                cryptPass,
                email
            ]
        );
        
       //dati patente
        await query(
            `INSERT INTO patente
            (codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, ref_account,)            
            VALUES (?, ?, ?)`, 
            [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, account.id]
        );

        //dati carta 
        await query(
            `INSERT INTO carta_di_credito
            (numero_carta, ref_account, nome_intestatario, cognome_intestatario, scadenza_carta, cvv)            
            VALUES (?, ?, ?)`, 
            [numero_carta, account.id, nome, cognome, scadenza_carta, cvv]
        );

    } catch (error) {
        
        throw error;
    }
};

//registrazione impiegati

model.registrazioneImpiegato = async (dbPool, ruolo, nome, cognome, email, data_di_nascita, num_telefono, clearPassword, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2) => {
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);
        
        //mettere check mail non registrata
        if(!(email == (await query('SELECT email FROM account WHERE email = ?', [email]))

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
        
        await query(
            `INSERT INTO account
            (ruolo, nome, cognome, email, data_di_nascita, num_telefono, clearPassword) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, 
            [
                ruolo, 
                nome,
                cognome,
                data_di_nascita,
                num_telefono,
                cryptPass,
                email
            ]
        );
        
       //dati patente
        await query(
            `INSERT INTO patente
            (codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, ref_account)            
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, 
            [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, account.id]
        );

    } catch (error) {
        
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

        return (await query('SELECT indirizzo FROM parcheggi WHERE ref_addetto = ?',
        [idAddetto]))[0];

    } catch (error) {
        
        throw error;
    }
};


module.exports = model;