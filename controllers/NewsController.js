const { NewsId, NewsContent, NewsAttachment, SystemUrlRewrite, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, date_full_format_lang,
    siteSettings, calSkip, calPage, get_search_url_rewrite, url_link_full  } = require("./Controllers");
const { Op } = require("sequelize");

const get_highlight_news_content =  async (lang, main_id, month, year) => {
    const data_all = await NewsId.findAll({
        where: {
            main_status: 'active',
        },
        include: [
            {
                model: NewsContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
                    main_id: main_id ? {
                        [Op.ne]: main_id
                    } : {
                        [Op.ne]: ''
                    },
                    content_datetime: year && month ? {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('content_datetime')), month),
                            sequelize.where(sequelize.fn('YEAR', sequelize.col('content_datetime')), year),
                        ],
                    } : year && !month ? (
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('content_datetime')), year )
                    ) : {
                        [Op.ne]: null
                    } 
                },
            },
        ],
        order: [
            ['post_date', 'DESC'],
        ],
        limit: 1,
        raw: true,
    });
    return data_all;
}

const get_all_news_content =  async (lang, main_id, month, year, data_limit, data_offset) => {
    const data_all = await NewsId.findAndCountAll({
        where: {
            main_status: 'active',
        },
        include: [
            {
                model: NewsContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
                    main_id: main_id ? {
                        [Op.ne]: main_id
                    } : {
                        [Op.ne]: ''
                    },
                    content_datetime: year && month ? {
                        [Op.and]: [
                            sequelize.where(sequelize.fn('MONTH', sequelize.col('content_datetime')), month),
                            sequelize.where(sequelize.fn('YEAR', sequelize.col('content_datetime')), year),
                        ],
                    } : year && !month ? (
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('content_datetime')), year )
                    ) : !year && month ? (
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('content_datetime')), month )
                    ) : {
                        [Op.ne]: null
                    } 
                },
            },
        ],
        order: [
            ['post_date', 'DESC'],
        ],
        limit: data_limit,
        offset: data_offset,
        raw: true,
    });
    return data_all;
}

const get_news_attachment_featured = async (main_id, lang)=>{
    if (!lang) {
        lang = ""
    }
    const data_all = await NewsAttachment.findAll({
        attributes: [
            "attachment_id", "attachment_base" , "attachment_cate", "attachment_type", 
            "attachment_link", "attachment_title", "attachment_alt", "attachment_status",
        ],
        where: {
            default_main_id: main_id,
            attachment_cate: 'featured',
            attachment_status: 'active',
            lang_id: lang ? {
                [Op.eq]: lang
            } : {
                [Op.ne]: lang
            },
        },
        raw: true,
    });
    return data_all;

}


const get_news_content =  async (lang, main_id, content_id = null) => {
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
                    exclude: ['updateBy','updateDate','updateIp'],
                    // include: [
                    //     [
                    //       sequelize.fn
                    //       (
                    //         "DATE_FORMAT", 
                    //         sequelize.col("content_datetime"), 
                    //         "%d/%b/%Y"
                    //       ),
                    //       "contentDatetime",
                    //     ],
                    //   ],    
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

const get_news_attachment_image =  async (main_id, lang) => {
    const data_all = await NewsAttachment.findAll({
        attributes: [
            "attachment_id", "attachment_base" , "attachment_cate", "attachment_type", 
            "attachment_link", "attachment_title", "attachment_alt", "attachment_status",
        ],
        where: {
            default_main_id: main_id,
            lang_id:  lang,  
            attachment_cate: 'image',
            attachment_status: 'active',
        },
        raw: true,
    });
    return data_all;
};


const get_relate_news_content =  async (main_id, lang, limit) => {
    const data_all = await NewsId.findAll({
        where: {
            main_id: {
                [Op.ne]: main_id
              },
            main_status: 'active',
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: NewsContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
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
               
            }
        ],            
        limit: limit,
        raw: true,
    });
    return data_all;
};

