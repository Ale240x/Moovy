var validator = require('validator');

validator.controlloTel = (tel) => {

    let regExp = /^((\+|00)[1-9]{2}|0)?([1-9]{2,3})([0-9]{6,10})$/g

    return regExp.exec(tel);
}

validator.controlloPassword = (password) => {

    let regExp = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%\.,^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;

    return regExp.exec(password);

};

validator.letteraMaiuscola = (str) => {

    let regExp = /(^[A-Z][A-z ]+)/;

    return regExp.exec(str);

};

validator.controlloCarta = (carta) => {
    
    let regExp = /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/;

    return regExp.exec(carta);

}

validator.controlloPatente = (patente) => {

    let regExp = /^U1[A-Z0-9]{7}[A-Z]$/; 
    //la sigla U1 + 7 caratteri alfanumerici + 
    //un carattere alfabetico di controllo (ad esempio U1H68I903B)

    return regExp.exec(patente);
}


module.exports = validator; 
