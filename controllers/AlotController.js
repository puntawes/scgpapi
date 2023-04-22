const { AlotId, AlotContent, AlotAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, siteSettings, date_full_format_lang,
    calSkip, calPage } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');

const get_highlight_alot_content =  async (lang) => {
    const data_all = await AlotId.findAll({
        where: {
            main_status: 'active',
        },
        include: [
            {
                model: AlotContent,
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
const get_all_alot_content =  async (lang, year, first_alot, data_limit, data_offset) => {
    const data_all = await AlotId.findAndCountAll({
        where: {
            main_id: {[Op.ne]: first_alot},
            main_status: 'active',
            post_date: year ? {
                [Op.and]: [
                    sequelize.where(sequelize.fn('YEAR', sequelize.col('post_date')), year),
                ],
            } : {
                [Op.ne]: null
            }, 
        },
        include: [
            {
                model: AlotContent,
                where: { 
                    lang_id:  lang,  // TH,EN
                    content_status: 'active',
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

const get_alot_attachment_featured = async (main_id, lang)=>{
    if (!lang) {
        lang = ""
    }
    const data_all = await AlotAttachment.findAll({
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

const get_a_lot_attachment_file = async (main_id, lang)=>{
    if (!lang) {
        lang = ""
    }
    const data_all = await AlotAttachment.findAll({
        attributes: [
            "attachment_id", "attachment_base" , "attachment_cate", "attachment_type", 
            "attachment_link", "attachment_title", "attachment_alt", "attachment_status",
        ],
        where: {
            default_main_id: main_id,
            attachment_cate: 'file',
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


exports.getAlothighlight = async (req, res, next) => {
    try {
        const { lang, year} = req.body;

        const rs_alot = await get_highlight_alot_content(lang, year)

        data_alot_highlight = []; 
        if(rs_alot[0]){
            for (const [key_alot, value_alot] of Object.entries(rs_alot)) {
                const rs_alot_attachment = await get_alot_attachment_featured(value_alot['mainId'], lang);
                value_alot['thumbnailLink'] = old_attachment_link('images', 'a_lot', rs_alot_attachment[0]['attachment_base']);

                value_alot['attachmentAlt'] = (rs_alot_attachment[0]['attachment_alt'] !== null) ? rs_alot_attachment[0]['attachment_alt'] : value_alot['AlotContents.contentSubject'];
                value_alot['attachmentTitle'] = (rs_alot_attachment[0]['attachment_title'] !== null) ? rs_alot_attachment[0]['attachment_title'] : value_alot['AlotContents.contentSubject'];
                value_alot['AlotContents.contentDatetime'] = date_format_lang(value_alot['postDate'],lang);

                const rs_a_lot_file = await get_a_lot_attachment_file(value_alot['mainId'], lang);
                if(rs_a_lot_file[0]){
                    for (const [key_alot_file, value_alot_file] of Object.entries(rs_a_lot_file)) {old_attachment_link
                        value_alot_file['attachment_base_url'] = old_attachment_link('files', 'a_lot', value_alot_file['attachment_base']);
                    }
                }
				value_alot['file'] = rs_a_lot_file[0];
            }
        }
        // ======= data highlight ======= //
        data_alot_highlight.push(rs_alot.shift());
        // ======= end data highlight ======= //
        res.status(200).send({'highlight': data_alot_highlight});
    } catch (error) {
        next(error);
    }
};

exports.getAlotAll = async (req, res, next) => {
    try {
        const { lang, year, item_per_page, current_page } = req.body;
        const offset = calSkip(Number(current_page), Number(item_per_page));
        const first_alot = await get_highlight_alot_content(lang, year) // where not in first element of the array
        const rs_alot = await get_all_alot_content(lang, year, first_alot[0]['mainId'], Number(item_per_page),  Number(offset));
        const cal_page = calPage(Number(rs_alot.count ), Number(item_per_page)); // total page
        // ====== change name arrary ===== //
        rs_alot.data = rs_alot.rows;
        delete rs_alot.rows;
        // ====== change name arrary ===== //
        data_alot = []; 
        // rs_alot.totalpage = cal_page;
        // rs_alot.current_page = Number(current_page);
        // rs_alot.item_per_page = Number(item_per_page);
        if(rs_alot.data[0]){
            for (const [key_alot, value_alot] of Object.entries(rs_alot.data)) {
                const rs_alot_attachment = await get_alot_attachment_featured(value_alot['mainId'], lang);
                value_alot['thumbnailLink'] = old_attachment_link('images', 'a_lot', rs_alot_attachment[0]['attachment_base']);
                value_alot['attachmentAlt'] = (rs_alot_attachment[0]['attachment_alt'] !== null) ? rs_alot_attachment[0]['attachment_alt'] : value_alot['AlotContents.contentSubject'];
                value_alot['attachmentTitle'] = (rs_alot_attachment[0]['attachment_title'] !== null) ? rs_alot_attachment[0]['attachment_title'] : value_alot['AlotContents.contentSubject'];
                value_alot['contentDatetimeFull'] = date_full_format_lang(value_alot['postDate'],lang);
                value_alot['AlotContents.contentDatetime'] = date_format_lang(value_alot['postDate'],lang);
                const rs_a_lot_file = await get_a_lot_attachment_file(value_alot['mainId'], lang);
                if(rs_a_lot_file[0]){
                    for (const [key_alot_file, value_alot_file] of Object.entries(rs_a_lot_file)) {old_attachment_link
                        value_alot_file['attachment_base_url'] = old_attachment_link('files', 'a_lot', value_alot_file['attachment_base']);
                    }
                }
				value_alot['file'] = rs_a_lot_file[0];
            }
        }
        data_alot.push(rs_alot);
        res.status(200).send(rs_alot);

    } catch (error) {
        next(error);
    }
};
