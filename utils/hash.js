const bcrypt = require('bcrypt');
const config = require('../config/config.js');

const getHash = async (password) => {
    const salt = await bcrypt.genSalt(parseInt(config.hashSettings.saltRounds));
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const compare = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
}

module.exports = {
    getHash,
    compare
}