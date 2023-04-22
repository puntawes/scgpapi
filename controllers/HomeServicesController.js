const { ProductCategoryId, ProductCategoryContent, ProductCategoryAttachment } = require("../models");
const { getPageContent, old_attachment_link,get_url_rewrite, url_link } = require("./Controllers");

    const get_product_category_content =  async (lang, main_id = null, content_id = null, cate = null) => {
        const data_all = await ProductCategoryId.findAll({
            where: {
                main_id: main_id,
                main_status: 'active',
            },
            attributes: {exclude: ['update_by','update_date','update_ip','post_ip']},
            include: [{
                model: ProductCategoryContent,
                attributes: {exclude: ['updateBy','updateDate','updateIp']},
                where: { 
                    content_id:  content_id,  
                    lang_id:  lang,  // TH,EN
                    content_type:  cate,  
                    content_status: 'active'
                },
            }],
            limit: 3,
            raw: true,
        });

        return data_all;
       
    };

    const get_product_category_attachment =  async (main_id, lang, content_thumbnail,content_subject,content_rewrite_id ) => {
        const data_all = await ProductCategoryAttachment.findAll({
            attributes: ["attachment_id", "attachment_base", "attachment_cate", "attachment_type", "attachment_link", 'attachment_title', 'attachment_alt', 'attachment_status'],
            where: {
                default_main_id: main_id, 
                lang_id:  lang,  // TH,EN
                attachment_status: 'active', 
            },
            raw: true,
        });

        if(data_all[0]['attachment_base'] === content_thumbnail) {
            data_all[0]['thumbnail_link'] = await old_attachment_link('images', 'product_category', data_all[0]['attachment_base']);
        }
        data_all[0]['attachment_alt'] = ( data_all[0]['attachment_alt'] !== null) ? data_all[0]['attachment_alt'] : content_subject;
        data_all[0]['attachment_title'] = ( data_all[0]['attachment_title'] !== null) ? data_all[0]['attachment_title'] : content_subject;
        const rs_url_rewrite = await get_url_rewrite(content_rewrite_id);
        data_all[0]['url_rewrite'] = url_link(rs_url_rewrite[0]['targetPath']);

        return data_all;
    };

    exports.index = async (req, res, next) => {
        try {
            const {page, lang  } = req.body;
            const getContent = await getPageContent(page, lang);
            const dataProduct = [];
            const rs_product_attachment = [];
            if (getContent['services'] !== "") {
                for (const [key, value] of Object.entries(getContent['services'])) {
                    var get_product_category_contents = await get_product_category_content(lang, value['main_id'], value['content_id'], 'services');
                    if(get_product_category_contents !== ''){
                        var data_rs_product_attachment =  await get_product_category_attachment(value['main_id'], lang, get_product_category_contents[0]['ProductCategoryContents.contentThumbnail'], get_product_category_contents[0]['ProductCategoryContents.contentSubject'],String(get_product_category_contents[0]['ProductCategoryContents.contentRewriteId']));      
                          for (const [key_category_contents, value_category_contents] of Object.entries(get_product_category_contents)) {
                             rs_product_attachment.push({...value_category_contents , product_attachment: data_rs_product_attachment});
                          }
                    }
                }
            }

            res.status(200).send(rs_product_attachment);
        } catch (error) {
            next(error);
        }
    };
    

