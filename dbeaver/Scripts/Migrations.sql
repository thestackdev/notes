create extension if not exists pgcrypto;

create schema if not exists "auth";

create table if not exists "auth".users(
	"id" uuid primary key default gen_random_uuid(),
	"username" text unique not null check (username ~ '^[a-zA-Z0-9_]{3,20}$'),
	"display_name" text not null,
	"email" text unique not null check (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
	"password" text not null,
	"created_at" timestamp with time zone not null default now(),
	"updated_at" timestamp with time zone not null default now()
)

create or replace function users_updated_at()
  returns trigger as $$
  begin
    new.updated_at = current_timestamp;
    return new;
  end;
$$ language plpgsql;

create trigger users_update_trigger
  before
update
	on
	"auth".users
  for each row
  execute function users_updated_at();


drop table "auth".users;

insert into auth.users
	(email, password)
values 
	('shanmukeshwar03@gmail.com', crypt('johnspassword', gen_salt('bf')));

--select
--	id,
--	email
--from auth.users
--where email = 'shanmukeshwar03@gmail.com' and password = crypt('johnspassword', password)
--limit 1;

select * from auth.users;


create schema if not exists notes;

create table if not exists "notes".collections (
	"id" uuid primary key default gen_random_uuid(),
	"label" text not null check (length(label) > 3),
	"user_id" uuid not null foreign ("user_id") key references "auth".users (id) on delete cascade,
	"created_at" timestamp with time zone not null default now(),
	"updated_at" timestamp with time zone not null default now()
)

alter table "notes".collections
add column user_id uuid,
add constraint fkey_collections_users
    foreign key (user_id)
    references "auth".users (id);


select * from "notes".collections


drop table "notes".collections;























