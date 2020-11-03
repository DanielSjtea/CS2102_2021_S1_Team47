-- for ease of testing purposes
DROP TABLE IF EXISTS bid;
DROP TABLE IF EXISTS does_service;
DROP TABLE IF EXISTS has_availability;
DROP TABLE IF EXISTS specify;
DROP TABLE IF EXISTS has_price_list;
DROP TABLE IF EXISTS pay;
DROP TABLE IF EXISTS specify_trf_pref;
DROP TABLE IF EXISTS owns_pet;
DROP TABLE IF EXISTS pcs_admin;
DROP TABLE IF EXISTS care_taker;
DROP TABLE IF EXISTS pet_owner;
DROP TABLE IF EXISTS users;

-- initialisation of database tables
CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  contact_num CHAR(8) NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE pet_owner (
  username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
  card_cvc VARCHAR(10),
  card_name VARCHAR(255),
  card_no VARCHAR(255),
  card_brand VARCHAR(255),
  area VARCHAR(255)
);

CREATE TABLE care_taker (
  username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
  ctype VARCHAR(255),
  area VARCHAR(255)
);

CREATE TABLE pcs_admin (
  username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE cascade
);

CREATE TABLE owns_pet (
  pet_owner_username VARCHAR(255) REFERENCES pet_owner(username) ON DELETE cascade,
  name VARCHAR(255),
  ptype VARCHAR(255),
  sp_req VARCHAR(255),
  PRIMARY KEY (pet_owner_username, name)
);

CREATE TABLE specify_trf_pref (
  care_taker_username VARCHAR(255) PRIMARY KEY REFERENCES care_taker(username) ON DELETE cascade,
  trf_mthd VARCHAR(255)
);

CREATE TABLE pay (
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  pcs_admin_username VARCHAR(255) REFERENCES pcs_admin(username) ON DELETE cascade,
  bonus NUMERIC,
  date DATE,
  PRIMARY KEY (care_taker_username, pcs_admin_username, date)
);

CREATE TABLE has_price_list (
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  ptype VARCHAR(255),
  price NUMERIC DEFAULT 20,
  PRIMARY KEY (care_taker_username, ptype)
);

CREATE TABLE specify (
  pcs_admin_username VARCHAR(255) REFERENCES pcs_admin(username),
  care_taker_username VARCHAR(255),
  ptype VARCHAR(255),
  price NUMERIC,
  PRIMARY KEY (pcs_admin_username, care_taker_username, ptype),
  FOREIGN KEY (care_taker_username, ptype) REFERENCES has_price_list(care_taker_username, ptype)
);


CREATE TABLE has_availability(
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  s_date DATE,  
  s_time TIME,  
  e_time TIME,  
  PRIMARY KEY(s_date, s_time, e_time, care_taker_username),
  CHECK(s_time < e_time),
  CHECK(s_date >= CURRENT_DATE)
);


CREATE TABLE does_service(
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  svc_type VARCHAR(255),
  PRIMARY KEY(care_taker_username, svc_type)
);

CREATE TABLE bid(
  care_taker_username VARCHAR(255),
  s_date DATE,  
  s_time TIME,  
  e_time TIME, 
  name VARCHAR(255),
  pet_owner_username VARCHAR(255),
  review VARCHAR(255),
  price NUMERIC,
  trf_mthd VARCHAR(255),
  pay_type VARCHAR(255),
  rating NUMERIC,
  successful BOOLEAN,
  svc_type VARCHAR(255),
  PRIMARY KEY (name, pet_owner_username, care_taker_username, s_date, s_time),
  FOREIGN KEY (s_date, s_time, e_time, care_taker_username) REFERENCES has_availability(s_date, s_time, e_time, care_taker_username),
  FOREIGN KEY (pet_owner_username, name) REFERENCES owns_pet(pet_owner_username, name)
);

-- Functions, Procedures
CREATE OR REPLACE PROCEDURE 
insert_caretaker_pricelist(cname VARCHAR(255), ctype VARCHAR(255), area VARCHAR(255), pettype VARCHAR(255)) AS
$$ 
  DECLARE ctx NUMERIC;
  BEGIN
  INSERT INTO care_taker VALUES (cname, ctype, area);
    SELECT COUNT(*) INTO ctx 
    FROM has_price_list P
    WHERE P.care_taker_username = cname;
  IF ctx = 0 THEN
    INSERT INTO has_price_list(care_taker_username, ptype) VALUES (cname, pettype);
  END IF;
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION 
apply_leave(ct_username VARCHAR(255), s_date_req DATE, e_date_req DATE)
RETURNS BOOLEAN AS
$$
  DECLARE ctx NUMERIC, checker NUMERIC;
  BEGIN 
  SELECT S1.worked_dates INTO ctx, S2.checkfree INTO checker
  FROM (
    SELECT COUNT(DISTINCT H.s_date) as worked_dates
    FROM has_availability H
    WHERE H.care_taker_username = ct_username
    AND H.s_date < s_date_req
    AND H.s_date >= (s_date_req - INTERVAL '150 DAY')
  ) S1,
  (
    SELECT COUNT(*) as check_free
    FROM bid B
    WHERE B.care_taker_username = ct_username
    AND B.s_date >= s_date_req
    AND B.s_date <= e_date_req
    AND B.successful = TRUE
  ) S2;
  IF ctx >= 150 AND checker <> 0 THEN
    DELETE FROM has_availability 
    WHERE care_taker_username = ct_username 
    AND s_date >= s_date_req
    AND s_date <= e_date_req
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
  END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION not_admin()
RETURNS TRIGGER AS
$$
  DECLARE ctx NUMERIC;
  BEGIN
  SELECT COUNT(*) INTO ctx FROM pcs_admin P
  WHERE NEW.username = P.username;
  IF ctx > 0 THEN
    RETURN NULL;
  ELSE
    RETURN NEW;
  END IF;
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION specify_update_has_price_list()
RETURNS TRIGGER AS
$$
  BEGIN
  INSERT INTO has_price_list VALUES (NEW.care_taker_username, NEW.ptype, NEW.price) 
  ON CONFLICT(care_taker_username, ptype)
  DO UPDATE price = NEW.price
  WHERE care_taker_username = NEW.care_taker_username
  AND ptype = NEW.ptype
  END;
$$
LANGUAGE plpgsql;

pcs_admin_username VARCHAR(255) REFERENCES pcs_admin(username),
  care_taker_username VARCHAR(255),
  ptype VARCHAR(255),
  price

-- Trigger
CREATE TRIGGER check_pet_owner()
BEFORE INSERT OR UPDATE ON pet_owner
FOR EACH ROW EXECUTE PROCEDURE not_admin();

CREATE TRIGGER check_care_taker()
BEFORE INSERT OR UPDATE ON care_taker
FOR EACH ROW EXECUTE PROCEDURE not_admin();

CREATE TRIGGER specify_update_price_list()
AFTER INSERT OR UPDATE ON specify
FOR EACH ROW EXECUTE PROCEDURE specify_update_has_price_list();