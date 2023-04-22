const { SpotLightId, SpotLightContent, SpotLightAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, url_link_full } = require("./Controllers");

    const get_spotlight_content =  async (main_id, content_id, lang) => {
        const data_all = await SpotLightId.findAll({
            attributes: {
                exclude: ['updateBy', 'updateDate', 'updateIp' ,'postBy', 'postDate', 'postIp', 'updateBy', 'sequence'],
            },
            where: {
                main_id: main_id,
                main_status: 'active',
            },
            include: [
                {
                    model: SpotLightContent,
                    attributes: {
                        exclude: ['updateBy','updateDate','updateIp'],
                    },
                    where: { 
                        content_id:  content_id,  
                        lang_id:  lang,  // TH,EN
                        content_status: 'active'
                    },
                },
                {
                    model: SpotLightAttachment,
                    attributes: {exclude: ['updateBy','updateDate','updateIp', 'attachmentType']},
                    where: { 
                        attachment_cate:  'featured',  
                        lang_id:  lang,  // TH,EN
                    },
                    order: [
                        ['update_date', 'DESC'],
                    ],
                }
            ],
            raw: true,
        });

        return data_all;
    
    };


    exports.index = async (req, res, next) => {
        try {
            const {page, lang  } = req.body;
            const getContent = await getPageContent(page, lang);
            const rs_spotlight_attachment = [];
            if (getContent['spotlight'] !== "") {
                for (const [key, value] of Object.entries(getContent['spotlight'])) {
                    const spotlight = await get_spotlight_content(value['main_id'], value['content_id'], lang);
                    if(spotlight){
                       const rs_url_rewrite = await get_url_rewrite(spotlight[0]['SpotLightContents.contentRewriteId']);
                       spotlight[0]['SpotLightAttachments.urlRewrite'] = await url_link_full(rs_url_rewrite[0]['targetPath']);

                    if (spotlight[0]['SpotLightAttachments.attachmentBase'] === spotlight[0]['SpotLightContents.contentThumbnail']) {
						spotlight[0]['SpotLightAttachments.thumbnailLink']= await old_attachment_link('images', 'spotlight', spotlight[0]['SpotLightContents.contentThumbnail']);
					}else if ((spotlight[0]['SpotLightAttachments.attachmentBase'] !== spotlight[0]['SpotLightContents.contentThumbnail'])) {
						spotlight[0]['SpotLightAttachments.thumbnailLink']= await old_attachment_link('images', 'spotlight', spotlight[0]['SpotLightAttachments.attachmentBase']);
					}else {
						spotlight[0]['SpotLightAttachments.thumbnailLink']= '';
					}

                    if(spotlight[0]['SpotLightAttachments.attachmentAlt'] === null) {
						spotlight[0]['SpotLightAttachments.attachmentAlt'] = spotlight[0]['SpotLightContents.contentSubject'];
					}

                    if(spotlight[0]['SpotLightAttachments.attachmentTitle'] === null) {
						spotlight[0]['SpotLightAttachments.attachmentTitle'] = spotlight[0]['SpotLightContents.contentSubject'];
					}

                    rs_spotlight_attachment.push({...value, spotlight:spotlight});
                    }
                }
            }
            res.status(200).send(rs_spotlight_attachment );
        } catch (error) {
            next(error);
        }
    };
    

