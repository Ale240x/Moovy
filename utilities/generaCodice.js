var codiceRecupero = {};

codiceRecupero.codice = () => {

    var num = '0123456789';
    let codice = '';

    for(let i = 0; i<6; i++){
        codice += num[Math.floor(Math.random() * 10)];
    }
    
    return codice;

}

module.exports = generaCodice; 