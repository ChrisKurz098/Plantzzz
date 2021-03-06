const router = require('express').Router();
const { Users, UserPlants, Plants } = require('../../models');
const { withAuth } = require('../../utils/auth') //this is middleware to check if user is loggin
//GET requests for api/userPlants/users

//GET all user plants
router.get('/', (req, res) => {
    UserPlants.findAll({
        include: [
            {
               model: Plants,
               attributes: ['common_name']
            },
            {
                model: Users,
                attributes: ['username']
             }
         ]
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//GET a single user plant by id
router.get('/:id', (req, res) => {
    UserPlants.findOne({
        where: {
            id: req.params.id
        },
        include: [
            {
               model: Plants,
               attributes: ['common_name']
            },
            {
                model: Users,
                attributes: ['username']
             }
         ]
    }).then(dbUserPlantData => {
        if (!dbUserPlantData) {
            res.status(404).json({ message: 'User plant not found under that id' });
        }
        res.json(dbUserPlantData)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json;
        })
});

//GET a single user plant by nickname
router.get('/nickname/:name', (req, res) => {
    const formattedName = req.params.name.replace(/-/g,' ');
    UserPlants.findOne({
        where: {
            nickname: formattedName
        },
        include: [
            {
               model: Plants,
               attributes: ['common_name']
            },
            {
                model: Users,
                attributes: ['username']
             }
         ]
    }).then(dbUserPlantData => {
        if (!dbUserPlantData) {
            res.status(404).json({ message: 'User plant not found under that nickname' });
        }
        res.json(dbUserPlantData)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json;
        })
});

//GET all user plants by user_id
router.get('/user/:id', (req, res) => {
    UserPlants.findAll({
        where: {
            user_id: req.params.id
        },
        include: [
            {
               model: Plants,
               attributes: ['common_name']
            },
            {
                model: Users,
                attributes: ['username']
             }
         ]
    }).then(dbUserPlantData => {
        if (!dbUserPlantData) {
            res.status(404).json({ message: 'User plants not found under that user_id' });
        }
        res.json(dbUserPlantData)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json;
        })
});

//GET all session user plants
router.get('/session',withAuth, (req, res) => {
    UserPlants.findAll({
        where: {
            user_id: req.session.user_id
        },
        include: [
            {
               model: Plants,
               attributes: ['common_name']
            },
            {
                model: Users,
                attributes: ['username']
             }
         ]
    }).then(dbUserPlantData => {
        if (!dbUserPlantData) {
            res.status(404).json({ message: 'User plants not found under that user_id' });
        }
        res.json(dbUserPlantData)
    })
        .catch(err => {
            console.log(err);
            res.status(500).json;
        })
});


//POST new user plant api/userPlants
router.post('/', withAuth, (req, res) => {
    //does not expect users ID. Must be logged in so it grabs the user ID from the session
    UserPlants.create({
        user_id: req.session.user_id,
        plant_id: req.body.plant_id,
        nickname: req.body.nickname,
        initial_water_date: req.body.initial_water_date,
        watering_interval: req.body.watering_interval
    })
        .then(dbUserPlantData => res.json(dbUserPlantData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
})

//PUT update user plant by id
router.put('/:id',withAuth , (req, res) => {
//find plants with ID that also has the user_id of the logged in user
console.log('-------------',req.body)
    UserPlants.update(req.body, {
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    })
        .then(dbUserPlantData => {
         
            if (!dbUserPlantData[0]) {
                res.status(404).json({ message: 'User Plant not found under this ID or nothing to update' })
                return;
            };
            res.json(dbUserPlantData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

//DELETE user plant
router.delete("/:id", withAuth, (req, res) => {
    UserPlants.destroy({
        where: {
            id: req.params.id,
            user_id: req.session.user_id
        }
    })
    .then(dbUserPlantData => {
        if (!dbUserPlantData ) {
            res.status(404).json({ message: 'User Plant not found under this ID for current user' })
            return;
        };
        res.json(dbUserPlantData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;