drop table if exists tasks;
drop table if exists users;

create table users (
  id serial primary key,
  username varchar(50) unique not null,
  created_at timestamp default current_timestamp
);

create table tasks (
  id serial primary key,
  user_id integer references users(id) on delete cascade,
  title text not null,
  description text,
  completed boolean default false,
  created_at timestamp default current_timestamp
);