
export const renderLogin = (req, res) => {
  res.render('login')
}

export const renderIndex = async (req, res) => {
  const userName = req.body.userName
  res.render('index', {
    userName
  })
}

export const renderWinner = (req, res) => {
  const winner = req.params.winnerName
  res.render('winner', {
    winner
  })
}
