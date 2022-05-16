
let users = []

export const newUser = (userName, socket) => {

  users.push({
    username: userName,
    score: 0,
    id: socket.id
})

// if (users.length >= 2) {
//     randomSortedMovieData()
//     .then(async data => {
//         console.log(data)
//         movie = await data
//         io.emit('new game', data)
//         io.emit('new user', (users))
//     })
// } else {
//     io.emit('new user', (users))
// }
return users
}

export const removeUser = (userName, socket) => {
  let name = ''

  users.forEach(user => {
      if (user.id === socket.id) {
          name = userName

          users = users.filter(user => user.id != userName.id)
      }
  })
  return users
 
}
