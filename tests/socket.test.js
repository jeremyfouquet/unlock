const server = require('../server');
const path = require('path');
const io = require('socket.io-client');
const client1 = io('http://localhost:3000');
const client2 = io('http://localhost:3000');
const client3 = io('http://localhost:3000');

// DATABASE :
//const games = require(path.join('../datas/games.json'));
const players = require(path.join('../datas/players.json'));
const rooms = require(path.join('../datas/rooms.json'));
const robotConversation = require(path.join('../datas/robotConversation.json'));

let player1;
let updatedPlayer1;
let player2;
let player3;
let team;
let note;

client1.on('getTeam', (t) => {
  team = t;
});

client1.on('updateMessages', (n, t) => {
  note = n;
});

describe('addOrUpdatePlayer', () => {

  beforeAll((done) => {
    setTimeout(() => {
      done();
    }, 3000); // (ajuster si nécessaire)
  });

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
  
  it('Doit ajouter trois nouveau joueur à la liste des joueurs', (done) => {
    setTimeout(() => {
      player1 = { id: client1.id, name: 'John', roomId: null };
      player2 = { id: client2.id, name: 'Bob', roomId: null };
      player3 = { id: client3.id, name: 'Donald', roomId: null };
      client1.emit('addOrUpdatePlayer', player1);
      client2.emit('addOrUpdatePlayer', player2);
      client3.emit('addOrUpdatePlayer', player3);
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie la présence des trois nouveaux joueurs dans la database', () => {
    expect(players).toHaveLength(3);
    expect(players[0]).toEqual(player1);
    expect(players[1]).toEqual(player2);
    expect(players[2]).toEqual(player3);
  });

  it('Doit mettre à jour un joueur existant', (done) => {
    setTimeout(() => {
      updatedPlayer1 = { id: client1.id, name: 'Updated John', roomId: null };
      client1.emit('addOrUpdatePlayer', updatedPlayer1);
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie la mise à jour du joueur dans la database', () => {
    expect(players).toHaveLength(3);
    expect(players[0]).toEqual(updatedPlayer1);
  });
  
});

describe('createOrJoinRoom', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });

  it('Doit créer une nouvelle salle et y mettre un joueur', (done) => {
    setTimeout(() => {
      client1.emit('createOrJoinRoom', 0);
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie la présence de la nouvelle salle dans la database', () => {
    expect(rooms.length).toBe(1);
    expect(team.length).toBe(1);
    expect(players[0].roomId).toBeDefined();
    expect(players[0].roomId).toBe(rooms[0].id);
  });

  it('Doit ajouter deux autres joueurs joueurs à la salle existante', (done) => {
    setTimeout(() => {
      client2.emit('createOrJoinRoom', 0);
      client3.emit('createOrJoinRoom', 0);
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie la présence des deux autres joueurs dans la salle existante', () => {
    expect(rooms.length).toBe(1);
    expect(team.length).toBe(3);
    expect(players[0].roomId).toBe(players[1].roomId);
    expect(players[1].roomId).toBe(players[2].roomId);
  });
  
});

describe('start', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit définir un joueur prêt à jouer', (done) => {
    setTimeout(() => {
      client1.emit('start', rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
    
  it('Vérifie que le joueur est prêt à jouer mais pas la partie dans la database', () => {
    expect(team.length).toBe(3);
    expect(players[0].start).toEqual(true);
    expect(rooms[0].startGame).toEqual(false);
  });

  it('Doit définir deux autres joueurs prêts à jouer', (done) => {
    setTimeout(() => {
      client2.emit('start', rooms[0].id);
      client3.emit('start', rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
    
  it('Vérifie que les les deux autres joueurs sont prêts à jouer et que la partie aussi dans la database', () => {
    expect(team.length).toBe(3);
    expect(players[1].start).toEqual(true);
    expect(rooms[0].startGame).toEqual(true);
  });

});

describe('addClue', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit transférer un clue du deck vers les clues', (done) => {
    setTimeout(() => {
      client1.emit('addClue', 11, rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie le transfert du clue du deck vers les clues dans la database', () => {
    expect(rooms[0].game.clues[1].id).toBe(11);
    expect(rooms[0].game.deck[0].id).toBe(16);
  });
  
 });

 describe('penalty', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit retirer du temps au chrono du jeu', (done) => {
    setTimeout(() => {
      rooms[0].game.chrono = 10;
      client1.emit('penalty', 1, rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie que du temps a été retiré dans la database et qu\'un message est transmis à l\'utilisateur', () => {
    expect(note.message).toBe(robotConversation["E"]);
    expect(rooms[0].game.chrono).toBe(8);
    
  });

  it('Doit retirer du temps au chrono du jeu déjà à 0', (done) => {
    setTimeout(() => {
      rooms[0].game.chrono = 0;
      client1.emit('penalty', 1, rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie que le chrono du jeu reste à 0 dans la database', () => {
    expect(rooms[0].game.chrono).toBe(0);
    
  });
  
 });

describe('winGame', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit signaler le jeu comme étant terminé', (done) => {
    setTimeout(() => {
      client1.emit('winGame', rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie que le jeu est signalé comme terminé dans la database', () => {
    expect(rooms[0].game.ended).toBe(true);
  });

 });

 describe('message', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit ajouter une note dans le jeu', (done) => {
    setTimeout(() => {
      client1.emit('message', 'echo', players[0], rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie que la note est ajoutée dans la database et que le message est reçu', () => {
    expect(rooms[0].notes.length).toBe(4);
    expect(note.message).toBe('echo');
  });

  it('Doit ajouter une note dans le jeu et provoquer une réponse du robot', (done) => {
    setTimeout(() => {
      client1.emit('message', 'indice 11', players[0], rooms[0].id);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Attend la réponse du robot...', (done) => {
    setTimeout(() => {
      done();
    }, 4000); // (ajuster si nécessaire)
  });

  it('Vérifie que la note est ajoutée dans la database et que la réponse du robot est juste', () => {
    expect(rooms[0].notes.length).toBe(6);
    expect(note.message).toBe(robotConversation["11"]);
  });

 });

 describe('disconnect', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit déconnecter un joueur', (done) => {
    setTimeout(() => {
      client3.close();
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie que le joueur est supprimé de la database', () => {
    expect(players).toHaveLength(2);
  });

 });

describe('back', () => {

  beforeEach((done) => {
    setTimeout(() => {
      done();
    }, 1000); // (ajuster si nécessaire)
  });
    
  it('Doit supprimer le lien entre un joueur et une salle', (done) => {
    setTimeout(() => {
      client1.emit('back', players[0].roomId);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
    
  it('Vérifie la suppression du lien dans la database', () => {
    expect(rooms.length).toBe(1);
    expect(team.length).toBe(1);
    expect(players[0].roomId).toEqual('');
  });

  it('Doit supprimer le lien d\'un second joueur et supprimer la salle', (done) => {
    setTimeout(() => {
      client2.emit('back', players[1].roomId);
      done();
    }, 4000); // (ajuster si nécessaire)
  });
  
  it('Vérifie la suppression du lien du second joueur et de la salle dans la database', () => {
    expect(rooms.length).toBe(0);
    expect(players[1].roomId).toEqual('');
  });

  afterAll((done) => {
    setTimeout(() => {
      client1.close();
      client2.close();
      //client3.close();
      server.close();
      done();
    }, 4000); // (ajuster si nécessaire)
  });

});
  

    