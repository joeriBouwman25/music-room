# Real Time Web - Music Room

Een multiplayer mini game waarbij je als eerste de naam of artiest bij een random albumhoes moet raden

<img src="/assets/main%20screen.png" alt="screenshot van de homepagina" width="700"/>

## Inhoudsopgave

- [Real Time Web](#real-time-web-music-room)
  - [Inhoudsopgave](#Inhoudsopgave)
  - [Live demo](#computer-live-demo)
  - [Concept](#concept)
  - [External data source](#external-data-source)
    - [Music-genre API](#Music-genre-API)
    - [Last-FM API](#Last-FM-API)
  - [Data lifecycle](#data-lifecycle)
  - [Data management](#data-management)
  - [Multi-user support](#multi-user-support)
  - [Real time events](#real-time-events)
    - [Connection](#connection)
    - [Clients](#clients)
    - [New client](#new-client)
    - [Start game](#start-game)
    - [Pause game](#pause-game)
    - [Chat message](#hat-message)
    - [Correct](#correct)
    - [Wrong](#wrong)
    - [2/4/6 Mistakes](#2/4/6-mistakes)
    - [Winner](#winner)
    - [Disconnect](#disconnect)
  - [Features](#features)
  - [Installation](#installation)
  - [Wishlist](#wishlist)
  - [Assignment](#assignment)
    - [Goals](#goals)
    - [Grading](#grading)
  - [auteur](#auteur)
  - [License](#icense)

## Live demo

[Live demo](https://cmd-music-room.herokuapp.com/)

## Concept

Om tot één concept te komen ben ik begonnen met het schetsen van meerdere ideeën:

<img src="/assets/schets 1 + 2.jpeg" alt="schetsen" width="400"/><img src="/assets/schets 3 + 4.jpeg" alt="schetsen" width="400"/><img src="/assets/schets 5 + 6.jpeg" alt="schetsen" width="400"/><img src="/assets/schets 7 + 8.jpeg" alt="schetsen" width="400"/>

Uit de schetsen haalde ik drie mogelijke concepten:

1.  Spotify Roulette, een app waarbij gebruikers gezamelijk naar muziek kunnen luisteren en gestemd kan worden of deze in een gezamelijke afspeellijst toegevoegd moet worden. Voor dit concept wordt de Spotify API gebruikt.

2.  Spotify Room, een app waarbij gebruikers de muziek die ze op dat moment luisteren kunnen delen met andere en hier over kunnen chatten, ook is het mogelijk om elkaars favoriete nummers op te slaan. Voor dit concept wordt de Spotify API gebruikt.

3.  Music Room, een app waarbij gebruikers een random albumhoes te zien krijgen waarvan zij of de titel of de artiest van het album moeten raden. Wanneer het antwoord goed is verdient de gebruiker punten. Wanneer een gebruiker een nader te bepalen totaal aantal punten heeft wint diegene het spel.

Uiteindelijk koos ik er voor om met het tweede concept aan de slag te gaan omdat het me interessant leek om een chatroom gebasseerd om Spotify te kunnen bouwen.

Na een hele hoop worstelen met de API bleek wat ik wou helaas niet mogelijk te zijn wegens gebruikers rechten en de functionaliteiten in de API. Daarom heb ik uiteindelijk nog gewisseld naar concept 3: Music Room. (De code van mijn oorspronkelijke concept is nog te bekijken in deze repo: [https://github.com/joeriBouwman25/real-time-web-2122](https://github.com/joeriBouwman25/real-time-web-2122) )

Voor concept 3 was ik oorspronkelijk van plan om ook de Spotify API gebruiken maar heb dit gewisseld naar de Last-FM API omdat hier geen Oauth login vereist was en er geen limiterende gebruikers rechtten aan de API hingen.

## External data source

Om een random album hoes met de applicatie op te kunnen halen gebruik ik twee verschillende API's;

- [Music-Genres](https://github.com/gavischneider/music-genres)
- [Last-Fm](https://www.last.fm/api)

De eerste API die ik gebruik is een _music-genre_ API. Met deze API haal ik een lijst met genres op. Uit deze lijst haal ik met een functie een random genre op die ik vervolgens als een zoek query gebruik in de _Last-Fm_ API.

### [Music-genre API](https://github.com/gavischneider/music-genres)

Om de lijst met genres op te vragen van de API gebruik ik de NPM package _music-genres_ met de volgende functie:

```js
export const getGenres = async () => {
  const allGenres = musicGenres.getAllGenres();
  const genres = Object.keys(allGenres);
  return genres;
};
```

De lijst die je terug krijgt is een Object met 13 keys voor genres, per genre is er een array met subgenres:

```Js
{
 Blues: [
    'Acoustic Blues',
    'Chicago Blues',
    'Classic Blues',
    'Contemporary Blues',
    'Country Blues',
    'Delta Blues',
    'Electric Blues'
  ],
Rock: [etc.]
}

```

Met een random functie haal ik 1 genre op uit het Object.

### [Last-FM API](https://www.last.fm/api)

Met de Last-FM API is het mogelijk om data over artiesten, albums en nummers op te halen, per categorie kun je weer op _tags_ zoeken, deze tags zijn het genre die bij de categorie hoort. De API heeft geen endpoint om alle soorten tags op te halen, vandaar dat ik een andere API gebruik om toch genres te krijgen.
Met de tag haal ik een lijst met top 100 albums bij de desbetreffende tag, uit deze lijst haal ik weer één random album waar ik de info van gebruik.
De volgende functies gebruik ik om een uiteindelijk een random album op te halen van Last-FM en hier van de albumhoes, naam en artiest te emitten van de server naar de client:

```js
export const getAlbums = async (genre) => {
  const key = process.env.KEY;
  const url = `http://ws.audioscrobbler.com/2.0/?method=tag.gettopalbums&tag=${genre}&api_key=${key}&format=json`;
  const res = await fetch(url);
  const data = await res.json();
  const albums = data.albums.album;
  return albums;
};

export const getAlbumToStartGame = async () => {
  const genres = await genreController.getGenres();
  const randomGenre = genreController.getRandomGenre(genres);
  const albums = await albumController.getAlbums(randomGenre);
  const randomAlbum = await albumController.getRandomAlbumCover(albums);
  const album = {
    name: randomAlbum.name,
    artist: randomAlbum.artist.name,
    cover: randomAlbum.image[3],
  };
  io.emit("new album", album);
};
```

## Data lifecycle

Om beter te begrijpen wat er in de applicatie gebeurd heb ik een data lifecycle gemaakt:

<img src="/assets/data-life-cycle.png" alt="data life cycle" width="700"/>

## Data management

Om de data te beheren gebruik ik de array: `users[]`. Per gebruiker wordt er een Object aangemaakt wanneer deze een gebruikersnaam heeft gesubmit, dit Object ziet er als volgt uit:

```js
{
  username: username,
  score: 0,
  id: socket.id,
};
```

Ik heb gebruik de _username_ Key om te checken welke gebruikers er in de game zitten, ik doe dit op naam en niet op het socket.id omdat wanneer een gebruiker de verbinding met de server verliest en daarna weer connect er een nieuw socket verbinding met nieuw id wordt gestart. om te voorkomen dat gebruikers meerdere keren worden toegevoegd of niet hun score geupdate kunnen krijgen check ik dus op naam.

Omdat ik op naam check is het niet mogelijk voor gebruikers om een username te submitten die al in de game zit.

<img src="/assets/username%20error.png" alt="Gebruikersnaam is al in gebruik" width="300"/>

`const users` wordt op de volgende momenten vanaf de server naar de client verstuurd om alle gebruikers up to date te houden:

- Wanneer een gebruiker verbinding maakt met de Server
- Wanneer een gebruiker een gebruikersnaam heeft gesubmit en de game room betreed
- Wanneer een gebruiker een antwoord goed raadt zodat de score geupdate kan worden
- Wanneer een gebruiker de connectie met de server verbreekt/verliest

De album data die van de Last-FM API wordt opgehaald wordt _gecleaned_ en in een Object `const album` opgeslagen. Dit Object ziet er als volgt uit:

```js
const album = {
  name: randomAlbum.name,
  artist: randomAlbum.artist.name,
  cover: randomAlbum.image[3],
};
```

De album data wordt verder niet opgeslagen waardoor er een nieuw album wordt vertoond zodra een van de gebruikers zijn/haar pagina refreshed. Dit had ik graag nog willen oplossen door het album in local storage of database op te slaan maar door tijd gebrek zit dit niet in de applicatie.

## Multi-user support

In mijn applicatie wordt niet gebruik gemaakt van meerdere rooms, zodra een gebruiker een gebruikersnaam heeft uitgekozen wordt deze in een algemene room gestopt, hier komen alle gebruikers dus in. Bij het aanmaken van een gebruikersnaam is al te zien hoeveel personen op dat moment al in de room zitten.

In de room zelf is het voor gebruikers te zien welke gebruikers er op dat moment mee doen, hoeveel punten elke gebruiker heeft en wanneer een gebruiker de room verlaat. Ook zijn chat berichten voor alle gebruikers te zien en krijgt elke gebruiker dezelfde albumhoes te zien.

Om te voorkomen dat de server overbelast raakt met teveel user input heb ik een limiet van maximaal 10 gebruikers per game sessie ingesteld, zodra de room vol is kunnen nieuwe gebruikers niet joinen. Ook heb ik een limiet van 35 karakters ingesteld op het input veld om de albums te raden, zodat de server niet overbelast raakt met enorme berichten.

## Real time events

### Connection

Het io _"connection"_ event is als het ware het "hoofd event", deze wordt uitgevoerd wanneer er een client een connectie maakt met de server, alle logica voor andere events staat binnen in het connection event:

```js
io.on("connection", (socket) => {
  io.emit("clients", users);
  // etc..
});
```

### Clients

Het _"clients"_ event wordt aangeroepen direct wanneer de socket verbinding is gemaakt. Vanaf de server wordt een lijst met alle users die op dat moment verbonden zijn ge-emit naar de client, dit wordt gedaan om het aantal gebruikers dat op dat moment in de app zitten weer te geven. Wanneer er 10 gebruikers in de app zitten kan er niemand meer bij. Ook zijn er minimaal twee gebruikers nodig voordat het spel kan starten.
Ook wanneer een gebruiker de room verlaat wordt dit event ge-emit om zo de gebruikers in de room up to date te houden.
Wanneer een album juist wordt geraden wordt dit event ge-emit om de score van de gebruikers te updaten.

_"clients"_ wordt vanaf de server naar de client ge-emit.

### New Client

Het _"new client"_ event wordt aangeroepen wanneer een gebruiker een username heeft ingevuld en gesubmit.
Met dit event worden de gebruikers gegevens opgeslagen als een object in een array.

```js
const myProfile = users.forEach((user) => user.username.includes(userName));
if (!myProfile) {
  users.push({
    username: userName,
    score: 0,
    id: socket.id,
  });
}
```

Het event wordt vanaf de clientside naar de server ge-emit.

### Start game

Het _"start game"_ event wordt aangeroepen wanneer er meer dan twee gebruikers in de room zitten. Met dit event wordt het laad scherm verborgen en het eerste album weergegeven. Het event wordt ge-emit van de server naar de client.

### Pause game

Het _"pause game"_ event wordt aangeroepen wanneer een gebruiker de room verlaat en er vervolgens minder dan twee gebruikers overblijven in de room. Het event zorgt er voor dat het laad scherm weer geactiveert wordt en het spel dus op pauze wordt gezet. Het event wordt ge-emit van de server naar de client.

### Chat message

Het _"chat message"_ event wordt aangeroepen wanneer een gebruiker een bericht stuurt in de game room, vanaf de client wordt dit event ge-emit naar de server en vervolgens weer van de server naar de client terug zodat elke client het bericht ontvangt.

### Correct

Het _"correct"_ event wordt aangeroepen wanneer een gebruiker een juist album of artiest raadt in de game room, wanneer het event plaats vindt wordt er aan de gebruiker die het antwoord goed had 10 punten opgeteld. Dit event wordt vanaf de server naar de client ge-emit.

### Wrong

Het _"wrong"_ event wordt aangeroepen wanneer een gebruiker een fout antwoord invoerd in de game room. vanaf de server wordt het event ge-emit naar de clients, om zo wanneer het antwoord niet goed is daar feedback op te geven.
Ook zal het aantal pogingen dat de gebruikers hebben om het antwoord goed te raden met 1 naar beneden gaan.

### 2/4/6 Mistakes

Het _"2 mistakes"_ event wordt aangeroepen wanneer er twee keer een verkeerd antwoord is gegeven in de game room.
wanneer het event wordt aangeroepen wordt er een functie uitgevoerd om de albumhoes minder blurry te maken zodat deze zichtbaarder wordt voor de gebruiker. Een gelijke functie heb ik ook gemaakt voor bij vier foute antwoorden, _"4 mistakes"_, en bij 6 foute antwoorden _"6 mistakes"_. Wanneer deze events worden aangeroepen zal de albumhoes nog zichtbaarder worden. Bij het _"6 mistakes"_ event zijn de pogingen van de gebruikers op en zal er een nieuwe albumhoes ingeladen worden.

Alle drie deze events worden vanaf de server naar de client ge-emit.

### Winner

Het _"winner"_ event wordt aangeroepen wanneer een gebruiker 60 punten heeft verdient, per goed antwoord krijgt een gebruiker 10 punten. nadat het event is uitgevoerd worden alle clients doorgestuurd naar de winner pagina en kan er een nieuw potje gestart worden. Dit event wordt vanaf de server naar de client ge-emit.

### Disconnect

Het _"disconnect"_ event wordt aangeroepen wanneer een gebruiker de game verlaat of zijn/haar internet verbinding verliest. De server luisterd dus of een client nog wel verbonden is met de server. Wanneer het event wordt aangeroepen worden de gebruikers geupdate met het _"clients"_ event. Wanneer er minder dan twee gebruikers overblijven na het _"disconnect"_ event zal het _"pause game"_ event worden uitgevoerd.

## Features

- Een spel spelen met andere gebruikers
- Albums/ Artiesten raden
- Chat berichten versturen
- Punten verdienen
- Een gebruikersnaam kiezen

## Installatie

1. Clone de volgende repository door de onderstaande regel in de terminal in te voeren:

`$ git clone https://github.com/joeribouwman25/music-room.git`

2. Installeer vervolgens de NPM packages met de regel:

`$ npm install`

3. Verkrijg een API key voor de Last-FM API

Lees [hier](https://www.last.fm/api/authentication) meer over hoe je een API key verkrijgt

4. PLaats je API key en de Port van de server op in een _.env_ bestand
   Sla de key in het .env bestand als volgt op:
   `KEY=API_KEY`

   Sla de PORT in het .env bestand als volgt op:
   `PORT="8000"`

5. Start de applicatie op de volgende regel in de terminal:

`$ npm start`

## Wishlist

De volgende functies had ik nog willen uitwerken maar dit is door tijdsgebrek niet gelukt:

- Gebruik maken van meerdere rooms
- In plaats van een random genre waaruit een album wordt gehaald de keuze kunnen hebben een genre per room te kiezen
- Het koppelen van een database zodat gestuurde berichten niet verdwijnen wanneer de app wordt afgesloten

## Assignment

During this course you will learn how to build a real-time application. You will learn techniques to setup an open connection between the client and the server. This will enable you to send data in real-time both ways, at the same time.

### Goals

After finishing this program you can:

- _deal with real-time complexity;_
- _handle real-time client-server interaction;_
- _handle real-time data management;_
- _handle multi-user support._

### Grading

Your efforts will be graded using a single point rubric (see below). You will have to pass the criterion (centre column) to pass the course. During the test you will be consulted and will be given feedback on things we think deficient and things we think are an improvement on the criterion.

| Deficiency | Criterion                                                                                                                                                                                                                                                   | Improvement |
| :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------- |
|            | _Project_ Your app is working and published on Heroku. Your project is thoroughly documented in the `README.md` file in your repository. Included are a description of the data-lifecycle, real-time events and external data source used by your app.      |             |
|            | _Complexity_ You’ve implemented enough real-time functionality for us to test your comprehension of the subject. A lot of functionality is self-written. You are able to manipulate online examples live.                                                   |             |
|            | _Client-server interaction_ By interacting with the app, a user can influence the data model of the server in real time by directly modifying data OR by influencing API requests between server and source. The student has set up the data manipulations. |             |
|            | _Data management_ The server maintains a data model and each client is continuously updated with the correct data.                                                                                                                                          |             |
|            | _Multi-user support_ Multiple clients can connect to the server. Interaction works as expected and is not dependent on the number of clients. You can explain how your app approaches this.                                                                 |             |

## Auteur

Joeri Bouwman

## License

[MIT](https://github.com/joeribouwman25/music-room/blob/main/LICENSE)
