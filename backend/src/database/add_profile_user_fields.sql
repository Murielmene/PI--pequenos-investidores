USE pequenos_investidores;

ALTER TABLE profiles
  ADD COLUMN password_hash VARCHAR(128) NULL AFTER email,
  ADD COLUMN cpf VARCHAR(20) NULL AFTER password_hash,
  ADD COLUMN address VARCHAR(180) NULL AFTER phone,
  ADD UNIQUE KEY profiles_cpf_unique (cpf);
