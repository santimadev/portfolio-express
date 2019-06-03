const moment = require('moment');

const frontmatter_service = {

    filter(query, frontmatters) {
        // Translate the date to just the month name
        let expression = new RegExp(query.value)
        switch(query.filter) {
            // If no filter was found just return 4 posts
            case undefined:
            return frontmatters.slice(0, 4);
            case 'tag':
            return frontmatters.filter(post => expression.test(post.tags.toLowerCase()));
            case 'month':
            // Parsing dates to months names in order to make the filter by month name
            frontmatters.map(post => {
                post.month = moment(new Date(post.date)).format('MMMM');
                post.month = post.month.charAt(0).toUpperCase() + post.month.slice(1);
                return post;
            })
            return frontmatters.filter(post => expression.test(post.month));
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
            let month = moment(new Date(post.date)).format('MMMM');
            // title case
            month = month.charAt(0).toUpperCase() + month.slice(1);
            return month
        })
        // Smash duplicates
        return [...new Set(months)]
    }

}

module.exports = frontmatter_service;