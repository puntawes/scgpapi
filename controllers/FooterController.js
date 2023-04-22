const { MembersManagementAttachment, MembersManagementContent, MembersManagementId, Branch, sequelize } = require("../models");
const { Op } = require("sequelize");
const { old_attachment_link } = require("./Controllers");

const get_members = async (lang) => {
    const data_all = await MembersManagementId.findAll({
        attributes: ['main_id', 'default_main_id'],
        where: {
            main_status: 'active'
        },
        order: [
            ['post_date', 'DESC'],
        ],
        include: [
            {
                model: MembersManagementContent,
                attributes: ['contentSubject', 'mainId'],
                where: {
                    lang_id: lang,
                    content_subject:{
                        [Op.ne]: null
                    }
                },
            }
        ],
        raw: true,
    });
    return data_all;
}
const get_members_img = async (id, lang) => {
    const data_all = await MembersManagementAttachment.findAll({
        attributes: ['attachmentBase', 'attachmentLink'],
        where: {
            default_main_id: id,
            lang_id: lang,
            attachment_status: 'active'
        },
        order: [
            ['sequence', 'ASC'],
        ],
        raw: true,
    });
    return data_all;
}

exports.getFooter = async (req, res, next) => {
    try {
        const { lang } = req.body;
        const rs_footer = await get_members(lang);
        for (let i = 0; i < rs_footer.length; i++) {
            rs_footer[i]['img'] = await get_members_img(rs_footer[i]['main_id'], lang);
            for (let j = 0; j < rs_footer[i]['img'].length; j++) {
                rs_footer[i]['img'][j]['attachmentBase'] = await old_attachment_link('images', 'members_management', rs_footer[i]['img'][j]['attachmentBase'])

            }
        }
        res.status(200).send(rs_footer);
    } catch (error) {
        next(error);
    }
};