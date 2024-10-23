/* // ! Реалізуйте систему бронювання номерів у готелі. Вона повинна дозволяти створювати номери, бронювати номери і виводити інформацію про заброньовані номери. Використовуйте правильне прив'язування контексту this в методах класу.

Підказка:

Використовуй bind, call, або apply для прив'язування контексту. */

class Hotel {
  constructor() {
    this.rooms = [];
  }

  addRoom = (roomNumber, status) => {
    this.rooms.push({ roomNumber: roomNumber, status: status });
  };

  bookNumber = (bookNumber) => {
    let roomFound = false;
    this.rooms.forEach((room) => {
      if (room.roomNumber === bookNumber) {
        roomFound = true;
        if (room.status === 'free') {
          room.status = 'booked';
          console.log(`Room number ${room.roomNumber} is now ${room.status}`);
        } else if (room.status === 'booked') {
          console.log(`Sorry, the ${room.roomNumber} has been already booked!`);
        }
      }
    });
    if (!roomFound) {
      console.log(`Sorry, we haven't got a room number ${bookNumber}`);
    }
  };
}

const room = new Hotel();

// room.addRoom(1, 'free');
// console.log(room.rooms);
room.addRoom.apply(room, [2, 'booked']);
console.log(room.rooms);
// const newRoom = room.addRoom.bind(room, 3, 'free');
// newRoom();
// console.log(room.rooms);
// room.addRoom.call(room, 4, 'booked');
// console.log(room.rooms);

// room.bookNumber(1);
// console.log(room.rooms);
// room.bookNumber(2);
// console.log(room.rooms);
// room.bookNumber(6);
// console.log(room.rooms);
room.bookNumber(10);
console.log(room.rooms);
