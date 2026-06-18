const { query } = require('../db');

const profileFields = `
  id,
  full_name AS fullName,
  email,
  cpf,
  phone,
  address,
  birth_date AS birthDate,
  investor_type AS investorType,
  monthly_income AS monthlyIncome,
  risk_profile AS riskProfile,
  investment_goal AS investmentGoal,
  created_at AS createdAt,
  updated_at AS updatedAt
`;

async function findAllProfiles() {
  return query(
    `
      SELECT ${profileFields}
      FROM profiles
      ORDER BY created_at DESC
    `
  );
}

async function findProfileById(id) {
  const rows = await query(
    `
      SELECT ${profileFields}
      FROM profiles
      WHERE id = ?
    `,
    [id]
  );

  return rows[0] || null;
}

async function createProfile(profile) {
  const result = await query(
    `
      INSERT INTO profiles (
        full_name,
        email,
        password_hash,
        cpf,
        phone,
        address,
        birth_date,
        investor_type,
        monthly_income,
        risk_profile,
        investment_goal
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      profile.fullName,
      profile.email,
      profile.passwordHash || null,
      profile.cpf || null,
      profile.phone || null,
      profile.address || null,
      profile.birthDate || null,
      profile.investorType || 'iniciante',
      profile.monthlyIncome || null,
      profile.riskProfile || 'conservador',
      profile.investmentGoal || null,
    ]
  );

  return findProfileById(result.insertId);
}

async function updateProfile(id, profile) {
  await query(
    `
      UPDATE profiles
      SET
        full_name = ?,
        email = ?,
        cpf = ?,
        phone = ?,
        address = ?,
        birth_date = ?,
        investor_type = ?,
        monthly_income = ?,
        risk_profile = ?,
        investment_goal = ?
      WHERE id = ?
    `,
    [
      profile.fullName,
      profile.email,
      profile.cpf || null,
      profile.phone || null,
      profile.address || null,
      profile.birthDate || null,
      profile.investorType || 'iniciante',
      profile.monthlyIncome || null,
      profile.riskProfile || 'conservador',
      profile.investmentGoal || null,
      id,
    ]
  );

  return findProfileById(id);
}

async function deleteProfile(id) {
  const result = await query('DELETE FROM profiles WHERE id = ?', [id]);
  return result.affectedRows > 0;
}

module.exports = {
  findAllProfiles,
  findProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
};
