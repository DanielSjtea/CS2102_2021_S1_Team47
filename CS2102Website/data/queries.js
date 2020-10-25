// list of all queries
var sql = {
    signUp: 'INSERT INTO users(username, contact_num, password, name, email) VALUES($1, $2, $3, $4, $5)',

    signIn: 'SELECT * FROM users WHERE username = $1 AND password = $2',

    registerNewCard: `INSERT INTO pet_owner(card_cvc, card_name, card_no) VALUES($1, $2, $3) WHERE username = $4`
}

module.exports = sql;