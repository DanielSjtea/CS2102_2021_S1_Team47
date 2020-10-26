// list of all queries
var sql = {

    // User related
    signIn: 'SELECT * FROM users WHERE username = $1 AND password = $2',
    signUp: 'INSERT INTO users(username, contact_num, password, name, email) VALUES($1, $2, $3, $4, $5)',

    edit_profile: 'UPDATE users SET contact_num = $2, name = $3, email = $4 WHERE username = $1', //[username, contact_num, name, email]
    edit_password: 'UPDATE users SET password = $2 WHERE username = $1', //[username, password]

    add_sitter: 'INSERT INTO care_taker(username, ctype, area) VALUES ($1, $2, $3)', //[username, ctype, area] ctype, area defaults are -1
    add_owner: 'INSERT INTO pet_owner(username, area) VALUES ($1, $2)', //[username, area] area defaults are -1
    add_admin: 'INSERT INTO pcs_admin(username) VALUES ($1)', //[username]
    registerNewCard: 'UPDATE pet_owner SET card_cvc = $1, card_name = $2, card_no = $3 WHERE username = $4', //[card_cvc, card_name, card_no, username]

    is_sitter: 'SELECT * FROM care_taker WHERE username = $1', //[username] Check if user is caretaker (returns empty if false)
    is_owner: 'SELECT * FROM pet_owner WHERE username = $1', //[username] Check if user is pet owner (returns empty if false)
    is_admin: 'SELECT * FROM pcs_admin WHERE username = $1', //[username] Check if user is pcs admin (returns empty if false)

    get_profile: 'SELECT * FROM users WHERE username = $1', //[username] returns [username, contact_num, password, name, email]

    // Pet related
    add_pet: 'INSERT INTO owns_pet(pet_owner_username, name, ptype, sp_req) VALUES ($1, $2, $3, $4)', //[pet_owner_username, name, ptype, sp_req] ptype, sp_req defaults are -1
    update_pet: 'UPDATE owns_pet SET ptype = $3, sp_req = $4 WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name, ptype, sp_req]
    delete_pet: 'DELETE FROM owns_pet WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name]
    get_all_owned_pets: 'SELECT * FROM owns_pet WHERE pet_owner_username = $1', //[pet_owner_username]

    //Availability related
    add_availability: 'INSERT INTO has_availability(care_taker_username, s_date, s_time, e_time) VALUES ($1, $2, $3, $4)', //[username, s_date, s_time, e_time]
    //Currently delete_availability deletes ALL availability for date
    delete_availability: 'DELETE FROM has_availability WHERE care_taker_username = $1 AND s_date = $2', //[username, s_date] in datetime format (?)
    get_availability_sitter: 'SELECT s_date, s_time, e_time FROM has_availability WHERE care_taker_username = $1', //[care_taker_username] returns all availability of specific caretaker
    get_availability_date: 'SELECT * FROM has_availability WHERE s_date = $1', //[s_date] in datetime format (?), returns all available caretakers for that day

    //Bids related

    //Reviews related 

}

module.exports = sql;