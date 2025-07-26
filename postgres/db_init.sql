BEGIN;

DROP TABLE IF EXISTS public.tickets_subscribers;
DROP TABLE IF EXISTS public.comments;
DROP TABLE IF EXISTS public.tickets ;
DROP TABLE IF EXISTS public.users;

CREATE TABLE IF NOT EXISTS public.users
(
    id serial NOT NULL,
    name character varying(512) NOT NULL,
    last_name character varying(512) NOT NULL,
    email character varying(512) NOT NULL UNIQUE,
    password character varying(512) NOT NULL,
    role character varying(512) NOT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.tickets
(
    id serial NOT NULL,
    title character varying(512) NOT NULL,
    description text NOT NULL,
    status INT NOT NULL,
    author_id int NOT NULL,
	images text,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
	CONSTRAINT fk_author
		FOREIGN KEY(author_id)
			REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS public.comments
(
    id serial NOT NULL,
    ticket_id serial NOT NULL,
    user_id bigserial NOT NULL,
    text text NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
	CONSTRAINT fk_ticket
		FOREIGN KEY(ticket_id)
			REFERENCES tickets(id),
	CONSTRAINT fk_user
		FOREIGN KEY(user_id)
			REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tickets_subscribers
(
	ticket_id INT NOT NULL,
	agent_id INT NOT NULL,
	PRIMARY KEY (ticket_id, agent_id),
	CONSTRAINT fk_ticket 
		FOREIGN KEY(ticket_id)
			REFERENCES public.tickets(id) ON DELETE CASCADE,
	CONSTRAINT fk_agent 
		FOREIGN KEY(agent_id)
			REFERENCES public.users(id) ON DELETE CASCADE
);

INSERT INTO users(name, last_name, email, password, role) VALUES('admin', 'admin', 'admin@main.com','$2b$15$PrDkdWX7oLuVl2egIU.yu.bUQy4QqbRifyZFtoWREG7q31q2nfrdm', 'admin');

END;