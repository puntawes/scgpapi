const { ManagementStructureAttachment, ManagementStructureContent, ManagementStructureId, ManagementLifeAtScgpId, ManagementLifeAtScgpContent, ManagementLifeAtScgpAttachment, sequelize, SystemUrlRewrite } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link, date_format_lang, cut_path_link, siteSettings } = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require('striptags');

const get_management_content = async (lang, contentCategory, attachmentCate) => {
    const data_all = await ManagementStructureId.findAll({
        attributes: ['sequence'],
        where: {
            main_status: 'active'
        },
        include: [
            {
                model: ManagementStructureContent,
                attributes: ['main_id', 'contentTitle', 'content_detail_position', 'content_category', 'content_rewrite_id'],
                where: {
                    lang_id: lang,  // TH,EN
                    content_category: contentCategory,
                    content_status: "active"
                },

            }, {
                model: ManagementStructureAttachment,
                attributes: ['attachmentBase'],
                where: {
                    lang_id: lang,  // TH,ENw
                    attachment_cate: attachmentCate
                },
            }

        ],
        order: [
            ['sequence', 'ASC'],
        ],
        raw: true,
    });
    return data_all;
}
const get_management_content_by_idurl = async (lang, contentCategory, attachmentCate, rewriteId) => {
    const data_all = await ManagementStructureId.findAll({
        attributes: ['sequence'],
        where: {
            main_status: 'active'
        },
        include: [
            {
                model: ManagementStructureContent,
                attributes: ['content_rewrite_id', 'main_id','content_status','lang_id'],
                where: {
                    lang_id: lang,
                    content_category: contentCategory,
                    content_status: "active",
                    content_rewrite_id: rewriteId
                },

            }, {
                model: ManagementStructureAttachment,
                attributes: ['attachmentBase', 'lang_id'],
                where: {
                    lang_id: lang,
                    attachment_cate: attachmentCate,
                    attachment_status: 'active'
                },
            }

        ],
        order: [
            ['sequence', 'ASC'],
        ],
        raw: true,
    });
    return data_all;
}
const get_main_id_url = async (id, contentCategory, lang) => {
    const data_all = await ManagementStructureContent.findAll({
        attributes: ['content_rewrite_id'],
        where: {
            main_id: id,
            content_category: contentCategory,
            content_status: "active",
            lang_id: lang
        },
        raw: true,
    });
    return data_all;
}
const get_url_by_path_name = async (pathName) => {
    const data_all = await SystemUrlRewrite.findAll({
        attributes: ['url_rewrite_id'],
        where: {
            target_main_path: pathName
        },
        raw: true,
    });
    return data_all;
}
// const get_life_content = async (lang) => {
//     const data_all = await ManagementLifeAtScgpId.findAll({
//         attributes: ['sequence'],
//         where: {
//             main_status: 'active'
//         },
//         include: [
//             {
//                 model: ManagementLifeAtScgpContent,
//                 attributes: ['contentSubject', 'contentShortdesc', 'contentDetailPosition', 'contentThumbnail'],
//                 where: {
//                     lang_id: lang,  // TH,EN
//                     content_status: 'active',
//                 },
//             }
//         ],
//         order: [
//             ['sequence', 'ASC'],
//         ],
//         raw: true,
//     });
//     return data_all;
// }

