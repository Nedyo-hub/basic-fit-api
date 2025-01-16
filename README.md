# API Project

Dit project is een eenvoudige API gebouwd met **Node.js** en **Express**, met een **SQLite-database**. Het biedt functionaliteiten voor het beheren van gebruikers of het zien van documentatie.

## Overzicht

De API biedt endpoints voor het ophalen, toevoegen, bewerken en verwijderen van gebruikers.

### Installatie

1. Clone de repository:
   git clone https://github.com/Nedyo-hub/basic-fit-api.git

2. Installeer de benodigde npm-pakketten: npm install

3. Configuratie
Database: De API maakt gebruik van een SQLite-database. Je hoeft geen extra configuraties voor de database te doen, aangezien deze al in de projectmap is aangemaakt.
Poort: De standaardpoort is ingesteld op 3000.

4. Start de server:
npm start

#### TESTEN

1. Open Postman
2. Test de commands die worden getoond in documentatie.html hieronder staan voorbeelden
GET http://localhost:3000/users: Haal alle gebruikers op.
POST http://localhost:3000/users: Voeg een nieuwe gebruiker toe.
PUT http://localhost:3000/users/:id: Bewerk een bestaande gebruiker.
DELETE http://localhost:3000/users/:id: Verwijder een gebruiker via id.


##### Bronnen:
ChatGPT voor structuur-enhancing en troubleshooten
Maintaining REST API Documentation with Node.js — Part I