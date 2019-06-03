const router = require('express').Router();
const marked = require('marked');
const fs = require('fs');
const fm = require('front-matter');
const renderer = require('../../utils/renderer');
const dir_reader = require('../../utils/dir_reader');
const path = require('path');

router.get('/projects/:name', (req, res) => {

    const lang = req.i18n_lang;
    const name = req.params.name;
    const source = path.join(__dirname, '..', '..', '..', 'content', 'projects', name, `${lang}.md`);
    const imagePath = path.join('/content', 'projects', name);
    const pathname = req.path;

    // Renders lazy images
    renderer.custom_img(imagePath);

    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            return res.render('pages/404')
        }
        // Get the YAML metadata
        const frontmatter = fm(data);
        // Compiles markdown
        const body = marked(frontmatter.body, { renderer: renderer });
        return res.render('pages/projects/project', { frontmatter: frontmatter.attributes, body: body, img_path: imagePath, pathname: pathname });
    });

})

// Projects page. Gets every projects with the current language
router.get('/projects', async (req, res) => {

    const lang = req.i18n_lang;
    const source = path.resolve(__dirname, '..', '..', '..', 'content', 'projects');
    const imagePath = path.join('/content', 'projects');
    const pathname = req.path;

    try {
        const frontmatters = await dir_reader.readMarkdownFolders(source, lang);
        return res.render('pages/projects/projects-list', { projects: frontmatters, img_path: imagePath, pathname: pathname })
    } catch(err) {
        return res.render('pages/500', { code: err.code })
    }
   
})



module.exports = router;