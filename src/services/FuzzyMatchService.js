const Fuse = require('fuse.js');

class FuzzyMatchService {
    findBestMatch(searchString, options) {
        if (!Array.isArray(options) || options.length === 0) {
            return null;
        }

        const fuse = new Fuse(options, {
            includeScore: true,
            threshold: 0.6, // ลดความเข้มงวดในการค้นหา (0 = exact match, 1 = match anything)
            keys: ['keywords'],
            ignoreLocation: true,
            findAllMatches: true,
            minMatchCharLength: 2
        });

        const results = fuse.search(searchString);
        
        if (results.length > 0) {
            return results[0].item;
        }

        const partialMatch = this.findPartialMatch(searchString, options);
        if (partialMatch) {
            return partialMatch;
        }

        return null;
    }

    findPartialMatch(searchString, options) {
        const searchLower = searchString.toLowerCase();
        
        for (const option of options) {
            if (option.keywords && Array.isArray(option.keywords)) {
                for (const keyword of option.keywords) {
                    const keywordLower = keyword.toLowerCase();
                    
                    if (searchLower.includes(keywordLower) || keywordLower.includes(searchLower)) {
                        return option;
                    }
                }
            }
        }
        return null;
    }
}

module.exports = new FuzzyMatchService();