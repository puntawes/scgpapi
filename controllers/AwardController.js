const { AwardContent, AwardId, AwardAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, siteSettings } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');

const get_award_img = async (lang,mainId) => {
    const data_all = await AwardId.findAll({
        attributes: ['main_id'],
        where: {
            main_status: 'active',
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: AwardAttachment,
                attributes: ['attachment_base'],
                where: { 
                    lang_id:  lang,  // TH,EN
                    default_main_id: mainId
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
const get_Award_content = async (lang) =>{
    const data_all = await AwardId.findAll({
        where: {
            main_status: 'active',
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: AwardContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
                    content_shortdesc: null
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

exports.index = async (req, res, next) => {
    try {
        const {lang} = req.body;
        const data_award = await get_Award_content(lang);
        for (let i = 0; i < data_award.length; i++) {
            data_award[i]['main_id'] = await get_award_img(lang,data_award[i]['main_id'])
            for (let j = 0; j < data_award[i]['main_id'].length; j++) {
                data_award[i]['main_id'][j]['AwardAttachments.attachment_base'] = await old_attachment_link('images', 'award', data_award[i]['main_id'][j]['AwardAttachments.attachment_base'])
                
            }
        }
        res.status(200).send(data_award);
    } catch (error) {
        next(error);
    }
};
