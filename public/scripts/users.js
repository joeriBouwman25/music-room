let users = []

export const newUser = (userName, userId) => {
  const user = {
    id: userId,
    name: userName
  }
  const idExcist = users.find(user => user.id === userId)
  const nameExcist = users.find(user => user.name === userName)
  if (!idExcist && !nameExcist) {
    users.push(user)
  }
  return users
}

export const removeUser = (userData) => {
  const updatedUsers = users.filter(user => user.id !== userData.id)
  users = updatedUsers
  return users
}
