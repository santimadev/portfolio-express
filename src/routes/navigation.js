const router = require('express').Router();
const projects = require('./pages/projects');
const blog = require('./pages/blog');

// About page
router.get('/', (req, res) => {
    return res.render('pages/about', { pathname: req.path })
})

router.use(projects);
router.use(blog);


module.exports = router;