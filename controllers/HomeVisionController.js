const { getPageContent } = require("./Controllers");
    exports.index = async (req, res, next) => {
        try {
            const { page, lang  } = req.body;
            const getContent = await getPageContent(page, lang);
            const data = [];
        /* Vision */
            getContent['vision_header'] = (getContent['vision_header'] !== '') ? getContent['vision_header'] : '';
            getContent['vision_detail_desktop'] = (getContent['vision_detail_desktop'] !== '') ? getContent['vision_detail_desktop'] : '';
            getContent['vision_detail_mobile'] = (getContent['vision_detail_mobile'] !== '') ? getContent['vision_detail_mobile'] : '';
		/* End Vision */
            
            data.push({vision_header:getContent['vision_header'], vision_detail_desktop: getContent['vision_detail_desktop'],vision_detail_mobile: getContent['vision_detail_mobile'] });

            res.status(200).send(data );
            // res.status(200).send([data, saw ]);
        } catch (error) {
            next(error);
        }
    };
    
