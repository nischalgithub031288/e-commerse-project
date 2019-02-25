function authorization(req, res, next) {
    const user = req.user
    if (user.role == 'admin') {
        next()
    }
    else {
        res.status(404).send('only administration is acess')
    }
}
module.exports = {
    authorization
}