const util = require("util");
const checkDati = require('../utilities/checkDati');
const crittografo = require('../utilities/crittografo');

var model = {};

//entity utente
model.getAccount = async (dbPool, utenteId) => {
    
    try {

        let query = util.promisify(dbPool.query).bind(dbPool);

        return (await query(`SELECT  
                                a.id_utente,
                                a.ruolo,
                                a.nome,
                                a.cognome,
                                a.data_di_nascita,
                                a.num_telefono,
                                a.email,
                                p.codice_patente,
                                p.scadenza_patente,
                                p.tipo_a,
                                p.tipo_b,
                                p.tipo_am,
                                p.tipo_a1,
                                p.tipo_a2
                                c.numero_carta,
                                c.nome_intestatario,
                                c.cognome_intestatario,
                                c.scadenza_carta,
                                c.cvv
                            FROM 
                                account AS a,
                                patente AS p,
                                carte_di_credito AS c
                            WHERE a.id_account = ? AND p.ref_account = ? AND c.ref_account= ?`
                            [utenteId]))[0];

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

        let realPassword = (await query(
            'SELECT password FROM account WHERE id_account = ?', 
            [utenteId]))[0];
        
        let cryptPass = crittografo.cryptPass(clearPassword);
        let autenticated = (realPassword == cryptPass);
        
        if(!autenticated){
            throw {message : `Autenticazione fallita`};
        }
        else{
            return (await model.getAccount(dbPool, utenteId)); 
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
model.modificaDatiCliente = async (dbPool, utenteId, num_telefono, codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, numero_carta, scadenza_carta, cvv) => {

    let query = util.promisify(dbPool.query).bind(dbPool);

    try{
        if(
            !(
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&& //serve?
                checkDati.controlloPatente(codice_patente) &&
                checkDati.controlloCarta(numero_carta) &&
                checkDati.isInt(cvv)
    
            )){}
    
        await query('UPDATE account SET nome = ?, cognome = ?, email = ?, data_di_nascita = ?, num_telefono = ? WHERE id_account = ?', 
        [nome, cognome, email, data_di_nascita, num_telefono], [0]
        );
    
        await query('UPDATE patente SET codice_patente = ?, scadenza_patente = ?  tipo_a = ?, tipo_b = ?, tipo_am = ?, tipo_a1 = ?, tipo_a2 = ? WHERE id_account = ?', 
        [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, utenteId], [0]
        );

        await query('UPDATE carta_di_credito SET numero_carta = ?, scadenza_carta = ?, cvv = ? WHERE id_account = ?', 
        [numero_carta, scadenza_carta, cvv, utenteId], [0]
        );

    } catch (error) {

    throw error;
    }

};

//modifica dati impiegati 
model.modificaDatiImpiegato = async (dbPool, utenteId, nome, cognome, email, data_di_nascita, num_telefono, nuovaClearPassword, codice_patente, scadenza_patente) => {

    let query = util.promisify(dbPool.query).bind(dbPool);

    try{
        if(
            !(
                checkDati.letteraMaiuscola(nome) &&
                checkDati.letteraMaiuscola(cognome) &&
                checkDati.isEmail(email) &&
                checkDati.controlloTel(num_telefono)&&
                checkDati.controlloPassword(nuovaClearPassword) &&
                checkDati.controlloPatente(codice_patente)
            )){}
    
        await query('UPDATE account SET nome = ?, cognome = ?, email = ?, data_di_nascita = ?, num_telefono = ? WHERE id_account = ?', 
        [nome, cognome, email, data_di_nascita, num_telefono], [0]
        );
    
        await query('UPDATE patente SET codice_patente = ?, scadenza_patente = ?  tipo_a = ?, tipo_b = ?, tipo_am = ?, tipo_a1 = ?, tipo_a2 = ? WHERE id_account = ?', 
        [codice_patente, scadenza_patente, tipo_a, tipo_b, tipo_am, tipo_a1, tipo_a2, utenteId], [0]
        );

    } catch (error) {

    throw error;

    }
};

//elimina account
model.eliminaAccount = async (dbPool, utenteId) => {
    
    try {
        if(!(
            validatoreDati.isInt(utenteId)
            )){
            throw {message:  'Argomento non valido'}
        }

    let query = util.promisify(dbPool.query).bind(dbPool);
    
    await query(`DELETE * FROM account WHERE id = ?`, [utenteId] 
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