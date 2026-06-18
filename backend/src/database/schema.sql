CREATE DATABASE IF NOT EXISTS pequenos_investidores
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pequenos_investidores;

CREATE TABLE IF NOT EXISTS profiles (
  id INT UNSIGNED NOT NULL AUTO_INCREMENT,
  full_name VARCHAR(120) NOT NULL,
  email VARCHAR(160) NOT NULL,
  password_hash VARCHAR(128) NULL,
  cpf VARCHAR(20) NULL,
  phone VARCHAR(30) NULL,
  address VARCHAR(180) NULL,
  birth_date DATE NULL,
  investor_type ENUM('iniciante', 'intermediario', 'avancado') NOT NULL DEFAULT 'iniciante',
  monthly_income DECIMAL(12, 2) NULL,
  risk_profile ENUM('conservador', 'moderado', 'arrojado') NOT NULL DEFAULT 'conservador',
  investment_goal VARCHAR(255) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY profiles_email_unique (email),
  UNIQUE KEY profiles_cpf_unique (cpf)
);
