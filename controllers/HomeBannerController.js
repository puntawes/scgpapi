const { hero_banner_page, hero_banner_content, hero_banner_id, hero_banner_attachment, siteSettingsId, SiteSettingContent,
        Sequelize } = require("../models");
const { getPageContent, old_attachment_link, siteSettings ,newbyf_attachment_link  } = require("./Controllers");

    
    const get_hero_banner_attachment_by_sequence =  async (main_id, lang, callback = null) => {
        const rs_hero_banner_attachment = await hero_banner_attachment.findAll({
            where: {
                default_main_id: main_id, 
                lang_id: lang,
                attachment_status: 'active',
            },
            order: [
                ['sequence', 'ASC'],
            ],
            raw: true,
        });
        const site_setting = await siteSettings(lang);
        const get_data_hero_banner_attachment = [];
        if(rs_hero_banner_attachment[0]){
                rs_hero_banner_attachment.forEach((element, index) => {
                    if(element['attachment_cate'] === "image"){
                        var base_desktop_url = old_attachment_link('images/desktop', 'hero_banner', element['attachment_base_desktop']);
                        var base_mobile_url =  old_attachment_link('images/mobile', 'hero_banner', element['attachment_base_mobile']);
                        // var base_desktop_url = newbyf_attachment_link('images/desktop', 'hero_banner', element['attachment_base_desktop']);
                        // var base_mobile_url =  newbyf_attachment_link('images/mobile', 'hero_banner', element['attachment_base_mobile']);
                    }else if(element['attachment_cate'] === "youtube") {
                        //
                    }
                    if(element['attachment_link']) {
                        let _url = new URL(element['attachment_link']);
                        if(_url['protocol'] === '') {
                            var attachment_link  = '//' + element['attachment_link'];
                        }else {
                            var attachment_link  = element['attachment_link'];
                        }
                    }
                    if (element['attachment_alt'] === null && element['attachment_title'] === null) {
                        element['attachment_alt'] = site_setting[0].content_title;
                        element['attachment_title'] = site_setting[0].content_title;

                    }
                    get_data_hero_banner_attachment.push({...element , attachment_base_desktop_url: base_desktop_url, attachment_base_mobile_url: base_mobile_url, href_link: attachment_link });
                });
        }
        return get_data_hero_banner_attachment;
        if (typeof callback === 'function') callback();
    };

    exports.getHeroBannerHomePage = async (req, res, next) => {
        try {
            const { page, lang  } = req.body;
            const data = await hero_banner_page.findAll({
                attributes: [ 'hero_banner_contents.content_id', 
                        [Sequelize.col('hero_banner_contents.update_by'), 'content_update_by'], 
                        [Sequelize.col('hero_banner_contents.update_date'), 'content_update_date'], 
                        [Sequelize.col('hero_banner_contents.update_ip'), 'content_update_ip'], 
                            'hero_banner_contents.content_status',
                            'hero_banner_contents.hero_banner_id.main_id',
                            'hero_banner_contents.hero_banner_id.default_main_id',
                            'hero_banner_contents.hero_banner_id.post_by',
                            'hero_banner_contents.hero_banner_id.post_date',
                            'hero_banner_contents.hero_banner_id.post_ip',
                            'hero_banner_contents.hero_banner_id.update_by',
                            'hero_banner_contents.hero_banner_id.update_date',
                            'hero_banner_contents.hero_banner_id.update_ip',
                            'hero_banner_contents.hero_banner_id.main_status',
                            'hero_banner_contents.hero_banner_id.sequence',
                ],
                where: {
                    hero_banner_page_path: page, // home
                },
                include: [{
                    model: hero_banner_content,
                    attributes: [],
                    where: { 
                        lang_id:  lang,  // TH,EN
                        content_status:  'active', 
                    },
                    seperate: true,
                    include: {
                        model: hero_banner_id,
                        attributes: [],
                        where: { 
                            main_status:  'active', 
                        },
                    },
                }],
                raw: true,
            });
            // -------------- get_hero_banner_attachment_by_sequence  ------------ //
            const data_hero_banner = await get_hero_banner_attachment_by_sequence(data[0]['main_id'], lang, () => {            
            });
            // const data_real = []
            // const datenow = new Date(Date.now())
            // const GMT = 25200000+datenow.getTime()
            // for (let x = 0; x < data_hero_banner.length; x++) {
            //     if(data_hero_banner[x].attachment_date_time !== null){
            //         if(((data_hero_banner[x].attachment_date_time).getTime()) < (GMT) || isNaN((data_hero_banner[x].attachment_date_time).getTime())){
            //             data_real.push(data_hero_banner[x])
            //         }
            //     }
            // }
            // -------------- get_hero_banner_attachment_by_sequence  ------------ //
            res.status(200).send(data_hero_banner);
            // res.status(200).send([data, saw ]);
        } catch (error) {
            next(error);
        }
    };
    