exports.index = async (req, res, next) => {
    try {
        const { lang, contentCategory, attachmentCate } = req.body;
        const data_management = await get_management_content(lang, contentCategory, attachmentCate);
        console.log(data_management);
        for (let i = 0; i < data_management.length; i++) {
            data_management[i]['urlTh'] = await get_main_id_url(data_management[i]['ManagementStructureContents.main_id'], contentCategory, 'th')
            data_management[i]['urlEn'] = await get_main_id_url(data_management[i]['ManagementStructureContents.main_id'], contentCategory, 'en')
            if (data_management[i]['urlTh'].length > 0) {
                data_management[i]['urlTh'] = await get_url_rewrite(data_management[i]['urlTh'][0]['content_rewrite_id'])
            } else {
                data_management[i]['urlTh'] = [{ targetMainPath: data_management[i]['urlEn'][0]['targetMainPath'] }]
            }
            if (data_management[i]['urlEn'].length > 0) {
                data_management[i]['urlEn'] = await get_url_rewrite(data_management[i]['urlEn'][0]['content_rewrite_id'])
            } else {
                data_management[i]['urlEn'] = [{ targetMainPath: data_management[i]['urlTh'][0]['targetMainPath'] }]
            }
            console.log(data_management[i]['urlEn'][0]);
            data_management[i]['ManagementStructureAttachments.attachmentBase'] = await old_attachment_link('images', 'management_structure', data_management[i]['ManagementStructureAttachments.attachmentBase'])
            newUrl = []
        }
        res.status(200).send(data_management);
    } catch (error) {
        next(error);
    }
};
// exports.getLifeofscgp = async (req, res, next) => {
//     try {
//         const { lang } = req.body;
//         const data_management = await get_life_content(lang)
//         for (let i = 0; i < data_management.length; i++) {
//             data_management[i]['ManagementLifeAtScgpContents.contentThumbnail'] = await old_attachment_link('images', 'management_life_at_scgp', data_management[i]['ManagementLifeAtScgpContents.contentThumbnail'])
//         }
//         res.status(200).send(data_management);
//     } catch (error) {
//         next(error);
//     }
// };
exports.getManagementByPathname = async (req, res, next) => {
    try {
        const { pathName, lang, contentCategory, attachmentCate } = req.body;
        const data_url = await get_url_by_path_name(pathName)

        let data_management = await get_management_content_by_idurl(lang, contentCategory, attachmentCate, data_url[0]['url_rewrite_id'])
        if (data_management.length <= 0) {
            if (lang == 'en' || lang == 'EN') {
                data_management = await get_management_content_by_idurl('en', contentCategory, attachmentCate, data_url[0]['url_rewrite_id'])
            } else {
                data_management = await get_management_content_by_idurl('th', contentCategory, attachmentCate, data_url[0]['url_rewrite_id'])
            }
        }
        let dataUrl = []
        for (let i = 0; i < data_management.length; i++) {
            data_management[i]['ManagementStructureAttachments.attachmentBase'] = await old_attachment_link('images', 'management_structure', data_management[i]['ManagementStructureAttachments.attachmentBase'])
            data_management[i]['urlTh'] = await get_main_id_url(data_management[i]['ManagementStructureContents.main_id'], contentCategory, 'th')
            if (data_management[i]['urlTh'].length > 0) {
                data_management[i]['urlTh'] = await get_url_rewrite(data_management[i]['urlTh'][0]['content_rewrite_id'])
            } else {
                data_management[i]['urlTh'] = []
            }
            data_management[i]['urlEn'] = await get_main_id_url(data_management[i]['ManagementStructureContents.main_id'], contentCategory, 'en')
            if (data_management[i]['urlEn'].length > 0) {
                data_management[i]['urlEn'] = await get_url_rewrite(data_management[i]['urlEn'][0]['content_rewrite_id'])
            } else {
                data_management[i]['urlEn'] = []
            }
            if (contentCategory == 'BOARD_OF_DIRECTORS') {
                if (data_management[i]['urlEn'].length > 0) {
                    data_management[i]['urlEn'][0]['targetPath'] = `en/board/${data_management[i]['urlEn'][0]['targetMainPath']}`
                } else {
                    data_management[i]['urlEn'] = [{ targetPath: `en/board/${data_management[i]['urlTh'][0]['targetMainPath']}` }]
                }
                if (data_management[i]['urlTh'].length > 0) {
                    data_management[i]['urlTh'][0]['targetPath'] = `th/board/${data_management[i]['urlTh'][0]['targetMainPath']}`
                } else {
                    data_management[i]['urlTh'] = [{ targetPath: `th/board/${data_management[i]['urlEn'][0]['targetMainPath']}` }]
                }
            } else {
                if (data_management[i]['urlEn'].length > 0) {
                    data_management[i]['urlEn'][0]['targetPath'] = `en/management-team/${data_management[i]['urlEn'][0]['targetMainPath']}`
                } else {
                    data_management[i]['urlEn'] = [{ targetPath: `en/management-team/${data_management[i]['urlTh'][0]['targetMainPath']}` }]
                }
                if (data_management[i]['urlTh'].length > 0) {
                    data_management[i]['urlTh'][0]['targetPath'] = `th/management-team/${data_management[i]['urlTh'][0]['targetMainPath']}`
                } else {
                    data_management[i]['urlTh'] = [{ targetPath: `th/management-team/${data_management[i]['urlEn'][0]['targetMainPath']}` }]
                }
            }
        }
        res.status(200).send(data_management);
    } catch (error) {
        next(error);
    }
};
