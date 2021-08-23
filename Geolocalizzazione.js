var options = { 
    enableHighAccuracy: true,
    timeout: 3000,
    maximumAge: 0
};

navigator.geolocation.getCurrentPosition(localizzazione, gestioneErrore, options);
var latitudine;
var longitudine;

function localizzazione(posizione) {
    latitudine = posizione.coords.latitude;
    longitudine = posizione.coords.longitude;
    document.getElementById("mappa").src = 'http://maps.google.it/maps?hl=it&ie=UTF8&q=' +
        posizione.coords.latitude + ',' + posizione.coords.longitude + '&z=17&output=embed';
    /*
    var mappa = document.getElementById("mappa");
    mappa.src ="https://maps.googleapis.com/maps/api/staticmap?center="
        + posizione.coords.latitude + ',' + posizione.coords.longitude + "&zoom=17&size=500x500&key=AIzaSyCnqevhmjheFdXsB-0mzBjl0Uhmc24ERS0"; 
    */
}

function gestioneErrore(error) {

    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("dato che non hai permesso l'invio delle informazioni, non so dirti dove sei");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("non riesco a recuperare e inviare le informazioni necessarie");
            break;
        case error.TIMEOUT:
            alert("il server ritarda a rispondere");
            break;
        case error.UNKNOWN_ERROR:
            alert("si è verificato un errore imprevisto");
            break;
    }
}