const get_news_content_detail = async (content_rewrite_id, lang) =>{
    const data_all = await NewsContent.findAll({
        where: {
            content_rewrite_id: content_rewrite_id,
            lang_id: lang
        },
        raw: true,
    });
    return data_all;
}

const get_target_detail_path = async (data_target_detail_path,) =>{
    const data =  SystemUrlRewrite.findAll({
        where:{
            target_detail_path: { [Op.like]: `%${data_target_detail_path}%` },
        },
        raw: true,
    })
    return data;
}
const get_news_highlight = async (lang , type) => {
    const data_all = await NewsId.findAll({
        attributes:['mainId','defaultMainId'],
        where: {
            main_status: 'active'
        },
        include: [
            {
                model: NewsContent,
                attributes:['contentThumbnail','contentDatetime','contentCategory'],
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
                    content_category: type
                },
            }
        ],
        order: [
            ['post_date', 'DESC'],
        ],
        
        raw: true,
    });
    return data_all;
}
const get_subtain =  async (lang) => {
    const data_all = await NewsId.findAndCountAll({
        where: {
            main_status: 'active',
        },
        include: [
            {
                model: NewsContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                },
            },
        ],
        order: [
            ['post_date', 'DESC'],
        ],
        // limit: data_limit,
        // offset: data_offset,
        raw: true,
    });
    return data_all;
}

exports.getNewsAllHighlight = async (req, res, next) =>{
    try{
        const { lang  } = req.body;
        const rs_news = await get_highlight_news_content(lang);
        if(rs_news[0]){
            for (const [key_news, value_news] of Object.entries(rs_news)) {
                const rs_url_rewrite = await get_url_rewrite(value_news['NewsContents.contentRewriteId']);
                value_news['urlRewrite'] = url_link_full(rs_url_rewrite[0]['targetPath']);
                const rs_news_attachment = await get_news_attachment_featured(value_news['mainId'], lang);
                value_news['thumbnailLink'] = old_attachment_link('images', 'news', rs_news_attachment[0]['attachment_base']);
                value_news['attachmentAlt'] = (rs_news_attachment[0]['attachment_alt'] !== null) ? rs_news_attachment[0]['attachment_alt'] : value_news['NewsContents.contentSubject'];
                value_news['attachmentTitle'] = (rs_news_attachment[0]['attachment_title'] !== null) ? rs_news_attachment[0]['attachment_title'] : value_news['NewsContents.contentSubject'];
                value_news['contentDatetimeFull'] = date_full_format_lang(value_news['NewsContents.contentDatetime'],lang);
                value_news['NewsContents.contentDatetime'] = date_format_lang(value_news['NewsContents.contentDatetime'],lang);
            }
        }
        res.status(200).send(rs_news);

    }catch(error){
        next(error);
    }
};

exports.getNewsAll = async (req, res, next) =>{
    try{
        const { lang, month, year, item_per_page, current_page  } = req.body;
        const offset = calSkip(Number(current_page), Number(item_per_page)); // offset
        const rs_highlight_news = await get_highlight_news_content(lang); // remove first element of the array
        const rs_news = await get_all_news_content(lang, rs_highlight_news[0]['mainId'], month, year, Number(item_per_page),  Number(offset)); // get model
        const cal_page = calPage(Number(rs_news.count ), Number(item_per_page)); // total page
        // ====== change name arrary ===== //
        rs_news.data = rs_news.rows;
        delete rs_news.rows;
        // ====== change name arrary ===== //
        rs_news.totalpage = cal_page;
        rs_news.current_page = Number(current_page);
        rs_news.item_per_page = Number(item_per_page);
        if(rs_news.data[0]){
            for (const [key_news, value_news] of Object.entries(rs_news.data)) {
                const rs_url_rewrite = await get_url_rewrite(value_news['NewsContents.contentRewriteId']);
                value_news['urlRewrite'] = url_link_full(rs_url_rewrite[0]['targetPath']);
                const rs_news_attachment = await get_news_attachment_featured(value_news['mainId'], lang);
                value_news['thumbnailLink'] = old_attachment_link('images', 'news', rs_news_attachment[0]['attachment_base']);
                value_news['attachmentAlt'] = (rs_news_attachment[0]['attachment_alt'] !== null) ? rs_news_attachment[0]['attachment_alt'] : value_news['NewsContents.contentSubject'];
                value_news['attachmentTitle'] = (rs_news_attachment[0]['attachment_title'] !== null) ? rs_news_attachment[0]['attachment_title'] : value_news['NewsContents.contentSubject'];
                value_news['contentDatetimeFull'] = date_full_format_lang(value_news['NewsContents.contentDatetime'],lang);
                value_news['NewsContents.contentDatetime'] = date_format_lang(value_news['NewsContents.contentDatetime'],lang);
            }
        }

        res.status(200).send(rs_news);

    }catch(error){
        next(error);
    }
};

