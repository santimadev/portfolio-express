const router = require('express').Router();
const projects = require('./pages/projects');
const blog = require('./pages/blog');
const webhook = require('./webhook');

// About page
router.get('/', (req, res) => {
    return res.render('pages/about', { pathname: req.path })
})

router.use(projects);
router.use(blog);
router.use(webhook);


module.exports = router;