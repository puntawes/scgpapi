const { SustainabilityContent, SustainabilityId, SustainabilityAttachment, sequelize ,NewsId, NewsContent, NewsAttachment } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, siteSettings } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');


const get_sustainability_content = async (lang) =>{
    const data_all = await SustainabilityId.findAll({
        where: {
            main_status: 'active',
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: SustainabilityContent,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  'th',  // TH,EN
                    content_status: 'active'
                },
                
            },{
                model: SustainabilityAttachment,
                attributes: {
                    exclude: ['updateBy','updateDate','updateIp'],
                },
                where: { 
                    lang_id:  'th',  // TH,EN
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
const get_subtain = async (lang , contentCategory , subContentCategory) =>{
    const data_all = await NewsId.findAll({
        where: {
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
                    content_status: 'active',
                    content_category: contentCategory,
                    sub_content_category: subContentCategory
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
const get_subtain_attachment = async (defaultMainId) =>{
    const data_all = await NewsAttachment.findAll({
        attributes: ['attachment_base'],
        where: {
            default_main_id: defaultMainId,
            attachment_cate: 'image'
        },
        order: [
            ['sequence', 'DESC'],
        ],
        raw: true,
    });
    return data_all;
}
const get_subtain_attachment_fe = async (defaultMainId,lang) =>{
    const data_all = await NewsAttachment.findAll({
        attributes: ['attachment_base'],
        where: {
            lang_id: lang,
            default_main_id: defaultMainId,
            attachment_cate: 'featured'
        },
        order: [
            ['sequence', 'DESC'],
        ],
        raw: true,
    });
    return data_all;
}

exports.index = async (req, res, next) => {
    try {
        const {lang} = req.body;
        const stainability = await get_sustainability_content(lang);
        res.status(200).send(stainability);
    } catch (error) {
        next(error);
    }
};
exports.getSubtain = async (req, res, next) => {
    try {
        const {lang , content_category , sub_content_category} = req.body;
        const stainability = await get_subtain(lang, content_category , sub_content_category);
        for (let i = 0; i < stainability.length; i++) {
            stainability[i]['featured'] = await get_subtain_attachment_fe(stainability[i]['mainId'],lang);
            stainability[i]['featured'] = old_attachment_link('images', 'news', stainability[i]['featured'][0]['attachment_base']);
            console.log(stainability[i]['featured']);
            let img = await get_subtain_attachment(stainability[i]['mainId'])
            for (let j = 0; j < img.length; j++) {
                img[j] = old_attachment_link('images', 'news', img[j]['attachment_base']);
            }
            stainability[i]['img'] = img
        }
        res.status(200).send(stainability);
    } catch (error) {
        next(error);
    }
}
exports.getSubtainv2 = async (req, res, next) => {
    try {
        const {lang , content_category , sub_content_category} = req.body;
        const stainability = await get_subtain(lang, content_category , sub_content_category);
        for (let i = 0; i < stainability.length; i++) {
            let url = await get_url_rewrite(stainability[i]['NewsContents.contentRewriteId']);
            console.log(url[0]['targetMainPath']);
            stainability[i]['urlRewrite'] = 'news/' + url[0]['targetMainPath']
            stainability[i]['CsrAttachments.attachmentTitle'] = stainability[i]['NewsContents.contentSubject']
            stainability[i]['featured'] = await get_subtain_attachment_fe(stainability[i]['mainId'],lang);
            stainability[i]['thumbnailLink'] = old_attachment_link('images', 'news', stainability[i]['featured'][0]['attachment_base']);
            stainability[i]['CsrContents.langId'] = stainability[i]['NewsContents.langId']
            console.log(stainability[i]['featured']);
            let img = await get_subtain_attachment(stainability[i]['mainId'])
            for (let j = 0; j < img.length; j++) {
                img[j] = old_attachment_link('images', 'news', img[j]['attachment_base']);
            }
            stainability[i]['img'] = img
        }
        res.status(200).send(stainability);
    } catch (error) {
        next(error);
    }
}