/**Esercizio
Sfruttando l’api https://api.chucknorris.io/jokes/random creare un applicazione che scarica una battuta random, la aggiunge ad un file json norrisDb.json e la mostra all’utente.
Il file json quindi dovrà contenere la lista di tutte le battute scaricate nell’arco del tempo.
E ricordate, con Chuck Norris le API non hanno il coraggio di ritornare un errore, per paura che Chuck le punisca.
BONUS:
Quando viene scaricata una battuta, controllare che questa non sia già presente nel file json locale. Se lo è, caricare un altra battuta.
Buon lavoro!
**/

// ! importo i pacchetti installati tramite npm
const http = require("http");
const dotenv = require("dotenv");
const axios = require("axios");
const fs = require("fs");

// ! lancio dotenv
dotenv.config();



// ! default 3000, ma posso impostarla anche tramite .env
port = process.env.PORT || 3000;

// ! endpoint in una variabile
const baseUri = 'https://api.chucknorris.io/jokes/random';

// ! creo una funzione che faccia una chiamata all'endopoint fornito tramite axios, per ricavare una frase random
function getRandomPhrase() {
    return axios.get(baseUri)
        .then(response => response.data.value)
        .catch(error => {
            console.error(error);
        });
}

// ! preparo la funzione per rispondere tramite html
function htmlResponse(res, content) {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(content);
};

// ! creo il server e chiamo la funzione precedentemente creata, nel .then controllo se la frase è in data (che sarebbe l'array del .json)
// ! se non è in data, la pusho in data e poi la scrivo nel json tramite writeFileSync
// ! se ho errori, faccio un console error e poi mostro a video un errore generico.
const server = http.createServer(function (req, res) {
    getRandomPhrase()
        .then(phrase => {
            if (phrase) {
                const data = require("./db/norrisDb.json");
                if (!data.includes(phrase)) {
                    data.push(phrase);
                    fs.writeFileSync("./db/norrisDb.json", JSON.stringify(data, null, 2));
                }
                htmlResponse(res, "<h1>" + phrase + "</h1>");
            } else {
                htmlResponse(res, "<h1>Errore nel recupero della battuta</h1>");
            }
        })
        .catch(error => {
            console.error("Errore durante la gestione della richiesta:", error);
            htmlResponse(res, "<h1>Errore nella gestione della richiesta</h1>");
        });
});

// ! lo avvio
server.listen(port, function () {
    console.log("Server attivo su: http://localhost:" + port);
});

