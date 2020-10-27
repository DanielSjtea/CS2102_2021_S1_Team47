// list of all queries
var sql = {

    // User related
    signIn: 'SELECT * FROM users WHERE username = $1',
    signUp: 'INSERT INTO users(username, contact_num, password, name, email) VALUES($1, $2, $3, $4, $5)',

    edit_profile: 'UPDATE users SET contact_num = $2, name = $3, email = $4 WHERE username = $1', //[username, contact_num, name, email]
    edit_password: 'UPDATE users SET password = $2 WHERE username = $1', //[username, password]

    add_caretaker: 'INSERT INTO care_taker(username, ctype, area) VALUES ($1, $2, $3)', //[username, ctype, area] ctype, area defaults are -1
    add_owner: 'INSERT INTO pet_owner(username, area) VALUES ($1, $2)', //[username, area] area defaults are -1
    add_admin: 'INSERT INTO pcs_admin(username) VALUES ($1)', //[username]
    registerNewCard: 'UPDATE pet_owner SET card_cvc = $1, card_name = $2, card_no = $3 WHERE username = $4', //[card_cvc, card_name, card_no, username]

    is_caretaker: 'SELECT * FROM care_taker WHERE username = $1', //[username] Check if user is caretaker (returns empty if false)
    is_owner: 'SELECT * FROM pet_owner WHERE username = $1', //[username] Check if user is pet owner (returns empty if false)
    is_admin: 'SELECT * FROM pcs_admin WHERE username = $1', //[username] Check if user is pcs admin (returns empty if false)

    get_profile: 'SELECT * FROM users WHERE username = $1', //[username] returns [username, contact_num, password, name, email]
    //get_caretaker_profile takes in [username]  and returns [username, contact_num, name, email, ctype, area, svc_type, trf_mthd]
    get_caretaker_profile: 'SELECT U.username as username, U.contact_num as contact_num, U.name as name, U.email as email, C.ctype as ctype, C.area as area, S.svc_type as svc_type, T.trf_mthd as trf_mthd FROM users U, care_taker C, does_service S, specify_trf_pref T WHERE U.username = $1 AND C.username = U.username AND S.care_taker_username = U.username AND T.care_taker_username = U.username',
    upsert_trf_pref: 'INSERT INTO specify_trf_pref(care_taker_username, trf_mthd) VALUES ($1, $2) ON CONFLICT ON CONSTRAINT care_taker_username DO UPDATE SET trf_mthd = $2', //[username, trf_mthd] Upsert will auto-update if username exists

    // Pet related
    add_pet: 'INSERT INTO owns_pet(pet_owner_username, name, ptype, sp_req) VALUES ($1, $2, $3, $4)', //[pet_owner_username, name, ptype, sp_req] ptype, sp_req defaults are -1
    update_pet: 'UPDATE owns_pet SET ptype = $3, sp_req = $4 WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name, ptype, sp_req]
    delete_pet: 'DELETE FROM owns_pet WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name]
    get_all_owned_pets: 'SELECT * FROM owns_pet WHERE pet_owner_username = $1', //[pet_owner_username]

    //Availability related
    add_availability: 'INSERT INTO has_availability(care_taker_username, s_date, s_time, e_time) VALUES ($1, $2, $3, $4)', //[username, s_date, s_time, e_time]
    delete_availability: 'DELETE FROM has_availability WHERE care_taker_username = $1 AND s_date::date = date $2', //[username, s_date] in datetime format (?)
    delete_specific_availability: 'DELETE FROM has_availability WHERE care_taker_username = $1 AND s_date::date = date $2 AND s_time <= time $3 AND e_time >= time $4', //[username, s_date, s_time, e_time] s_time & e_time in TIME format: HH:MM:SS
    get_availability_sitter: 'SELECT s_date, s_time, e_time FROM has_availability WHERE care_taker_username = $1', //[care_taker_username] returns all availability of specific caretaker
    get_availability_date: 'SELECT * FROM has_availability WHERE s_date::date = date $1', //[s_date] in datetime format (?), returns all available caretakers for that day

    //Reviews related
    view_caretaker_review: 'SELECT s_date, review, rating FROM bid WHERE care_taker_username = $1 AND review IS NOT NULL AND successful = TRUE ORDER BY s_date DESC',
    get_avg_rating_caretaker: 'CALL avg_rating($1)', //[care_taker_username]
    add_review: 'UPDATE bid SET review = $1, rating = $2 WHERE pet_owner_username=$3 AND name=$4 AND care_taker_username=$5 AND s_date::date=date $6 AND s_time= time $7', //[review, rating, pet_owner_username, pet_name, care_taker_username, s_date, s_time]

    //PCS statistics
    get_total_salary_month: '',
    get_total_pet_care: '',

    //Caretaker statistics
    get_self_salary: '',
    get_parttime_salary: '',
    get_petdays_month: '',
    get_past_work: '',
    get_work_schedule: '',

    //Bids related

}

module.exports = sql;