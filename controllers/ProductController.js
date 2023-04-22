const {
  ProductAttachment,
  ProductSubCategoryId,
  ProductSubCategoryContent,
  ProductSubCategoryAttachment,
  ProductId,
  ProductGroupId,
  ProductGroupContent,
  ProductGroupAttachment,
  ProductContent,
  sequelize,
  ProductCategoryContent,
  SystemUrlRewrite,
} = require("../models");
const {
  getPageContent,
  old_attachment_link,
  get_url_rewrite,
  url_link,
  date_format_lang,
  cut_path_link,
  siteSettings,
} = require("./Controllers");
const { Op } = require("sequelize");
const striptags = require("striptags");

const get_all_catproduct = async (lang) => {
  const data_all = await ProductCategoryContent.findAll({
    attributes: [
      "content_title",
      "content_rewrite_id",
      "content_external_link",
      "lang_id",
    ],
    where: {
      lang_id: lang,
      content_status: "active",
      content_rewrite_id: {
        [Op.ne]: null,
      },
    },
    raw: true,
  });
  return data_all;
};
const get_group_product = async (lang, subCategoryId) => {
  const data_all = await ProductGroupId.findAll({
    attributes: {
      exclude: ["updateBy", "updateDate", "updateIp"],
    },
    where: {
      main_status: "active",
    },
    order: [["main_id", "ASC"]],
    include: [
      {
        model: ProductGroupContent,
        attributes: {
          exclude: [
            "updateBy",
            "updateDate",
            "updateIp",
            "contentRewriteId",
            "contentDescription",
            "contentKeyword",
            "contentTitle",
            "contentExternal_link",
            "contentThumbnail",
          ],
        },
        where: {
          lang_id: lang, // TH,EN
          sub_category_id: subCategoryId,
        },
      },
    ],
    raw: true,
  });
  return data_all;
};
const get_group_product_content = async (
  lang,
  categoryId,
  subCategoryId,
  group_id
) => {
  const data_all = await ProductId.findAll({
    attributes: {
      exclude: ["updateBy", "updateDate", "updateIp"],
    },
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductContent,
        attributes: {
          exclude: [
            "updateBy",
            "updateDate",
            "updateIp",
            "contentRewriteId",
            "contentDescription",
            "contentKeyword",
            "contentTitle",
            "contentExternal_link",
            "contentThumbnail",
          ],
        },
        where: {
          lang_id: lang, // TH,EN
          category_id: categoryId,
          sub_category_id: subCategoryId,
          group_id: group_id,
        },
        order: [["sub_category_id", "ASC"]],
      },
    ],
    raw: true,
  });
  return data_all;
};
const get_group_product_content2 = async (
  lang,
  categoryId,
  subCategoryId,
  group_id
) => {
  const data_all = await ProductId.findAll({
    attributes: ["main_id"],
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductContent,
        attributes: ["contentSubject", "contentDetail", "contentExternal_link"],
        where: {
          lang_id: lang, // TH,EN
          category_id: categoryId,
          sub_category_id: subCategoryId,
          group_id: group_id,
        },
        order: [["sub_category_id", "ASC"]],
      },
    ],
    raw: true,
  });
  return data_all;
};
const get_group_product_content_img = async (
  lang,
  mainId,
  subCategoryId,
  group_id
) => {
  const data_all = await ProductId.findAll({
    attributes: ["main_id"],
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductAttachment,
        attributes: ["attachmentBase"],
        where: {
          lang_id: lang, // TH,EN
          default_main_id: mainId,
        },
        order: [["sequence", "ASC"]],
      },
    ],
    raw: true,
  });
  return data_all;
};
const get_subcatproduct_content = async (lang, categoryId) => {
  const data_all = await ProductSubCategoryId.findAll({
    attributes: ["main_id", "default_main_id"],
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductSubCategoryContent,
        attributes: [
          "content_title",
          "content_description",
          "content_rewrite_id",
        ],
        where: {
          lang_id: lang, // TH,EN
          categoryId: categoryId,
        },
      },
      {
        model: ProductSubCategoryAttachment,
        attributes: ["attachment_base"],
        where: {
          lang_id: lang, // TH,EN
          attachmentTitle: null,
        },
      },
    ],
    raw: true,
  });
  return data_all;
};
const get_slug_by_id = async (Id) => {
  const data_all = await SystemUrlRewrite.findAll({
    attributes: ["target_main_path"],
    where: {
      url_rewrite_id: Id,
    },
    raw: true,
  });
  return data_all;
};
const get_product_paper_detail = async (lang, categoryId, subCategoryId) => {
  const data_all = await ProductId.findAll({
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductContent,
        attributes: {
          exclude: ["updateBy", "updateDate", "updateIp"],
        },
        where: {
          lang_id: lang, // TH,EN
          category_id: categoryId,
          sub_category_id: subCategoryId,
        },
      },
      {
        model: ProductAttachment,
        attributes: {
          exclude: ["updateBy", "updateDate", "updateIp"],
        },
        where: {
          lang_id: lang, // TH,EN
          // attachmentTitle:{
          //     [Op.ne]: null
          //   }
        },
      },
    ],
    order: [["post_date", "DESC"]],

    raw: true,
  });
  return data_all;
};
const get_product_paper = async (lang, categoryId, subCategoryId) => {
  const data_all = await ProductId.findAll({
    where: {
      main_status: "active",
    },
    include: [
      {
        model: ProductContent,
        attributes: ["contentSubject"],
        where: {
          lang_id: lang, // TH,EN
          category_id: categoryId,
          sub_category_id: subCategoryId,
          [Op.or]: [{ group_id: null }, { group_id: 3 }, { group_id: 4 }],
        },
      },
    ],
    order: [["post_date", "DESC"]],

    raw: true,
  });
  return data_all;
};
const get_main_id_category = async (lang, contentSubject) => {
  const data_all = await ProductCategoryContent.findAll({
    attributes: ["mainId"],
    where: {
      content_rewrite_id: contentSubject,
    },
  });
  return data_all;
};
const get_main_id_sub_category = async (lang, contentSubject) => {
  const data_all = await ProductSubCategoryContent.findAll({
    attributes: ["mainId"],
    where: {
      content_rewrite_id: contentSubject,
    },
  });
  return data_all;
};
const get_slug = async (slug) => {
  const data = await SystemUrlRewrite.findAll({
    attributes: ["urlRewriteId"],
    where: {
      targetMainPath: slug,
    },
    raw: true,
  });
  return data[0]["urlRewriteId"];
};
const get_main_id_groupid = async (lang, subCategoryId) => {
  const data_all = await ProductGroupContent.findAll({
    where: {
      lang_id: lang,
      sub_category_id: subCategoryId,
    },
  });
  return data_all;
};
const get_main_id_subcatid = async (lang, slugId) => {
  const data_all = await ProductSubCategoryContent.findAll({
    attributes: ["mainId"],
    where: {
      lang_id: lang,
      content_rewrite_id: slugId,
    },
  });
  if (data_all.length == 0) {
    const data_slug = await ProductSubCategoryContent.findAll({
      attributes: ["mainId"],
      where: {
        content_rewrite_id: slugId,
      },
      raw: true,
    });
    return data_slug;
  } else {
    return data_all;
  }
};
const get_product_head = async (lang, categoryId, subCategoryId) => {
  const data_all = await ProductContent.findAll({
    attributes: ["contentSubject", "mainId"],
    where: {
      lang_id: lang,
      category_id: categoryId,
      sub_category_id: subCategoryId,
    },
  });
  return data_all;
};
const get_all_product_utm2 = async (lang, subCategoryId, group) => {
  const data_group = await get_group_product(lang, subCategoryId);
  const data_product = await get_group_product_content2(
    lang,
    data_group[0]["ProductGroupContents.categoryId"],
    data_group[0]["ProductGroupContents.subCategoryId"],
    group
  );
  for (let j = 0; j < data_product.length; j++) {
    data_product[j]["ProductAttachments.attachmentBase"] =
      await get_group_product_content_img(lang, data_product[j]["main_id"]);
  }
  for (let i = 0; i < data_product.length; i++) {
    if (data_product[i]["ProductAttachments.attachmentBase"].length > 1) {
      for (
        let k = 0;
        k < data_product[i]["ProductAttachments.attachmentBase"].length;
        k++
      ) {
        data_product[i]["ProductAttachments.attachmentBase"][k] =
          await old_attachment_link(
            "images",
            "product_and_services",
            data_product[i]["ProductAttachments.attachmentBase"][k][
              "ProductAttachments.attachmentBase"
            ]
          );
      }
    } else {
      data_product[i]["ProductAttachments.attachmentBase"] = [
        await old_attachment_link(
          "images",
          "product_and_services",
          data_product[i]["ProductAttachments.attachmentBase"][0][
            "ProductAttachments.attachmentBase"
          ]
        ),
      ];
    }
  }
  return data_product;
};
const get_data_mini = async (lang, categoryId, subCategoryId) => {
  const data_group = await get_product_head(lang, categoryId, subCategoryId);
  for (let i = 0; i < data_group.length; i++) {
    const data_image = await get_group_product_content_img(
      lang,
      data_group[i]["mainId"]
    );
    let image = [];
    data_group[i] = { ...data_group[i]["dataValues"], image };
    for (let j = 0; j < data_image.length; j++) {
      data_group[i]["image"].push(data_image[j]);
    }
  }
  for (let i = 0; i < data_group.length; i++) {
    if (data_group[i]["image"].length > 1) {
      for (let k = 0; k < data_group[i]["image"].length; k++) {
        data_group[i]["image"][k] = await old_attachment_link(
          "images",
          "product_and_services",
          data_group[i]["image"][k]["ProductAttachments.attachmentBase"]
        );
      }
    } else {
      data_group[i]["image"] = [
        await old_attachment_link(
          "images",
          "product_and_services",
          data_group[i]["image"][0]["ProductAttachments.attachmentBase"]
        ),
      ];
    }
  }
  return data_group;
};
exports.getAllCategory = async (req, res, next) => {
  try {
    const { lang } = req.body;
    const data_menu = await get_all_catproduct(lang);
    for (let k = 0; k < data_menu.length; k++) {
      let newlink = await get_slug_by_id(data_menu[k]["content_rewrite_id"]);
      data_menu[k]["content_rewrite_id"] = newlink[0]["target_main_path"];
    }
    res.status(200).send(data_menu);
  } catch (error) {
    next(error);
  }
};
exports.getSubcategory = async (req, res, next) => {
  try {
    const { lang, categoryId } = req.body;
    const data_subcat = await get_subcatproduct_content(lang, categoryId);
    for (let i = 0; i < data_subcat.length; i++) {
      data_subcat[i]["ProductSubCategoryAttachments.attachmentBase"] =
        await old_attachment_link(
          "images",
          "product_sub_category",
          data_subcat[i]["ProductSubCategoryAttachments.attachment_base"]
        );
    }
    for (let j = 0; j < data_subcat.length; j++) {
      let img = [];
      const data_mini = await get_data_mini(
        lang,
        categoryId,
        data_subcat[j]["main_id"]
      );
      let olddata = data_subcat[j];
      data_subcat[j] = [olddata, data_mini];
    }
    for (let k = 0; k < data_subcat.length; k++) {
      let newlink = await get_slug_by_id(
        data_subcat[k][0]["ProductSubCategoryContents.content_rewrite_id"]
      );
      data_subcat[k][0]["ProductSubCategoryContents.content_rewrite_id"] =
        newlink[0]["target_main_path"];
    }
    res.status(200).send(data_subcat);
  } catch (error) {
    next(error);
  }
};
exports.getSubcategoryPaper = async (req, res, next) => {
  try {
    const { lang, categoryId } = req.body;
    const data_subcat = await get_subcatproduct_content(lang, categoryId);
    for (let i = 0; i < data_subcat.length; i++) {
      data_subcat[i]["ProductSubCategoryAttachments.attachmentBase"] =
        await old_attachment_link(
          "images",
          "product_sub_category",
          data_subcat[i]["ProductSubCategoryAttachments.attachmentBase"]
        );
    }
    for (let j = 0; j < data_subcat.length; j++) {
      const mainId = data_subcat[j]["main_id"];
      data_subcat[j]["main_id"] = await get_product_paper(
        lang,
        categoryId,
        data_subcat[j]["main_id"]
      );
      for (let k = 0; k < data_subcat[j]["main_id"].length; k++) {
        data_subcat[j]["main_id"][k]["main_id"] =
          await get_group_product_content_img(
            lang,
            data_subcat[j]["main_id"][k]["main_id"]
          );
        if (data_subcat[j]["main_id"][k]["main_id"].length > 1) {
          for (
            let l = 0;
            l < data_subcat[j]["main_id"][k]["main_id"].length;
            l++
          ) {
            data_subcat[j]["main_id"][k]["main_id"][l] =
              await old_attachment_link(
                "images",
                "product_and_services",
                data_subcat[j]["main_id"][k]["main_id"][l][
                  "ProductAttachments.attachmentBase"
                ]
              );
          }
        } else {
          data_subcat[j]["main_id"][k]["main_id"] = [
            await old_attachment_link(
              "images",
              "product_and_services",
              data_subcat[j]["main_id"][k]["main_id"][0][
                "ProductAttachments.attachmentBase"
              ]
            ),
          ];
        }
        console.log(data_subcat[j]["main_id"][k]["main_id"]);
      }
    }

    res.status(200).send(data_subcat);
  } catch (error) {
    next(error);
  }
};
exports.getGroup = async (req, res, next) => {
  try {
    const { lang, subCategoryId } = req.body;
    const data_group = await get_group_product(lang, subCategoryId);
    res.status(200).send(data_group);
  } catch (error) {
    next(error);
  }
};
exports.getGroupProduct = async (req, res, next) => {
  try {
    const { lang, subCategoryId, group } = req.body;
    const data_group = await get_group_product(lang, subCategoryId);
    const data_product = await get_group_product_content(
      lang,
      data_group[0]["ProductGroupContents.categoryId"],
      data_group[0]["ProductGroupContents.subCategoryId"],
      group
    );
    for (let j = 0; j < data_product.length; j++) {
      data_product[j]["ProductAttachments.attachmentBase"] =
        await get_group_product_content_img(lang, data_product[j]["main_id"]);
    }
    for (let i = 0; i < data_product.length; i++) {
      if (data_product[i]["ProductAttachments.attachmentBase"].length > 1) {
        for (
          let k = 0;
          k < data_product[i]["ProductAttachments.attachmentBase"].length;
          k++
        ) {
          data_product[i]["ProductAttachments.attachmentBase"][k] =
            await old_attachment_link(
              "images",
              "product_and_services",
              data_product[i]["ProductAttachments.attachmentBase"][k][
                "ProductAttachments.attachmentBase"
              ]
            );
        }
      } else {
        data_product[i]["ProductAttachments.attachmentBase"] = [
          await old_attachment_link(
            "images",
            "product_and_services",
            data_product[i]["ProductAttachments.attachmentBase"][0][
              "ProductAttachments.attachmentBase"
            ]
          ),
        ];
      }
    }
    const title = data_product.map((val, key) => {
      if (val["ProductContents.groupId"] != null) {
        return {
          [val["ProductContents.contentSubject"].replace(/\s/g, "")]: {
            title: val["ProductContents.contentSubject"],
          },
        };
      }
    });
    const data = data_product.map((val, key) => {
      return {
        [val["ProductContents.contentSubject"].replace(/\s/g, "")]: {
          title: val["ProductContents.contentSubject"],
        },
      };
    });
    const obj_title = data_product.reduce((accumulator, value, index) => {
      return {
        ...accumulator,
        [data_product[index]["ProductContents.contentSubject"].replace(
          /\s/g,
          ""
        )]: { title: value["ProductContents.contentSubject"] },
      };
    }, {});
    const obj_image2 = data_product.reduce(
      (accumulator, value, index, data_image) => {
        return {
          ...accumulator,
          [data_product[index]["ProductContents.contentSubject"].replace(
            /\s/g,
            ""
          )]: {
            image: value["ProductAttachments.attachmentBase"],
            text: value["ProductContents.contentDetail"],
            main_id: value["main_id"],
          },
        };
      },
      {}
    );

    for (const [key, value] of Object.entries(obj_image2)) {
      obj_image2[key]["image"] = obj_image2[key]["image"].map((val, key) => {
        return { url: val };
      });
    }
    const data_real = {
      data: { title: obj_title, data: obj_image2 },
    };
    res.status(200).send(data_real);
  } catch (error) {
    next(error);
  }
};
exports.getDetailProductPaper = async (req, res, next) => {
  try {
    const { lang, categoryId, subCategoryId } = req.body;
    const group = null;
    const data_product = await get_product_paper_detail(
      lang,
      categoryId,
      subCategoryId
    );
    // const data_product = await get_group_product_content(lang, data_group[0]['ProductGroupContents.categoryId'], data_group[0]['ProductGroupContents.subCategoryId'], group)
    for (let j = 0; j < data_product.length; j++) {
      data_product[j]["ProductAttachments.attachmentBase"] =
        await get_group_product_content_img(lang, data_product[j]["main_id"]);
    }
    for (let i = 0; i < data_product.length; i++) {
      if (data_product[i]["ProductAttachments.attachmentBase"].length > 1) {
        for (
          let k = 0;
          k < data_product[i]["ProductAttachments.attachmentBase"].length;
          k++
        ) {
          data_product[i]["ProductAttachments.attachmentBase"][k] =
            await old_attachment_link(
              "images",
              "product_and_services",
              data_product[i]["ProductAttachments.attachmentBase"][k][
                "ProductAttachments.attachmentBase"
              ]
            );
        }
      } else {
        data_product[i]["ProductAttachments.attachmentBase"] = [
          await old_attachment_link(
            "images",
            "product_and_services",
            data_product[i]["ProductAttachments.attachmentBase"][0][
              "ProductAttachments.attachmentBase"
            ]
          ),
        ];
      }
    }
    const title = data_product.map((val, key) => {
      if (val["ProductContents.groupId"] != null) {
        return {
          [val["ProductContents.contentSubject"].replace(/\s/g, "")]: {
            title: val["ProductContents.contentSubject"],
          },
        };
      }
    });
    const data = data_product.map((val, key) => {
      return {
        [val["ProductContents.contentSubject"].replace(/\s/g, "")]: {
          title: val["ProductContents.contentSubject"],
        },
      };
    });
    const obj_title = data_product.reduce((accumulator, value, index) => {
      return {
        ...accumulator,
        [data_product[index]["ProductContents.contentSubject"].replace(
          /\s/g,
          ""
        )]: { title: value["ProductContents.contentSubject"] },
      };
    }, {});
    const obj_image2 = data_product.reduce(
      (accumulator, value, index, data_image) => {
        return {
          ...accumulator,
          [data_product[index]["ProductContents.contentSubject"].replace(
            /\s/g,
            ""
          )]: {
            image: value["ProductAttachments.attachmentBase"],
            text: value["ProductContents.contentDetail"],
            main_id: value["main_id"],
          },
        };
      },
      {}
    );

    for (const [key, value] of Object.entries(obj_image2)) {
      obj_image2[key]["image"] = obj_image2[key]["image"].map((val, key) => {
        return { url: val };
      });
    }
    const data_real = {
      data: { title: obj_title, data: obj_image2 },
    };
    res.status(200).send(data_real);
  } catch (error) {
    next(error);
  }
};
exports.getCategoryId = async (req, res, next) => {
  try {
    const { lang, slug } = req.body;
    console.log(lang);
    const data_subject = await get_slug(slug);
    const data_group = await get_main_id_category(lang, data_subject);
    console.log(data_subject);
    console.log(data_group);
    res.status(200).send(data_group[0]);
  } catch (error) {
    next(error);
  }
};
exports.getSubcategoryId = async (req, res, next) => {
  try {
    const { lang, slug } = req.body;
    const data_subject = await get_slug(slug);
    const data_group = await get_main_id_sub_category(lang, data_subject);
    res.status(200).send(data_group[0]);
  } catch (error) {
    res.status(200).send(error);
  }
};
exports.getSubcatId = async (req, res, next) => {
  try {
    const { lang, slug } = req.body;
    console.log("--------------------------------------------------------");
    console.log(slug);
    console.log(lang);
    console.log("--------------------------------------------------------");
    const slugId = await get_slug(slug);
    console.log(slugId);
    const data_subCategoryId = await get_main_id_subcatid(lang, slugId, slug);
    console.log(data_subCategoryId);
    const data_group = await get_main_id_groupid(
      lang,
      data_subCategoryId[0].mainId
    );
    console.log(data_group);
    const data_real = [];
    for (let i = 0; i < data_group.length; i++) {
      const data = await get_all_product_utm2(
        lang,
        data_subCategoryId[0].mainId,
        data_group[i]["mainId"]
      );
      data_real.push(data);
    }
    res.status(200).send(data_real);
  } catch (error) {
    next(error);
    console.log(error);
  }
};
exports.getGroupId = async (req, res, next) => {
  try {
    const { lang, contentSubject } = req.body;
    console.log(req.body);
    const data_group = await get_main_id_groupid(lang, contentSubject);
    res.status(200).send(data_group[0]);
  } catch (error) {
    next(error);
  }
};
exports.getProducthead = async (req, res, next) => {
  try {
    const { lang, categoryId, subCategoryId } = req.body;
    const data_group = await get_product_head(lang, categoryId, subCategoryId);

    for (let i = 0; i < data_group.length; i++) {
      const data_image = await get_group_product_content_img(
        lang,
        data_group[i]["mainId"]
      );
      let image = [];
      data_group[i] = { ...data_group[i]["dataValues"], image };
      for (let j = 0; j < data_image.length; j++) {
        data_group[i]["image"].push(data_image[j]);
      }
    }
    for (let i = 0; i < data_group.length; i++) {
      if (data_group[i]["image"].length > 1) {
        for (let k = 0; k < data_group[i]["image"].length; k++) {
          data_group[i]["image"][k] = await old_attachment_link(
            "images",
            "product_and_services",
            data_group[i]["image"][k]["ProductAttachments.attachmentBase"]
          );
        }
      } else {
        data_group[i]["image"] = [
          await old_attachment_link(
            "images",
            "product_and_services",
            data_group[i]["image"][0]["ProductAttachments.attachmentBase"]
          ),
        ];
      }
    }
    res.status(200).send(data_group);
  } catch (error) {
    next(error);
  }
};
