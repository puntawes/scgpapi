const { NewsId, NewsContent, NewsAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, siteSettings, url_link_full } = require("./Controllers");
const { Op } = require("sequelize");

    const get_news_content =  async (lang, main_id = null, content_id = null) => {
        if(!content_id){
            content_id = "";
        }
        const data_all = await NewsId.findAll({
            where: {
                main_id: main_id,
                main_status: 'active',
            },
            include: [
                {
                    model: NewsContent,
                    attributes: {
                        exclude: ['updateBy','updateIp'],
                        include: [
                            [
                              sequelize.fn
                              (
                                "DATE_FORMAT", 
                                sequelize.col("content_datetime"), 
                                "%d/%b/%Y"
                              ),
                              "contentDatetime",
                            ],
                          ],    
                    },
                    where: { 
                        content_id: content_id ? {
                            [Op.eq]: content_id
                        } : {
                            [Op.ne]: content_id
                        },
                        lang_id:  lang,  // TH,EN
                        content_status: 'active'
                    },
                },
                {
                    model: NewsAttachment,
                    attributes: {exclude: ['updateBy','updateDate','updateIp']},
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
            const rs_product_attachment = [];
            if (getContent['news'] !== "") {
                for (const [key, value] of Object.entries(getContent['news'])) {
                    var get_news_contents = await get_news_content(lang, value['main_id'], value['content_id']);
                    if(get_news_contents !== ''){
                        for (const [key_news_content, value_news_content] of Object.entries(get_news_contents)) {
                            var data_rs_url_rewrite =  await get_url_rewrite(String(value_news_content['NewsContents.contentRewriteId']));
                            value_news_content['urlRewrite'] = await url_link_full(data_rs_url_rewrite[0]['targetPath'] );

                            if (value_news_content['NewsAttachments.attachmentBase'] === value_news_content['NewsContents.contentThumbnail']) {
                                value_news_content['thumbnailLink'] = await old_attachment_link('images', 'news',value_news_content['NewsContents.contentThumbnail']);
                            }else if (value_news_content['NewsAttachments.attachmentBase'] === value_news_content['NewsContents.contentThumbnail']) {
                                value_news_content['thumbnailLink'] = await old_attachment_link('images', 'news',value_news_content['NewsAttachments.attachmentBase']);
                            }else {
                                value_news_content['thumbnailLink'] = '';
                            }

                            if(value_news_content['NewsAttachments.attachmentAlt'] === null) {
                                value_news_content['NewsAttachments.attachmentAlt'] = value_news_content['NewsContents.contentSubject'];
                            }
                            if(value_news_content['NewsAttachments.attachmentTitle'] === null) {
                                value_news_content['NewsAttachments.attachmentTitle'] = value_news_content['NewsContents.contentSubject'];
                            }
                            //value_news_content['NewsContents.contentDatetime'] = date_format_lang(value_news_content['postDate'],lang);

                            rs_product_attachment.push({...value_news_content});
                        }
                    }
                }
            }
            res.status(200).send(rs_product_attachment);
        } catch (error) {
            next(error);
        }
    };

    

