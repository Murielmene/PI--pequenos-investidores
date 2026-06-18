const { Router } = require('express');
const {
  listProfiles,
  getProfile,
  storeProfile,
  replaceProfile,
  removeProfile,
} = require('../controllers/profileController');

const router = Router();

router.get('/', listProfiles);
router.get('/:id', getProfile);
router.post('/', storeProfile);
router.put('/:id', replaceProfile);
router.delete('/:id', removeProfile);

module.exports = router;
