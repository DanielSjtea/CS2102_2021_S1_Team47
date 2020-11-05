// list of all queries
var sql = {

    // User related 
    signIn: 'SELECT * FROM users WHERE username = $1',
    signUp: 'INSERT INTO users(username, contact_num, password, name, email) VALUES($1, $2, $3, $4, $5)',

    editProfile: 'UPDATE users SET contact_num = $2, name = $3, email = $4 WHERE username = $1', //[username, contact_num, name, email]
    edit_password: 'UPDATE users SET password = $2 WHERE username = $1', //[username, password]

    add_caretaker: 'CALL insert_caretaker_pricelist($1, $2, $3, $4)', //[username, ctype, area, pettype] 
    add_owner: 'INSERT INTO pet_owner(username) VALUES ($1)', //[username] 
    add_admin: 'INSERT INTO pcs_admin(username) VALUES ($1)', //[username]
    registerNewCard: 'UPDATE pet_owner SET card_cvc = $1, card_name = $2, card_no = $3, card_brand = $4 WHERE username = $5', //[card_cvc, card_name, card_no, card_brand, username]

    is_caretaker: 'SELECT * FROM care_taker WHERE username = $1', //[username] Check if user is caretaker (returns empty if false)
    is_owner: 'SELECT * FROM pet_owner WHERE username = $1', //[username] Check if user is pet owner (returns empty if false)
    is_admin: 'SELECT * FROM pcs_admin WHERE username = $1', //[username] Check if user is pcs admin (returns empty if false)
    has_service: 'SELECT * FROM does_service WHERE care_taker_username = $1', // [care_taker_username] Check if caretaker services are in the table (returns empty if false)
    has_trf_pref: 'SELECT * FROM specify_trf_pref WHERE care_taker_username = $1', // [care_taker_username] Check if caretaker transfer preferences are in the table (returns empty if false)

    get_all_caretaker: 'SELECT * FROM care_taker NATURAL JOIN users ORDER BY username ASC',
    get_profile: 'SELECT * FROM users WHERE username = $1', //[username] returns [username, contact_num, password, name, email]
    //get_caretaker_profile takes in [username]  and returns [username, contact_num, name, email, ctype, area, svc_type, trf_mthd]
    get_caretaker_profile: 'SELECT U.username as username, U.contact_num as contact_num, U.name as name, U.email as email, C.ctype as ctype, C.area as area, S.svc_type as svc_type, T.trf_mthd as trf_mthd FROM users U, care_taker C, does_service S, specify_trf_pref T WHERE U.username = $1 AND C.username = U.username AND S.care_taker_username = U.username AND T.care_taker_username = U.username',
    get_caretaker_profile_limit_one: 'SELECT U.username as username, U.contact_num as contact_num, U.name as name, U.email as email, C.ctype as ctype, C.area as area, S.svc_type as svc_type, T.trf_mthd as trf_mthd FROM users U, care_taker C, does_service S, specify_trf_pref T WHERE U.username = $1 AND C.username = U.username AND S.care_taker_username = U.username AND T.care_taker_username = U.username LIMIT 1',
    upsert_trf_pref: 'INSERT INTO specify_trf_pref(care_taker_username, trf_mthd) VALUES ($1, $2) ON CONFLICT (care_taker_username) DO UPDATE SET trf_mthd = $2', //[username, trf_mthd] Upsert will auto-update if username exists
    upsert_caretaker_type: 'INSERT INTO care_taker(username, ctype, area) VALUES($1, $2, $3) ON CONFLICT (username) DO UPDATE SET ctype = $2',

    // service related
    add_caretaker_service: 'INSERT INTO does_service(care_taker_username, svc_type) VALUES($1, $2)', // [care_taker_username, svc_type]
    get_caretaker_service: 'SELECT * FROM does_service WHERE care_taker_username = $1 AND svc_type = $2', // [care_taker_username, svc_type]
    delete_caretaker_service: 'DELETE FROM does_service WHERE care_taker_username = $1', // [care_taker_username]
    get_ct_pet_types: 'SELECT ptype FROM has_price_list WHERE care_taker_username = $1', // [care_taker_username]
    get_ct_price_list: 'SELECT * FROM has_price_list WHERE care_taker_username = $1',
    add_caretaker_ptype: 'INSERT INTO has_price_list(care_taker_username, ptype) VALUES ($1, $2)', //[care_taker_username, ptype]
    get_caretaker_pricelist: 'SELECT ptype, price FROM has_price_list WHERE care_taker_username = $1 ORDER BY price ASC', //[care_taker_username]
    delete_caretaker_ptype: 'DELETE FROM has_price_list WHERE care_taker_username = $1', //[care_taker_username]

    // Pet related
    add_pet: 'INSERT INTO owns_pet(pet_owner_username, name, ptype, sp_req) VALUES ($1, $2, $3, $4)', //[pet_owner_username, name, ptype, sp_req] ptype, sp_req defaults are -1
    update_pet: 'UPDATE owns_pet SET ptype = $3, sp_req = $4 WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name, ptype, sp_req]
    delete_pet: 'DELETE FROM owns_pet WHERE pet_owner_username = $1 AND name = $2', //[pet_owner_username, name]
    get_all_owned_pets: 'SELECT * FROM owns_pet WHERE pet_owner_username = $1', //[pet_owner_username]
    get_pet_type: 'SELECT ptype FROM owns_pet WHERE pet_owner_username = $1 AND name = $2',

    //Availability related
    add_availability: 'INSERT INTO has_availability(care_taker_username, s_date, s_time, e_time) VALUES ($1, $2, $3, $4)', //[username, s_date, s_time, e_time]
    delete_availability: 'DELETE FROM has_availability WHERE care_taker_username = $1 AND s_date::date = date $2', //[username, s_date] in datetime format (?)
    delete_specific_availability: 'DELETE FROM has_availability WHERE care_taker_username = $1 AND s_date::date = date $2 AND s_time <= time $3 AND e_time >= time $4', //[username, s_date, s_time, e_time] s_time & e_time in TIME format: HH:MM:SS
    get_self_availability: 'SELECT * FROM has_availability WHERE care_taker_username = $1 AND s_date >= CURRENT_DATE ORDER BY s_date ASC', //[s_date] in datetime format (?), returns all available caretakers for that day

    apply_leave: 'SELECT apply_leave($1, $2, $3)', //[care_taker_username, s_date, e_date] returns TRUE if can take leave/FALSE if cannot

    // searchSitter queries (if caretakers have no bids for him/her)
    find_service_date_nobids: 'SELECT HAvail.care_taker_username as care_taker_username, HAvail.s_date as s_date,' +
        'HAvail.s_time as s_time, HAvail.e_time as e_time ' +
        'FROM has_availability HAvail ' +
        'WHERE HAvail.s_date >= $1 AND HAvail.s_date <= $2 AND HAvail.care_taker_username <> $4' +
        'AND EXISTS (' +
        'SELECT 1 ' +
        'FROM does_service S ' +
        'WHERE S.care_taker_username = HAvail.care_taker_username AND S.svc_type = $3' +
        ') AND NOT EXISTS (' +
        'SELECT 1 ' +
        'FROM bid B ' +
        'WHERE B.s_date = HAvail.s_date AND B.care_taker_username = HAvail.care_taker_username AND B.successful = TRUE ' +
        ') ORDER BY HAvail.s_date ASC, HAvail.s_time ASC;',  // [beginning_date, end_date, svc_type, pet_owner_username]
    find_ct_service_date: 'SELECT * FROM (SELECT HAvail.care_taker_username as care_taker_username, HAvail.s_date as s_date,' +
        'HAvail.s_time as s_time, HAvail.e_time as e_time ' +
        'FROM has_availability HAvail ' +
        'WHERE HAvail.s_date >= $1 AND HAvail.s_date <= $2 AND HAvail.care_taker_username <> $4' +
        'AND EXISTS (' +
        'SELECT 1 ' +
        'FROM does_service S ' +
        'WHERE S.care_taker_username = HAvail.care_taker_username AND S.svc_type = $3' +
        ') AND NOT EXISTS (' +
        'SELECT 1 ' +
        'FROM bid B ' +
        'WHERE B.s_date = HAvail.s_date AND B.care_taker_username = HAvail.care_taker_username AND B.successful = TRUE ' +
        ') ORDER BY HAvail.s_date ASC, HAvail.s_time ASC) AS all_service_date ' +
        'WHERE care_taker_username = $5', // [beginning_date, end_date, svc_type, pet_owner_username, care_taker_username]

    //PCS statistics
    get_total_salary_month:
        "SELECT F.price" +
        "FROM " +
        "(SELECT P.ct_username as ct_username," +
        "CASE " +
        "WHEN P.pet_days <= 60 THEN P.pet_days * 50" +
        "WHEN P.pet_days > 60 THEN 3000 + P2.bonus * 0.8" +
        "END as pay" +
        "FROM (" +
        "SELECT COUNT(*) as pet_days, C.username as ct_username" +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username" +
        "WHERE C.ctype = 'Full Time'" +
        "AND B.successful = TRUE" +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $1)" +
        "GROUP BY C.username" +
        ") P," +
        "(" +
        "SELECT SUM(B2.price) as bonus, C2.username as ct_username" +
        "FROM bid B2 JOIN care_taker C2 ON B2.care_taker_username = C2.username" +
        "WHERE C2.ctype = 'Full Time'" +
        "AND B2.successful = TRUE" +
        "AND date_trunc('month', B2.s_date) = date_trunc('month', $1)" +
        "GROUP BY C2.username" +
        "ORDER BY B2.s_date ASC" +
        "OFFSET 61 ROWS" +
        ") P2" +
        "WHERE P.ct_username = P2.ct_username" +
        "UNION " +
        "SELECT C.username as ct_username, SUM(B.price) * 0.75 as pay" +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username" +
        "WHERE C.ctype = 'Part Time'" +
        "AND B.successful = TRUE" +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $1)" +
        "GROUP BY C.username) F",//[month_datetime]
    get_all_caretaker_salary:
        "SELECT P.ct_username as ct_username," +
        "CASE " +
        "WHEN P.pet_days <= 60 THEN P.pet_days * 50" +
        "WHEN P.pet_days > 60 THEN 3000 + P2.bonus * 0.8" +
        "END as pay" +
        "FROM (" +
        "SELECT COUNT(*) as pet_days, C.username as ct_username" +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username" +
        "WHERE C.ctype = 'Full Time'" +
        "AND B.successful = TRUE" +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $1)" +
        "GROUP BY C.username" +
        ") P," +
        "(" +
        "SELECT SUM(B2.price) as bonus, C2.username as ct_username" +
        "FROM bid B2 JOIN care_taker C2 ON B2.care_taker_username = C2.username" +
        "WHERE C2.ctype = 'Full Time'" +
        "AND B2.successful = TRUE" +
        "AND date_trunc('month', B2.s_date) = date_trunc('month', $1)" +
        "GROUP BY C2.username" +
        "ORDER BY B2.s_date ASC" +
        "OFFSET 61 ROWS" +
        ") P2" +
        "WHERE P.ct_username = P2.ct_username" +
        "UNION " +
        "SELECT C.username as ct_username, SUM(B.price) * 0.75 as pay" +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username" +
        "WHERE C.ctype = 'Part Time'" +
        "AND B.successful = TRUE" +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $1)" +
        "GROUP BY C.username", //[month_datetime]
    get_total_pet_cared_month: 'SELECT COUNT(*) FROM bid WHERE successful = TRUE AND EXTRACT(MONTH FROM s_date) = $1', //[month] in numeric, where 1 = January

    //Caretaker statistics
    get_fulltime_self_salary_month:
        "SELECT " +
        "CASE " +
        "WHEN P.pet_days <= 60 THEN P.pet_days * 50 " +
        "WHEN P.pet_days > 60 THEN 3000 + P2.bonus * 0.8 " +
        "END as pay " +
        "FROM (" +
        "SELECT COUNT(*) as pet_days, C.username as ct_username " +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username " +
        "WHERE C.ctype = 'Full Time' " +
        "AND B.successful = TRUE " +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $2::timestamp) " +
        "AND C.username = $1 " +
        "GROUP BY C.username " +
        ") P," +
        "(" +
        "SELECT SUM(B2.price) as bonus, C2.username as ct_username " +
        "FROM bid B2 JOIN care_taker C2 ON B2.care_taker_username = C2.username " +
        "WHERE C2.ctype = 'Full Time' " +
        "AND B2.successful = TRUE " +
        "AND date_trunc('month', B2.s_date) = date_trunc('month', $2::timestamp) " +
        "AND C2.username = $1 " +
        "GROUP BY C2.username, B2.s_date " +
        "ORDER BY B2.s_date ASC " +
        "OFFSET 61 ROWS " +
        ") P2", //[care_taker_username, date] // date in YYYY-MM-DD
    get_parttime_self_salary_month:
        "SELECT SUM(B.price) * 0.75 as pay " +
        "FROM bid B JOIN care_taker C ON B.care_taker_username = C.username " +
        "WHERE C.ctype = 'Part Time' " +
        "AND B.successful = TRUE " +
        "AND date_trunc('month', B.s_date) = date_trunc('month', $2::timestamp) " +
        "AND C.username = $1 " +
        "GROUP BY C.username", //[care_taker_username, date] // date in YYYY-MM-DD
    get_petdays_month: '',
    get_past_work: 'SELECT s_date, s_time, e_time, name, pet_owner_username, review, price, rating, svc_type FROM bid WHERE care_taker_username = $1 AND successful = TRUE AND s_date < CURRENT_DATE ORDER BY s_date DESC',//[care_taker_username]
    get_work_schedule: 'SELECT * FROM bid WHERE care_taker_username = $1 AND successful = TRUE AND s_date >= CURRENT_DATE ORDER BY s_date ASC', //[care_taker_username]

    //Pet Owner statistics
    get_past_orders: 'SELECT care_taker_username, s_date, s_time, e_time, name, review, price, rating, svc_type FROM bid WHERE pet_owner_username = $1 AND successful = TRUE AND s_date < CURRENT_DATE ORDER BY s_date DESC', // [pet_owner_username]
    get_caretaker_nearby_area: 'SELECT * FROM care_taker WHERE area = $1', // [area]

    //Bids related
    get_ct_bids: 'SELECT * FROM bid WHERE care_taker_username = $1', // [care_taker_username] check if care taker have any bids
    make_bid: 'INSERT INTO bid (care_taker_username, s_date, s_time, e_time, name, pet_owner_username, review, price, trf_mthd, pay_type, rating, successful, svc_type) VALUES ($1, $2, $3, $4, $5, $6, NULL, $7, $8, $9, NULL, NULL, $10)', //[care_taker_username, s_date, s_time, e_time, name, pet_owner_name, price, trf_mthd, pay_type, svc_type]
    bids_pending_acceptance_as_petowner: 'SELECT care_taker_username, s_date, s_time, e_time, name, price, trf_mthd, pay_type, successful, svc_type FROM bid WHERE pet_owner_username = $1', //[pet_owner_username]
    successful_bids_made_as_petowner: 'SELECT care_taker_username, s_date, s_time, e_time, name, review, price, trf_mthd, pay_type, rating, svc_type FROM bid WHERE pet_owner_username = $1 AND successful = TRUE', //[pet_owner_username]
    get_current_bids_as_caretaker: 'SELECT s_date, s_time, e_time, name, pet_owner_username, price, trf_mthd, pay_type, svc_type FROM bid WHERE care_taker_username = $1 AND s_date > CURRENT_DATE ORDER BY s_date, s_time, price DESC', //[care_taker_username]


    //Reviews related
    view_caretaker_review: 'SELECT pet_owner_username, s_date, review, rating FROM bid WHERE care_taker_username = $1 AND review IS NOT NULL AND successful = TRUE ORDER BY s_date DESC', // [care_taker_username]
    get_avg_rating_caretaker: 'SELECT AVG(rating)::NUMERIC(10,1) FROM bid WHERE care_taker_username = $1', //[care_taker_username]
    add_review: 'UPDATE bid SET review = $1, rating = $2 WHERE pet_owner_username=$3 AND name=$4 AND care_taker_username=$5 AND s_date::date=date $6 AND s_time= time $7', //[review, rating, pet_owner_username, pet_name, care_taker_username, s_date, s_time]

}

module.exports = sql;