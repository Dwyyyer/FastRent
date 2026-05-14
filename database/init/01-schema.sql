CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  category_id INTEGER NOT NULL,
  name VARCHAR(120) NOT NULL,
  price NUMERIC(10,2) DEFAULT 0 NOT NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  CONSTRAINT fk_products_category
    FOREIGN KEY (category_id)
    REFERENCES categories(id)
);

INSERT INTO categories (name, description)
VALUES
('Eletrônicos', 'Produtos eletrônicos em geral'),
('Livros', 'Livros físicos e digitais');

INSERT INTO products (category_id, name, price, stock)
VALUES
(1, 'Mouse USB', 59.90, 10),
(1, 'Teclado Mecânico', 249.90, 5),
(2, 'Algoritmos em Prática', 89.90, 20);