// Importez les dépendances nécessaires
const io = require('socket.io-client');
const Playground = require('../public/js/playground/playground');
const Room = require('../public/js/playground/room');

// Mock de la classe Playground
jest.mock('../public/js/playground/playground', () => {
  return jest.fn().mockImplementation(() => {
    return {
      setRoom: jest.fn(),
      changeChronoRoom: jest.fn(),
      setTeam: jest.fn(),
      changeTeam: jest.fn(),
      room: {
        setStartGame: jest.fn(),
        startGame: jest.fn(),
        setChrono: jest.fn(),
        changeChronoRoom: jest.fn(),
        showBtn: jest.fn(),
        setClues: jest.fn(),
        setDeck: jest.fn(),
        changeClues: jest.fn(),
        game: {
          setChrono: jest.fn(),
          changeChronoGame: jest.fn(),
          setEnded: jest.fn(),
        },
        addNotes: jest.fn(),
      },
      refreshView: jest.fn(),
      endedGame: jest.fn(),
      addMessage: jest.fn(),
    };
  });
});

describe('Socket events', () => {
  let socket;
  let playground;

  beforeEach(() => {
    // Créer un socket client et une instance de Playground pour chaque test
    socket = io();
    playground = new Playground(socket);
  });

  afterEach(() => {
    // Nettoyer les mocks après chaque test
    jest.clearAllMocks();
  });

  it('should call setRoom and changeChronoRoom when "setRoom" event is received', () => {
    const room = new Room(0, {}, 1, [], false);
    socket.emit('setRoom', room);

    expect(playground.setRoom).toHaveBeenCalledWith(room);
    expect(playground.changeChronoRoom).toHaveBeenCalled();
  });

  it('should call back, setTeam, and changeTeam when "getTeam" event is received', () => {
    const team = [];
    socket.emit('getTeam', team);

    expect(playground.room.setTeam).toHaveBeenCalledWith(team);
    expect(playground.changeTeam).toHaveBeenCalled();
  });

  it('should call setStartGame and startGame when "getRoom" event is received', () => {
    const startGame = true;
    const team = [];
    socket.emit('getRoom', startGame, team);

    expect(playground.room.setStartGame).toHaveBeenCalledWith(startGame);
    expect(playground.room.startGame).toHaveBeenCalled();
    expect(playground.startGame).toHaveBeenCalled();
  });

  it('should call setChrono, changeChronoRoom, and showBtn when "getChronoRoom" event is received', () => {
    const chrono = 60;
    socket.emit('getChronoRoom', chrono);

    expect(playground.room.setChrono).toHaveBeenCalledWith(chrono);
    expect(playground.room.changeChronoRoom).toHaveBeenCalled();
    expect(playground.showBtn).toHaveBeenCalled();
  });

  it('should call setTeam, refreshView, and set default Room when "refreshData" event is received', () => {
    const team = [];
    socket.emit('refreshData', team);

    expect(playground.setTeam).toHaveBeenCalledWith(team);
    expect(playground.room).toEqual({});
    expect(playground.refreshView).toHaveBeenCalled();
  });

  it('should call setChrono and changeChronoGame when "updateRoomChrono" event is received', () => {
    const chrono = 60;
    const team = [];
    socket.emit('updateRoomChrono', chrono, team);

    expect(playground.room.game.setChrono).toHaveBeenCalledWith(chrono);
    expect(playground.room.game.changeChronoGame).toHaveBeenCalled();
  });

  it('should call setClues, setDeck, and changeClues when "updateClues" event is received', () => {
    const game = { clues: [], deck: [] };
    const team = [];
    socket.emit('updateClues', game, team);

    expect(playground.room.game.setClues).toHaveBeenCalledWith(game.clues);
    expect(playground.room.game.setDeck).toHaveBeenCalledWith(game.deck);
    expect(playground.room.game.changeClues).toHaveBeenCalled();
  });

  it('should call setEnded and endedGame when "updateRoomEnded" event is received', () => {
    const ended = true;
    const team = [];
    socket.emit('updateRoomEnded', ended, team);

    expect(playground.room.game.setEnded).toHaveBeenCalledWith(ended);
    expect(playground.endedGame).toHaveBeenCalled();
  });

  it('should call addNotes and addMessage when "updateMessages" event is received', () => {
    const note = { message: 'Test Note' };
    const team = [];
    socket.emit('updateMessages', note, team);

    expect(playground.room.addNotes).toHaveBeenCalledWith(note);
    expect(playground.addMessage).toHaveBeenCalledWith(note);
  });
});
