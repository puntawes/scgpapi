const { PopupId, PopupContent, PopupAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link } = require("./Controllers");
const { Op } = require("sequelize");
const { format, formatRelative } = require("date-fns"); 
const { en, th } = require("date-fns/locale"); 
    const getPopup =  async (lang, date_now,date_start, date_end) => {
        const data_all = await PopupId.findAll({
            where: {
                
            },
            attributes: {exclude: ['update_by','update_date','update_ip','post_ip', 'main_id']},
            include: [
                {
                    model: PopupAttachment,
                    attributes: {exclude: ['updateBy','updateDate','updateIp']},
                    where: { 
                        langId:  lang,  // TH,EN
                    },
                },
                {
                    model: PopupContent,
                    where: { 
                        content_status: 'active',
                        lang_id:  lang,  // TH,EN
                        content_datetime_start: {
                            [Op.gte]: date_start,
                            [Op.lte]: date_now

                        },
                        content_datetime_end: {
                            [Op.gte]: date_now,
                            [Op.lte]: date_end
                        },
                    },
                },
            ],
            raw: true,
        });

        return data_all;
    };


    const getStartDateandEndDate = async (lang) => {
        const data_all = await PopupContent.findOne({
            attributes: ['content_id', 'main_id', 'lang_id', 'content_datetime_start', 'content_datetime_end', 'content_status'],
            where: {
                content_status: 'active',
                lang_id:  lang,  // TH,EN
            },
            raw: true,
        });

        return data_all;
    }

    exports.index = async (req, res, next) => {
        try {
            const { lang  } = req.query;
            
            const now = new Date();
            const GMT = 25200000+now.getTime()
            var date_now = format(
                GMT,
                "yyyy-MM-dd'T'HH:mm:ss'.00Z'",
            );
            
            const dataStartandEnd = await getStartDateandEndDate(lang);

            const data = await getPopup(lang, date_now,dataStartandEnd['content_datetime_start'], dataStartandEnd['content_datetime_end']);
            console.log(dataStartandEnd['content_datetime_start'].getTime());
            if(data[0]){
                for (const [key_popup, value_popup] of Object.entries(data)) {
                    value_popup['attachment_base_desktop_url'] = old_attachment_link('images', 'popup', value_popup['PopupAttachments.attachmentBaseDesktop']);
			        value_popup['attachment_base_mobile_url'] = old_attachment_link('images', 'popup', value_popup['PopupAttachments.attachmentBaseMobile']);
                }
            }
            res.status(200).send(data);
        } catch (error) {
            next(error);
        }
    };
    

