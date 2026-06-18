const crypto = require('crypto');
const {
  findAllProfiles,
  findProfileById,
  createProfile,
  updateProfile,
  deleteProfile,
} = require('../models/profileModel');

const allowedInvestorTypes = ['iniciante', 'intermediario', 'avancado'];
const allowedRiskProfiles = ['conservador', 'moderado', 'arrojado'];

function validateProfile(payload) {
  const errors = [];

  if (!payload.fullName || payload.fullName.trim().length < 3) {
    errors.push('fullName must have at least 3 characters');
  }

  if (!payload.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) {
    errors.push('email must be valid');
  }

  if (payload.investorType && !allowedInvestorTypes.includes(payload.investorType)) {
    errors.push(`investorType must be one of: ${allowedInvestorTypes.join(', ')}`);
  }

  if (payload.riskProfile && !allowedRiskProfiles.includes(payload.riskProfile)) {
    errors.push(`riskProfile must be one of: ${allowedRiskProfiles.join(', ')}`);
  }

  if (payload.monthlyIncome !== undefined && payload.monthlyIncome !== null && Number(payload.monthlyIncome) < 0) {
    errors.push('monthlyIncome must be zero or greater');
  }

  return errors;
}

function hashPassword(password) {
  if (!password) {
    return null;
  }

  return crypto.createHash('sha256').update(password).digest('hex');
}

function normalizeProfilePayload(payload, currentProfile = {}) {
  return {
    fullName: payload.fullName?.trim(),
    email: payload.email?.trim().toLowerCase(),
    passwordHash: payload.password ? hashPassword(payload.password) : currentProfile.passwordHash,
    cpf: payload.cpf?.trim(),
    phone: payload.phone?.trim(),
    address: payload.address?.trim(),
    birthDate: payload.birthDate || null,
    investorType: payload.investorType,
    monthlyIncome: payload.monthlyIncome === undefined || payload.monthlyIncome === null ? null : Number(payload.monthlyIncome),
    riskProfile: payload.riskProfile,
    investmentGoal: payload.investmentGoal?.trim(),
  };
}

async function listProfiles(_req, res, next) {
  try {
    const profiles = await findAllProfiles();
    res.json(profiles);
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const profile = await findProfileById(req.params.id);

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.json(profile);
  } catch (error) {
    return next(error);
  }
}

async function storeProfile(req, res, next) {
  try {
    const payload = normalizeProfilePayload(req.body);
    const errors = validateProfile(payload);

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const profile = await createProfile(payload);
    return res.status(201).json(profile);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email or CPF already registered' });
    }

    return next(error);
  }
}

async function replaceProfile(req, res, next) {
  try {
    const existingProfile = await findProfileById(req.params.id);

    if (!existingProfile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    const payload = normalizeProfilePayload(req.body, existingProfile);
    const errors = validateProfile(payload);

    if (errors.length > 0) {
      return res.status(400).json({ message: 'Validation failed', errors });
    }

    const profile = await updateProfile(req.params.id, payload);
    return res.json(profile);
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ message: 'Email or CPF already registered' });
    }

    return next(error);
  }
}

async function removeProfile(req, res, next) {
  try {
    const wasDeleted = await deleteProfile(req.params.id);

    if (!wasDeleted) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  listProfiles,
  getProfile,
  storeProfile,
  replaceProfile,
  removeProfile,
};
