CREATE DATABASE IF NOT EXISTS MONTANA
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE MONTANA;

DROP TABLE IF EXISTS order_items;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS products;

CREATE TABLE products (
    id          INT            AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(150)   NOT NULL,
    price       DECIMAL(10,2)  NOT NULL,
    image       VARCHAR(200)   NOT NULL,
    stock       INT            DEFAULT 10,
    description VARCHAR(255)
);

INSERT INTO products (name, price, image, stock, description) VALUES
('Montana Black 50ml',                 30.00, 'Montana Black 50ml.jpg',                 10, 'Compact ultra-high pressure spray can'),
('Montana Black 150ml',                40.00, 'Montana Black 150ml.jpg',                10, 'Mid-size ultra-high pressure spray can'),
('Montana Black 400ml',                60.00, 'Montana Black 400ml.jpg',                10, 'Full-size ultra-high pressure spray can'),
('Montana Black 400ml - Infra Colors', 65.00, 'Montana Black 400ml - Infra Colors.jpg', 10, 'UV-reactive infrared color series'),
('Montana Chalk 400ml',                70.00, 'Montana Chalk 400ml.jpg',                10, 'Water-based chalk effect spray'),
('Montana Gold 400ml',                 75.00, 'Montana Gold 400ml.jpg',                 10, 'Premium low-pressure artist spray'),
('Montana Stencil 400ml',              60.00, 'Montana Stencil 400ml.jpg',              10, 'Fast-drying stencil spray'),
('Montana Black 600ml - Extended',     85.00, 'Montana Black 600ml - Extended.jpg',     10, 'Extended capacity high pressure can'),
('Montana ULTRA WIDE 750ml',          100.00, 'Montana ULTRA WIDE 750ml.jpg',           10, 'Maximum volume ultra-wide spray');

CREATE TABLE users (
    id         INT            AUTO_INCREMENT PRIMARY KEY,
    name       VARCHAR(100)   NOT NULL,
    email      VARCHAR(150)   NOT NULL UNIQUE,
    password   VARCHAR(255)   NOT NULL,
    active     VARCHAR(10)    DEFAULT 'enabled',
    ip_address VARCHAR(45),
    created_at DATETIME       DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    id        INT            AUTO_INCREMENT PRIMARY KEY,
    user_id   INT            NOT NULL,
    total     DECIMAL(10,2)  NOT NULL,
    placed_at DATETIME       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE order_items (
    id           INT            AUTO_INCREMENT PRIMARY KEY,
    order_id     INT            NOT NULL,
    product_id   INT            NOT NULL,
    product_name VARCHAR(150)   NOT NULL,
    price        DECIMAL(10,2)  NOT NULL,
    qty          INT            NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);