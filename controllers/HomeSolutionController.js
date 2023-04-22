const { SolutionCategoryId, SolutionCategoryContent, SolutionCategoryAttachment, sequelize } = require("../models");
const { getPageContent, old_attachment_link, get_url_rewrite, url_link } = require("./Controllers");
const striptags = require('striptags');

    const get_all_solution_category_content =  async (lang) => {
        const data_all = await SolutionCategoryId.findAll({
            where: {
                main_status: 'active',
            },
            order: [
                ['sequence', 'ASC'],
            ],
            include: [
                {
                    model: SolutionCategoryContent,
                    attributes: {
                        exclude: ['updateBy','updateDate','updateIp'],
                        include: [
                            [
                              sequelize.fn
                              (
                                "DATE_FORMAT", 
                                sequelize.col("content_datetime"), 
                                "%d/%b/%Y"
                              ),
                              "contentDatetime",
                            ],
                          ],    
                    },
                    where: { 
                        lang_id:  lang,  // TH,EN
                        content_status: 'active'
                    },
                },
            ],
            raw: true,
        });
        return data_all;
    };

  
    const get_solution_category_attachment_featured =  async (main_id, lang) => {
        const data_all = await SolutionCategoryAttachment.findAll({
            attributes: [
                "attachmentId", 'defaultMainId',"attachmentBase", "attachmentCate", "attachmentType", "attachmentLink", 
                "attachmentTitle",  'attachmentAlt', 'attachmentStatus'
            ],
            where: {
                default_main_id: main_id,
                lang_id:  lang,
                attachment_cate: 'featured',
                attachment_status: 'active',
            },
            raw: true,
        });
        return data_all;
    };

    const get_solution_category_attachment_image =  async (main_id, lang) => {
        const data = await SolutionCategoryAttachment.findAll({
            attributes: [
                "attachmentId", 'defaultMainId',"attachmentBase", "attachmentCate", "attachmentType", "attachmentLink", 
                "attachmentTitle",  'attachmentAlt', 'attachmentStatus'
            ],
            where: {
                default_main_id: main_id,
                lang_id:  lang,
                attachment_cate: 'image',
                attachment_status: 'active',
            },
            raw: true,
        });
        return data;
    };


    exports.index = async (req, res, next) => {
        try {
            const {page, lang  } = req.body;
            const solution_category = await get_all_solution_category_content(lang);
            const rs_solution_attachment = [];
            if (solution_category !== "") {

                for (const [key, value] of Object.entries(solution_category)) {

                    const solution_category_attachment = await get_solution_category_attachment_featured(value['mainId'], lang);

                    const solution_category_cut_tag = striptags(String(value['SolutionCategoryContents.contentShortdesc']));
                    value['contentShortdescNew'] = solution_category_cut_tag;
                    if(solution_category_attachment && (solution_category_attachment[0]['attachmentBase'] === value['SolutionCategoryContents.contentThumbnail'])) {
                        value['thumbnailLink'] = await old_attachment_link('images', 'solution_category', solution_category_attachment[0]['attachmentBase']);
                    }

                    const solution_category_attachment_image = await get_solution_category_attachment_image(value['mainId'], lang, 'image');
                    if(solution_category_attachment_image){
                        for (const [key_image, value_image] of Object.entries(solution_category_attachment_image)) {
                            value_image['thumbnailLink'] = await old_attachment_link('images', 'solution_category',value_image['attachmentBase']);
                        }
                        value['gallery'] = solution_category_attachment_image;
                    }
                    const rs_url_rewrite = await get_url_rewrite(value['SolutionCategoryContents.contentRewriteId']);
                    value['url_rewrite'] = await url_link(rs_url_rewrite[0]['targetPath']);

                    rs_solution_attachment.push({...value});
                }

            }
            res.status(200).send(rs_solution_attachment);
        } catch (error) {
            next(error);
        }
    };
    