exports.getNewsById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lang, type  } = req.body;
        const data_id = [];
        url_rewrite_id = [];
        target_detail_path = [];
        detail_path=[]
        if(type == 'id'){
            var get_news_contents = await get_news_content(lang, id);
        }else{
            const url_rewrite = await get_search_url_rewrite(id);            
            url_rewrite.map((val_lang, index_lang) => {
                cut_word_lang = val_lang['targetPath'].slice(0, 2); 
                if(cut_word_lang == lang.toLowerCase()){
                    url_rewrite_id.push(val_lang['urlRewriteId']);
                }
                target_detail_path.push(val_lang['targetDetailPath'].slice(0, -3));
            })

            const data = await get_news_content_detail(url_rewrite_id, lang);

            var get_news_contents = await get_news_content(lang, data[0]['mainId'], null ,);
            data_id.push(data[0]['mainId']);

        }
        //----------- target Detail Path --------------//
        const data_get_target_detail_path = await get_target_detail_path(target_detail_path[0]);
        //----------- end target Detail Path --------------//

        

        //----------- Contents News --------------//
        if(get_news_contents[0]){
            for (const [key_news_content, value_news_content] of Object.entries(get_news_contents)) {
                value_news_content['thumbnailLink'] = old_attachment_link('images', 'news', value_news_content['NewsAttachments.attachmentBase']);
            
                if(value_news_content['NewsAttachments.attachmentAlt'] === null ) {
                    value_news_content['NewsAttachments.attachmentAlt'] = value_news_content['NewsContents.contentSubject'];
                }
                if(value_news_content['NewsAttachments.attachmentTitle'] === null ) {
                    value_news_content['NewsAttachments.attachmentTitle'] = value_news_content['NewsContents.contentSubject'];
                }
                value_news_content['NewsContents.contentDatetime'] = date_format_lang(value_news_content['NewsContents.contentDatetime'],lang);

                // if(value_news_content['NewsAttachments.contentYoutubeLink'] !== null ) {
                //     ข้ามไปก่อน
                // }
            }
        }
        //----------- End Contents News --------------//

        //----------- Gallery News --------------//

        const news_gallery = await get_news_attachment_image(( type == 'id'  ? id  : data_id[0] ), lang);

        if(news_gallery[0]){
            var result_gallery = news_gallery.map((value_gallery, key_gallery) => {
                // var aa = value;
                // res.status(200).send(value['attachment_base'] );
                value_gallery['thumbnailLink'] = old_attachment_link('images', 'news', value_gallery['attachment_base']);

                if(value_gallery['attachment_alt'] === null  ) {
                    value_gallery['attachment_alt'] = get_news_contents[0]['NewsContents.contentSubject'];
                }

                if(value_gallery['attachment_title'] === null  ) {
                    value_gallery['attachment_title'] = get_news_contents[0]['NewsContents.contentSubject'];
                }
                return {...value_gallery};

            })
        }
        //----------- End Gallery News --------------//


        //----------- Relate News --------------//

        const news_relate = await get_relate_news_content(( type == 'id'  ? id  : data_id[0] ), lang, 4);
        if(get_news_contents[0]){
            for (const [key_relate, value_relate] of Object.entries(news_relate)) {
                const rs_url_rewrite =  await get_url_rewrite(value_relate['NewsContents.contentRewriteId']);

                value_relate['urlRewrite'] = url_link_full(rs_url_rewrite[0]['targetPath']);

                value_relate['thumbnailLink'] = old_attachment_link('images', 'news', value_relate['NewsContents.contentThumbnail']);

                value_relate['attachmentAlt'] = ( value_relate['NewsAttachments.attachmentAlt'] !== null) ? value_relate['NewsAttachments.attachmentAlt'] : value_relate['NewsContents.contentSubject'];
                value_relate['attachmentTitle'] = ( value_relate['NewsAttachments.attachmentTitle'] !== null) ? value_relate['NewsAttachments.attachmentTitle'] : value_relate['NewsContents.contentSubject'];
                value_relate['NewsContents.contentDatetime'] = date_format_lang(value_relate['NewsContents.contentDatetime'],lang);
            }
        }
        //----------- End Relate News --------------//
        
        // ---------- Set Header ----------------// 
        const site_setting = await siteSettings(lang);
        for (const [key_news_content_meta, value_news_content_meta] of Object.entries(get_news_contents)) {  
            // ---------- Set Meta   ----------------// 
                value_news_content_meta['meta_title']  = (value_news_content_meta['NewsContents.contentTitle'] !== null ? value_news_content_meta['NewsContents.contentTitle'] : site_setting[0]['content_title'] );
                value_news_content_meta['meta_description']  = (value_news_content_meta['NewsContents.contentDescription'] !== null ? value_news_content_meta['NewsContents.contentDescription'] : site_setting[0]['content_description'] );
                value_news_content_meta['meta_keyword']  = (value_news_content_meta['NewsContents.contentKeyword'] !== null ? value_news_content_meta['NewsContents.contentKeyword'] : site_setting[0]['content_keyword'] );
                value_news_content_meta['page_title']  = (value_news_content_meta['NewsContents.contentTitle'] !== null ? value_news_content_meta['NewsContents.contentTitle'] : site_setting[0]['content_title'] );
            
                //-------------------------- set Meta OG ------------------------------//
                // value_news_content_meta['meta_og_url']  =  window.location.href.toString();
                value_news_content_meta['meta_og_type']  =  'article';
                value_news_content_meta['meta_og_title']   = (value_news_content_meta['NewsContents.contentTitle'] !== null ? value_news_content_meta['NewsContents.contentTitle'] : site_setting[0]['content_title'] );
                value_news_content_meta['meta_og_desc']   = (value_news_content_meta['NewsContents.contentDescription'] !== null ? value_news_content_meta['NewsContents.contentDescription'] : site_setting[0]['content_description'] );
                value_news_content_meta['meta_og_image']   = (value_news_content_meta['thumbnailLink'] !== null ? value_news_content_meta['thumbnailLink'] : '');
                //-------------------------- End set Meta OG ------------------------------//

            // ---------- End Set Meta   ----------------// 

            }
        
        res.status(200).send({get_news_contents, result_gallery, news_relate, data_get_target_detail_path});

    } catch (error) {
        next(error);
    }
};

exports.getHighlight = async (req, res, next) => {
    try {
        const { lang, type  } = req.body;
        const data_highlight = await get_news_highlight(lang, type)
        if(data_highlight){
            for (let i = 0; i < data_highlight.length; i++) {
                data_highlight[i]['NewsContents.contentThumbnail'] = old_attachment_link('images', 'news', data_highlight[i]['NewsContents.contentThumbnail']);
            }
        }
        res.status(200).send(data_highlight);
    } catch (error) {
        next(error);
    }
}

