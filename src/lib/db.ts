type UserRecord = {
  id: number;
  name: string;
  email: string;
  password: string;
};

const storageKey = "northstar-users";

function readUsers() {
  if (typeof window === "undefined") {
    return [] as UserRecord[];
  }

  const raw = window.localStorage.getItem(storageKey);
  return raw ? (JSON.parse(raw) as UserRecord[]) : [];
}

function writeUsers(users: UserRecord[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(storageKey, JSON.stringify(users));
}

export function getUserByEmail(email: string) {
  return readUsers().find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function createUser({ name, email, password }: { name: string; email: string; password: string }) {
  const users = readUsers();
  const nextId = users.length + 1;
  const user = { id: nextId, name, email: email.toLowerCase(), password };
  users.push(user);
  writeUsers(users);
  return user.id;
}
