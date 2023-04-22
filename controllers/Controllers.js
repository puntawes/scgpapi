const {PageId, PageContent, SystemUrlRewrite, siteSettingsId, SiteSettingContent, Sequelize } = require("../models");
const { Op, STRING } = require("sequelize");
const PHPUnserialize = require('php-unserialize');
const { format, formatRelative } = require("date-fns"); 
const { en, th } = require("date-fns/locale"); 

    exports.siteSettings = async (lang) => {
        const data = await siteSettingsId.findAll({
            attributes: [ [Sequelize.col('SiteSettingContents.content_title'), 'content_title'],
            "SiteSettingContents.content_description", "SiteSettingContents.content_keyword"
            ],
            include: [{
                model: SiteSettingContent,
                attributes: [],
                where: { 
                    lang_id:  lang,  // TH,EN
                },
            }],
            raw: true,
        });
        return  data;
    }

    exports.date_format_lang = (date,lang) => {
       
        if(lang === 'TH'){
            var data = format(
                date,
                'dd/MMM/yyyy',
                {locale: th}
            );
        }else{
            var data = format(
                date,
                'dd/MMM/yyyy',
                {locale: en}
            );
        }
        return data;
    }


    exports.date_full_format_lang = (date,lang) => {
       
        if(lang === 'TH'){
            var data = format(
                date,
                'dd MMMM yyyy',
                {locale: th}
            );
        }else{
            var data = format(
                date,
                'dd MMMM yyyy',
                {locale: en}
            );
        }
        return data;
    }


    exports.get_search_url_rewrite = (target_path) => {
        const data =  SystemUrlRewrite.findAll({
            where:{
                // target_path: target_path,
                target_path: { [Op.like]: `%${target_path}%` },
            },
            raw: true,
        })
        return data;
    }

    exports.get_url_rewrite = (rewrite_id) => {
        const data =  SystemUrlRewrite.findAll({
            where:{
                url_rewrite_id: rewrite_id,
            },
            raw: true,
        })
        return data;
    }

    exports.url_link = (link) => {
        $base_url = 'https://scgpackagingweb-scgpackagingweb1.azurewebsites.net/';
        return $base_url+''+link;
	}
    
    exports.url_link_full = (link) => {
        return link;
	}

    exports.old_attachment_link = (type = 'images', class_name, file_name) => {
        if(file_name === "") {
            return '';
        }
        // ลิ้งค์เก่า
        let base_url = 'https://scgpackagingweb-scgpackagingweb1.azurewebsites.net/';
        // ลิ้งค์ใหม่
        // let base_url = 'https://scgpackagingweb-test.azurewebsites.net/'; 
        return base_url+'public/uploads/'+ class_name.toLowerCase() + '/' + type + '/' + file_name;
    }
    exports.newbyf_attachment_link = (type = 'images', class_name, file_name) => {
        if(file_name === "") {
            return '';
        }
        let base_url = 'https://scgpackagingweb-test.azurewebsites.net/';
        return base_url+'public/uploads/'+ class_name.toLowerCase() + '/' + type + '/' + file_name;
    }
    exports.getPageContent =  async (label_id, lang) => {
        if (!lang) {
            lang = ""
        }
        const  data_all = await PageId.findAll({
            where: {
                label_id: label_id, 
                },
                include: [{
                    model: PageContent,
                    attributes: ["lang_id","content_data"],
                    where: { 
                        lang_id: lang ? {
                            [Op.eq]: lang
                        } : {
                            [Op.ne]: lang
                        },
                    },
                }],
                raw: true,
            });
        

        if(data_all[0]){
            var data =  PHPUnserialize.unserialize(data_all[0]['PageContents.content_data'])
            return data;
        }            

    };
    
    exports.cut_path_link = (path_link, lang) => {
        if(lang == 'TH'){
            var findme_highlight = "h";
        }else if(lang == 'EN'){
            var findme_highlight = "n";
        }
        const pos_highlight =  path_link.indexOf(findme_highlight);
        const cut_link_highlight = path_link.substr(pos_highlight+1);

        return cut_link_highlight;
    }

    exports.calSkip = (page, size) => {
        return (page - 1) * size;
    };
      
    exports.calPage = (count, size) => {
        return Math.ceil(count / size);
    };