CREATE TABLE IF NOT EXISTS scopes (
  scope_id       SERIAL,
  name           VARCHAR(50) NOT NULL,
  description    VARCHAR(255) NOT NULL,
  PRIMARY KEY(scope_id)
);

CREATE TABLE IF NOT EXISTS user_type (
  user_type_id   SERIAL,
  name           VARCHAR(20) NOT NULL,
  PRIMARY KEY(user_type_id)
);

CREATE TABLE IF NOT EXISTS user_type_scopes (
  id             SERIAL,
  user_type_id   INT NOT NULL,
  scope_id       INT NOT NULL,
  PRIMARY KEY(id),
  CONSTRAINT fk_user_type
    FOREIGN KEY(user_type_id)
      REFERENCES user_type(user_type_id),
  CONSTRAINT fk_scope
    FOREIGN KEY(scope_id)
      REFERENCES scopes(scope_id)
);

CREATE TABLE IF NOT EXISTS users (
  user_id          uuid DEFAULT gen_random_uuid(),
  email            VARCHAR(40) NOT NULL,
  profile_picture  VARCHAR(200) NOT NULL,
  refresh_token    VARCHAR(50) NOT NULL,
  creation_date    timestamp NOT NULL,
  user_type_id     INT NOT NULL,
	UNIQUE (email),
  PRIMARY KEY(user_id),
  CONSTRAINT fk_user_type
    FOREIGN KEY(user_type_id)
      REFERENCES user_type(user_type_id)
);

CREATE TABLE IF NOT EXISTS channel (
  channel_id      uuid DEFAULT gen_random_uuid(),
  user_id         uuid NOT NULL,
  provider_id     VARCHAR(30) NOT NULL,
  name            VARCHAR(100),
  profile_picture VARCHAR(255),
  access_token    VARCHAR(255),
  refresh_token   VARCHAR(255),
  UNIQUE(channel_id),
  PRIMARY KEY(channel_id),
  CONSTRAINT fk_user_id
    FOREIGN KEY(user_id)
      REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS bot (
  bot_id          SERIAL,
  name            VARCHAR(50),
  PRIMARY KEY(bot_id)
);

CREATE TABLE IF NOT EXISTS reward (
  reward_id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  channel_id uuid NOT NULL,
  PRIMARY KEY(reward_id),
  CONSTRAINT fk_channel_id
    FOREIGN KEY(channel_id)
      REFERENCES channel(channel_id)
);

CREATE TABLE IF NOT EXISTS command_flow (

);

CREATE TABLE IF NOT EXISTS command_response (

);

CREATE TABLE IF NOT EXISTS command_flow_type (
  
);