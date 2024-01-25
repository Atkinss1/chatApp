// state
const UsersState = {
  users: [],
  setUsers: function(newUsersArray) {
    this.users = newUsersArray;
  }
}

export function buildMsg(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat('default', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    }).format(new Date())
  };
};

export function activateUser(id, name, room) {
  const user = { id, name, room };
  UsersState.setUsers([
    ...UsersState.users.filter(user => user.id !== id),
    user
  ])
  return user;
};

export function userLeavesApp(id) {
  UsersState.setUsers(
    UsersState.users.filter(user => user.id !== id)
  );
};

export function getUser(id) {
  return UsersState.users.find(user => user.id === id);
};

export function getUsersInRoom(room) {
  return UsersState.users.filter(user => user.room === room);
}

export function getAllActiveRooms() {
  return Array.from(new Set(UsersState.users.map(user => user.room)));
}