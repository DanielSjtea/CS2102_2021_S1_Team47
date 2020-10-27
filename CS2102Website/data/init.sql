CREATE TABLE users (
  username VARCHAR(255) PRIMARY KEY,
  contact_num CHAR(8),
  password VARCHAR(255),
  name VARCHAR(255),
  email VARCHAR(255)
);

CREATE TABLE pet_owner (
  username VARCHAR(255) PRIMARY KEY REFERENCES users(username) ON DELETE cascade,
  card_cvc VARCHAR(10),
  card_name VARCHAR(255),
  card_no VARCHAR(255),
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
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
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
  price NUMERIC,
  PRIMARY KEY (care_taker_username, ptype)
);

CREATE TABLE specify (
  pcs_admin_username VARCHAR(255) REFERENCES pcs_admin(username),
  care_taker_username VARCHAR(255),
  ptype VARCHAR(255),
  price NUMERIC,
  PRIMARY KEY (pcs_admin_username, care_taker_username, ptype, price),
  FOREIGN KEY (care_taker_username, ptype, price) REFERENCES has_price_list(care_taker_username, ptype, price)
);


CREATE TABLE has_availability(
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  s_date DATE,  
  s_time TIME,  
  e_time TIME,  
  PRIMARY KEY(s_date, s_time, e_time, care_taker_username),
  CHECK(s_time < e_time)
);


CREATE TABLE does_service(
  care_taker_username VARCHAR(255) REFERENCES care_taker(username) ON DELETE cascade,
  svc_type VARCHAR(255),
  PRIMARY KEY(care_taker_username)
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
  PRIMARY KEY (name, pet_owner_username),
  FOREIGN KEY (s_date, s_time, e_time, care_taker_username) REFERENCES has_availability(s_date, s_time, e_time, care_taker_username),
  FOREIGN KEY (pet_owner_username, name) REFERENCES owns_pet(pet_owner_username, name)
);

-- Functions, Procedures
CREATE OR REPLACE FUNCTION
avg_rating(ctusername VARCHAR(255))
RETURNS NUMERIC AS
$$ 
  BEGIN 
  SELECT AVG(rating)::NUMERIC(10,1)
  FROM bid
  WHERE care_taker_username = ctusername
  END;
$$
LANGUAGE plpgsql;

CREATE OR REPLACE PROCEDURE 
insert_caretaker_pricelist(cname VARCHAR(255), ctype VARCHAR(255), area VARCHAR(255), pettype VARCHAR(255)) AS
$$ 
  DECLARE ctx NUMERIC
  BEGIN
    SELECT COUNT(*) INTO ctx 
    FROM has_price_list P
    WHERE P.care_taker_username = cname;
  IF ctx = 0 THEN
    INSERT INTO has_price_list(care_taker_username, ptype) VALUES (cname, pettype);
  END IF;
  INSERT INTO care_taker VALUES (cname, ctype, area);
  END; $$
LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION not_admin()
RETURNS TRIGGER AS
$$
  DECLARE ctx NUMERIC
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

-- TODO
CREATE OR REPLACE FUNCTION
self_salary_month(ctusername VARCHAR(255), )
RETURNS NUMERIC AS
$$ 
  BEGIN 
  END;
$$
LANGUAGE plpgsql;

-- Trigger
CREATE TRIGGER check_pet_owner()
BEFORE INSERT OR UPDATE ON pet_owner
FOR EACH ROW EXECUTE PROCEDURE not_admin();

CREATE TRIGGER check_care_taker()
BEFORE INSERT OR UPDATE ON care_taker
FOR EACH ROW EXECUTE PROCEDURE not_admin();
