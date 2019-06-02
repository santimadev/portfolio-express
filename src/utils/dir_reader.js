const fs = require('fs');
const fm = require('front-matter');

const frontmatter_reader = {

    readMarkdownFolders(path, lang) {
        return new Promise((resolve, reject) => {
            fs.readdir(path, (err, files) => {
                if (err) return reject(err);
                const frontmatters = files.map(folder => {
                    return this.readMarkdownYAML(path, folder, lang)
                })
                const result = Promise.all(frontmatters);
                return resolve(result)
            })
        })
    },

    readMarkdownYAML(path, folder, lang) {
        return new Promise((resolve, reject) => {
            fs.readFile(`${path}/${folder}/${lang}.md`, 'utf8', (err, data) => {
                if (err) return reject(err)
                return resolve(fm(data).attributes);
            })
        })  
    }

}





module.exports = frontmatter_reader;