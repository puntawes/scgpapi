const { CsrId, CsrContent, CsrAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, siteSettings } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');

const get_highlight_csr_content = async (lang) =>{
    const data_all = await CsrId.findAll({
        where: {
            main_status: 'active',
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: CsrContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active'
                },
                
            },{
                model: CsrAttachment,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    attachment_cate: 'featured'
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


const get_csr_attachment_featured = async (main_id, lang) =>{
    if (!lang) {
        lang = ""
    }
    const data_all = await CsrAttachment.findAll({
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

const get_csr_content = async (main_id, content_id = null, lang = null) =>{
    const data_all = await CsrId.findAll({
        where: {
            main_status: 'active',
            main_id: main_id,
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: CsrContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active'
                },
                
            },{
                model: CsrAttachment,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    attachment_cate: 'featured'
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

const get_csr_attachment_image = async (main_id, lang) =>{
    if (!lang) {
        lang = "";
    }
    const data_all = await CsrAttachment.findAll({
        attributes:[
            "attachment_id", "attachment_base", "attachment_cate", "attachment_type", "attachment_link",
            "attachment_title", "attachment_alt", "attachment_status", "sequence",
        ],
        where: {
            default_main_id: main_id,
            attachment_cate: 'image',
            attachment_status: 'active',
            lang_id: lang ? {
                [Op.eq]: lang
            } : {
                [Op.ne]: lang
            },
        },order: [
            ['sequence', 'ASC'],
        ],
        raw: true,
    });
    return data_all;
}


exports.getCsrAll = async (req, res, next) => {
    try {
        const {lang, month  } = req.body;
        const siteSetting = await siteSettings(lang);
        const data_meta = [];
        /* Meta */
        data_meta.push({
            meta_title: siteSetting[0]['content_title'], 
            meta_description: siteSetting[0]['content_description'],
            meta_keyword: siteSetting[0]['content_keyword'],
            page_title: siteSetting[0]['content_title'],
        });
        /* End Meta */

        // --------  Get Highlight CSR ---------- //    
        const rs_highlight_csr_content = await get_highlight_csr_content(lang);
        if(rs_highlight_csr_content[0]){
            for (const [key_highlight, value_highlight] of Object.entries(rs_highlight_csr_content)) {  
                const rs_url_rewrite = await get_url_rewrite(value_highlight['CsrContents.contentRewriteId']);
                value_highlight['urlRewrite']  =  url_link(rs_url_rewrite[0]['targetPath']);

                // ----------- ตัด url ภาษาออก -----------//
                // const thumbnailLink  = cut_path_link(rs_url_rewrite[0]['targetPath'], lang);
                // ----------- ตัด url ภาษาออก -----------//

                const rs_csr_attachment = await get_csr_attachment_featured(value_highlight['mainId'], lang);
                value_highlight['thumbnailLink'] = old_attachment_link('images', 'csr', rs_csr_attachment[0]['attachment_base']);

                value_highlight['CsrAttachments.attachmentAlt'] = (value_highlight['CsrAttachments.attachmentAlt'] !== null) ? value_highlight['CsrAttachments.attachmentAlt'] : value_highlight['CsrContents.contentSubject'];
                value_highlight['CsrAttachments.attachmentTitle'] = (value_highlight['CsrAttachments.attachmentTitle'] !== null) ? value_highlight['CsrAttachments.attachmentTitle'] : value_highlight['CsrContents.contentSubject'];


                const rs_highlight_cut_tag = striptags(value_highlight['CsrContents.contentDetail']);
                const data_rs_highlight_cut_tag = rs_highlight_cut_tag.substr(0,250);
                value_highlight['contentDetailNew']= data_rs_highlight_cut_tag+'...';
                // res.status(200).send(value_highlight );
            }
        }
        // -------- End Get Highlight CSR ---------- //
        console.log(rs_highlight_csr_content);
        res.status(200).send(rs_highlight_csr_content );
    } catch (error) {
        next(error);
    }
};

exports.getCsrById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { lang  } = req.body;

        // ========== Extra Code ========== //
        const rs_csr_content = await get_csr_content(id, null ,lang);
        //----------- Contents CSR --------------//
        if(rs_csr_content[0]){
            for (const [key_csr_content, value_csr_content] of Object.entries(rs_csr_content)) {
                const rs_url_rewrite = await get_url_rewrite(value_csr_content['CsrContents.contentRewriteId']);
                value_csr_content['urlRewrite']  =  url_link(rs_url_rewrite[0]['targetPath']);
                // value_csr_content['thumbnailLink'] = old_attachment_link('images', 'csr', value_csr_content['CsrAttachments.attachmentBase']);
                value_csr_content['CsrAttachments.attachmentAlt'] = (value_csr_content['CsrAttachments.attachmentAlt'] !== null) ? value_csr_content['CsrAttachments.attachmentAlt'] : value_csr_content['CsrContents.contentSubject'];
                value_csr_content['CsrAttachments.attachmentTitle'] = (value_csr_content['CsrAttachments.attachmentTitle'] !== null) ? value_csr_content['CsrAttachments.attachmentTitle'] : value_csr_content['CsrContents.contentSubject'];
                // value_csr_content['CsrAttachments.contentDatetime'] = date_format_lang(value_csr_content['CsrAttachments.contentDatetime'],lang);
            }
        }
        //----------- End Contents CSR --------------//

        //----------- Gallery CSR --------------//
        const rs_csr_attachment_image = await get_csr_attachment_image(id, lang);
        if(rs_csr_attachment_image[0]){
            for (const [key_csr_content_image, value_csr_content_image] of Object.entries(rs_csr_attachment_image)) {
                value_csr_content_image['thumbnail_link'] = old_attachment_link('images', 'csr', value_csr_content_image['attachment_base']);
				value_csr_content_image['attachment_alt'] = (value_csr_content_image['attachment_alt']  !== null) ? value_csr_content_image['attachment_alt'] : rs_csr_content[0]['CsrContents.contentSubject'];
				value_csr_content_image['attachment_title'] = (value_csr_content_image['attachment_title']  !== null) ? value_csr_content_image['attachment_title']: rs_csr_content[0]['CsrContents.contentSubject'];
            }
            rs_csr_content[0]['gallery'] = rs_csr_attachment_image;
        }
        //----------- End Gallery CSR --------------//

        // ========== End Extra Code ========== //
        res.status(200).send(rs_csr_content[0]);

    } catch (error) {
        next(error);
    }
};
