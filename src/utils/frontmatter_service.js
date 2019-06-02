const frontmatter_service = {

    filter(query, frontmatters) {
        let expression = new RegExp(query.value)
        switch(query.filter) {
            // If no filter was found just return 5 posts
            case undefined:
            return frontmatters.slice(0, 4);
            case 'tag':
            return frontmatters.filter(post => expression.test(post.tags.toLowerCase()));
            case 'month':
            return frontmatters.filter(post => expression.test(post.date));
            case 'year':
            return frontmatters.filter(post => expression.test(post.date));
        }
    },

    getTags(frontmatters) {
        let tags_string = '';
        for (let i = 0; i < frontmatters.length; i++) {
            if (i !== frontmatters.length - 1) {
                tags_string = tags_string + frontmatters[i].tags + ', '
            } else {
                tags_string = tags_string + frontmatters[i].tags
            }            
        }
        // Smash duplicates
        return [...new Set(tags_string.toLowerCase().split(', '))]
    },

    getYears(frontmatters) {
        const years = frontmatters.map(post => {
            return post.date.match(/20[0-9]{2}/)[0]
        })
        // Smash duplicates
        return [...new Set(years)]
    },

    getMonths(frontmatters) {
        let months = frontmatters.map(post => {
            return post.date.match(/[a-zA-Z]*/)[0]
        })
        // Smash duplicates
        return [...new Set(months)]
    }

}

module.exports = frontmatter_service;