const router = require('express').Router();
const marked = require('marked');
const fs = require('fs');
const fm = require('front-matter');
const renderer = require('../../utils/renderer');
const frontmatter_service = require('../../utils/frontmatter_service');
const dir_reader = require('../../utils/dir_reader');
const path = require('path');
const moment = require('moment');
moment().format();
moment.locale('es')

router.get('/blog/:post', (req, res) => {

    const lang = req.i18n_lang;
    const name = req.params.post;
    const source = path.join(__dirname, '..', '..', '..', 'content', 'blog', name, `post.md`);
    const imagePath = path.join('/content', 'blog', name);
    const pathname = req.path;
    // Lazy load images
    renderer.custom_img(imagePath)
    fs.readFile(source, 'utf8', (err, data) => {
        if (err) {
            console.log(err)
            return res.render('pages/404')
        }
        // Get the YAML metadata
        const frontmatter = fm(data);
        const date = moment(new Date(frontmatter.attributes.date)).format('LL')
        // Compile markdown
        const body = marked(frontmatter.body, { renderer: renderer });
        return res.render('pages/blog/post', { 
            frontmatter: frontmatter.attributes, 
            date: date,
            body: body, 
            img_path: imagePath, 
            pathname: pathname 
        });
    });

})

// Blog page. Gets the last 5 articles default
router.get('/blog', async (req, res) => {

    const lang = req.i18n_lang;
    const source = path.resolve(__dirname, '..', '..', '..', 'content', 'blog');
    const imagePath = path.join('/content', 'blog');
    const pathname = req.path;
    const query = req.query

    try {
        let frontmatters = await dir_reader.readMarkdownFolders(source, 'post');

        const years = frontmatter_service.getYears(frontmatters);
        const tags = frontmatter_service.getTags(frontmatters);
        const months = frontmatter_service.getMonths(frontmatters);
        const posts = frontmatter_service.filter(query, frontmatters);

        frontmatters.sort((a, b) => {
            const dateA = new Date(a.date).getTime()
            const dateB = new Date(b.date).getTime()
             return dateB - dateA
        })
        frontmatters = frontmatters.map(post => {
            post.date = moment(new Date(post.date)).format('LL')
            return post
        })
        return res.render('pages/blog/blog', { 
                filters: { years, tags, months },
                posts: posts, 
                img_path: imagePath, 
                pathname: pathname,
                lang: lang
            });
    } catch(err) {
        console.log(err)
        return res.render('pages/500', { code: err.code })
    }
   
})



module.exports = router;