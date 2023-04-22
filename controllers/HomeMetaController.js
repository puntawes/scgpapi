const { siteSettings  } = require("./Controllers");
    exports.index = async (req, res, next) => {
        try {
            // const {lang  } = req.body;
            // const siteSetting = await siteSettings(lang);

            const siteSetting = await siteSettings(req.query.lang);
            const data = [];

            /* Meta */
            data.push({
                meta_title: siteSetting[0]['content_title'], 
                meta_description: siteSetting[0]['content_description'],
                meta_keyword: siteSetting[0]['content_keyword'],
                page_title: siteSetting[0]['content_title'],

            });
		    /* End Meta */
            res.status(200).send(data );
        } catch (error) {
            next(error);
        }
    };
    
