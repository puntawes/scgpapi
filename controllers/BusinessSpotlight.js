const { SpotLightId, SpotLightContent, SpotLightAttachment, SystemUrlRewrite,sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, 
    url_link_full, calSkip, calPage, get_search_url_rewrite, } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');

const get_highlight_spotlight_content =  async (lang) => {
    const data_all = await SpotLightId.findAll({
        where: {
            main_status: 'active',
        },
        include: [
            {
                model: SpotLightContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
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

const get_all_spotlight_content =  async (lang, main_id, month, year, data_limit, data_offset) => {
    const data_all = await SpotLightId.findAndCountAll({
        where: {
            main_status: 'active',
            post_date: year && month ? {
                [Op.and]: [
                    sequelize.where(sequelize.fn('MONTH', sequelize.col('post_date')), month),
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('post_date')), year),
                ],
            } : year && !month ? (
                sequelize.where(sequelize.fn('YEAR', sequelize.col('post_date')), year )
            ) : !year && month ? (
                sequelize.where(sequelize.fn('MONTH', sequelize.col('post_date')), month )
            ) :{
                [Op.ne]: null
            },
        },
        include: [
            {
                model: SpotLightContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
                    main_id: main_id ? {
                        [Op.ne]: main_id
                    } : {
                        [Op.ne]: ''
                    },
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

const get_spotlight_attachment_featured = async (main_id, lang) =>{
    if (!lang) {
        lang = ""
    }
    const data_all = await SpotLightAttachment.findAll({
        attributes:[
            "attachment_id", "attachment_base", "attachment_cate", "attachment_type", "attachment_link",
            "attachment_title", "attachment_alt", "attachment_status",
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

const get_spotlight_content = async (main_id, content_id = null, lang = null) =>{
    const data_all = await SpotLightId.findAll({
        where: {
            main_status: 'active',
            main_id: main_id,
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: SpotLightContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active'
                },
                
            },{
                model: SpotLightAttachment,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    attachment_cate: 'featured'
                },
            }

        ],
        raw: true,
    });
    return data_all;
}


const get_spotlight_attachment_image = async (main_id, lang) =>{
    if (!lang) {
        lang = "";
    }
    const data_all = await SpotLightAttachment.findAll({
        attributes:[
            "attachment_id", "attachment_base", "attachment_cate", "attachment_type", "attachment_link",
            "attachment_title", "attachment_alt", "attachment_status", "sequence",
        ],
        where: {
            default_main_id: main_id,
            // attachment_cate: 'image',
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


const get_relate_spotlight_content =  async (main_id, lang,  start = 0, limit = 0) => {
    const data_all = await SpotLightId.findAll({
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
                model: SpotLightContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active'
                },
            },
            {
                model: SpotLightAttachment,
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

const get_spotlight_content_detail = async (content_rewrite_id, lang) =>{
    const data_all = await SpotLightContent.findAll({
        where: {
            content_rewrite_id: content_rewrite_id,
            // lang_id: lang
        },
        raw: true,
    });
    return data_all;
}


const get_target_detail_paths = async (data_target_detail_path,) =>{
    const data =  SystemUrlRewrite.findAll({
        where:{
            target_detail_path: { [Op.like]: `%${data_target_detail_path}%` },
        },
        raw: true,
    })
    return data;
}


exports.getBusinessSpotlightHighlight = async (req, res, next) => {
    try {

        const { lang } = req.body;
        
        const rs_spotlight = await get_highlight_spotlight_content(lang);
        if(rs_spotlight[0]){
            for (const [key_spotlight, value_spotlight] of Object.entries(rs_spotlight)) {  
                const rs_url_rewrite = await get_url_rewrite(value_spotlight['SpotLightContents.contentRewriteId']);
                value_spotlight['urlRewrite']  =  url_link_full(rs_url_rewrite[0]['targetPath']);

                // $rs_spotlight_attachment = $this->spotlight_model->get_spotlight_attachment_featured($value['main_id'], $lang);
                const rs_spotlight_attachment = await get_spotlight_attachment_featured(value_spotlight['mainId'], lang);
                value_spotlight['thumbnailLink'] = old_attachment_link('images', 'spotlight', rs_spotlight_attachment[0]['attachment_base']);

                value_spotlight['attachmentAlt'] = ( rs_spotlight_attachment[0]['attachment_alt'] !== null) ?  rs_spotlight_attachment[0]['attachment_alt'] : value_spotlight['SpotLightContents.contentSubject'];
                value_spotlight['attachmentTitle'] = ( rs_spotlight_attachment[0]['attachment_title'] !== null) ?  rs_spotlight_attachment[0]['attachment_title'] : value_spotlight['SpotLightContents.contentSubject'];
            }
        }

        res.status(200).send(rs_spotlight[0]);

    } catch (error) {
        next(error);
    }
};

exports.getBusinessSpotlightControllerAll = async (req, res, next) => {
    try {

        const { lang, month, year, item_per_page, current_page  } = req.body;
        const offset = calSkip(Number(current_page), Number(item_per_page)); // offset
        const rs_highlight_spotlight = await get_highlight_spotlight_content(lang); // remove first element of the array
        const rs_spotlight = await get_all_spotlight_content(lang, rs_highlight_spotlight[0]['mainId'], month, year, Number(item_per_page),  Number(offset)); // get model
        const cal_page = calPage(Number(rs_spotlight.count ), Number(item_per_page)); // total page
        // ====== change name arrary ===== //
        rs_spotlight.data = rs_spotlight.rows;
        delete rs_spotlight.rows;
        // ====== change name arrary ===== //
        rs_spotlight.totalpage = cal_page;
        rs_spotlight.current_page = Number(current_page);
        rs_spotlight.item_per_page = Number(item_per_page);
        if(rs_spotlight.data[0]){
            for (const [key_spotlight, value_spotlight] of Object.entries(rs_spotlight.data)) {  
                const rs_url_rewrite = await get_url_rewrite(value_spotlight['SpotLightContents.contentRewriteId']);
                value_spotlight['urlRewrite']  =  url_link_full(rs_url_rewrite[0]['targetPath']);
                // $rs_spotlight_attachment = $this->spotlight_model->get_spotlight_attachment_featured($value['main_id'], $lang);
                const rs_spotlight_attachment = await get_spotlight_attachment_featured(value_spotlight['mainId'], lang);
                value_spotlight['thumbnailLink'] = old_attachment_link('images', 'spotlight', rs_spotlight_attachment[0]['attachment_base']);
                value_spotlight['attachmentAlt'] = ( rs_spotlight_attachment[0]['attachment_alt'] !== null) ?  rs_spotlight_attachment[0]['attachment_alt'] : value_spotlight['SpotLightContents.contentSubject'];
                value_spotlight['attachmentTitle'] = ( rs_spotlight_attachment[0]['attachment_title'] !== null) ?  rs_spotlight_attachment[0]['attachment_title'] : value_spotlight['SpotLightContents.contentSubject'];
            }
        }

        res.status(200).send(rs_spotlight);

    } catch (error) {
        next(error);
    }
};

exports.getBusinessSpotlightControllerById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lang,type  } = req.body;       
        const data_id = [];
        const url_rewrite_id = [];
        target_detail_path = [];
        detail_path=[]
        // ========== Extra Code ========== //
        if(type == 'id'){
            var rs_spotlight_content = await get_spotlight_content(id, null ,lang);
        }else{
            const url_rewrite = await get_search_url_rewrite(id);

            url_rewrite.map((val_lang, index_lang) => {
                cut_word_lang = val_lang['targetPath'].slice(0, 2); 

                if(cut_word_lang == lang.toLowerCase()){
                    url_rewrite_id.push(val_lang['urlRewriteId']);
                }
                target_detail_path.push(val_lang['targetDetailPath'].slice(0, -3));

            })
            const data = await get_spotlight_content_detail(url_rewrite_id, lang);
            var rs_spotlight_content = await get_spotlight_content(data[0]['mainId'], null ,lang);
            data_id.push(data[0]['mainId']);
        }
         //----------- target Detail Path --------------//
         const data_get_target_detail_path  = await get_target_detail_paths(target_detail_path[0]);
         //----------- end target Detail Path --------------//
        //  res.status(200).send([data_get_target_detail_path]);
        //----------- Contents Spotlight --------------//
        if(rs_spotlight_content[0]){
            for (const [key_spotlight_content, value_spotlight_content] of Object.entries(rs_spotlight_content)) {
                value_spotlight_content['thumbnail_link'] = old_attachment_link('images', 'spotlight', value_spotlight_content['SpotLightAttachments.attachmentBase']);
                const rs_url_rewrite = await get_url_rewrite(value_spotlight_content['SpotLightContents.contentRewriteId']);
                value_spotlight_content['urlRewrite']  =  url_link_full(rs_url_rewrite[0]['targetPath']);
                value_spotlight_content['SpotLightAttachments.attachmentAlt'] = (value_spotlight_content['SpotLightAttachments.attachmentAlt'] !== null) ? value_spotlight_content['SpotLightAttachments.attachmentAlt'] : value_spotlight_content['SpotLightContents.contentSubject'];
                value_spotlight_content['SpotLightAttachments.attachmentTitle'] = (value_spotlight_content['SpotLightAttachments.attachmentTitle'] !== null) ? value_spotlight_content['SpotLightAttachments.attachmentTitle'] : value_spotlight_content['SpotLightContents.contentSubject'];
                if(value_spotlight_content['SpotLightContents.contentYoutubeLink'] !== ''){
                    var matches = value_spotlight_content['SpotLightContents.contentYoutubeLink'].match(/^(?:http(?:s)?:\/\/)?(?:www\.)?(?:m\.)?(?:youtu\.be\/|youtube\.com\/(?:(?:watch)?\?(?:.*&)?v(?:i)?=|(?:embed|v|vi|user)\/))([^\?&\"'>]+)/);
                    value_spotlight_content['content_youtube_id'] = matches[1];
                }
            }
        }
        //----------- End Contents Spotlight --------------//

        // =========  gallery  ========== //
        const spotlight_gallery = await get_spotlight_attachment_image(( type == 'id'  ? id  : data_id[0] ),lang);

        if(spotlight_gallery[0]){
            for (const [key_spotlight_content_image, value_spotlight_content_image] of Object.entries(spotlight_gallery)) {
                value_spotlight_content_image['thumbnail_link'] = old_attachment_link('images', 'spotlight', value_spotlight_content_image['attachment_base']);
				value_spotlight_content_image['attachment_alt'] = (value_spotlight_content_image['attachment_alt']  !== null) ? value_spotlight_content_image['attachment_alt'] : rs_spotlight_content[0]['SpotLightContents.contentSubject'];
				value_spotlight_content_image['attachment_title'] = (value_spotlight_content_image['attachment_title']  !== null) ? value_spotlight_content_image['attachment_title']: rs_spotlight_content[0]['SpotLightContents.contentSubject'];
            }
            rs_spotlight_content[0]['gallery'] = spotlight_gallery;
        }
        const spotlight_relate = await get_relate_spotlight_content(( type == 'id'  ? id  : data_id[0] ) ,lang, 0 ,4);

        if(spotlight_relate[0]){
            for (const [key_spotlight_relate, value_spotlight_relate] of Object.entries(spotlight_relate)) {
                const rs_url_rewrite = await get_url_rewrite(value_spotlight_relate['SpotLightContents.contentRewriteId']);
                value_spotlight_relate['urlRewrite']  =  url_link_full(rs_url_rewrite[0]['targetPath']);
                value_spotlight_relate['thumbnail_link'] = old_attachment_link('images', 'spotlight', value_spotlight_relate['SpotLightAttachments.attachmentBase']);
				value_spotlight_relate['attachment_alt'] = (value_spotlight_relate['SpotLightAttachments.attachmentAlt']  !== null) ? value_spotlight_relate['SpotLightAttachments.attachmentAlt'] : rs_spotlight_content[0]['SpotLightContents.contentSubject'];
				value_spotlight_relate['attachment_title'] = (value_spotlight_relate['SpotLightAttachments.attachmentAlt']  !== null) ? value_spotlight_relate['SpotLightAttachments.attachmentAlt']: rs_spotlight_content[0]['SpotLightContents.contentSubject'];
            }
            rs_spotlight_content[0]['relate'] = spotlight_relate;
        }
        // =========  End gallery  ========== //
        rs_spotlight_content[0]['data_get_target_detail_path'] = data_get_target_detail_path;

        res.status(200).send(rs_spotlight_content[0]);

    } catch (error) {
        next(error);
    }
};