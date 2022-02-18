const router = require('express').Router();
const getDB = require('../utils/getDB')
const { withAuth, testSession } = require('../utils/auth');

// /add-edit/
//get plant add page 
router.get('/', testSession, withAuth, async (req, res) => {
    res.json({message: 'This will be the plant ADD USER PLANT page.'})
})



module.exports = router;