const { Branch, sequelize } = require("../models");
const { Op } = require("sequelize");
const striptags = require("striptags");

const get_all = async (select, con1, con2, lang) => {
  const data_all = await Branch.findAll({
    where: {
      status: "active",
      lang_id: lang,
      [select]: { [Op.ne]: null },
    },
    group: select,
  });
  return data_all;
};

const get_seperate = async (countryi, provincei, companyi, lang) => {
  const data_all = await Branch.findAll({
    where: {
      status: "active",
      lang_id: lang,
      country: countryi ? { [Op.eq]: countryi } : { [Op.ne]: "" },
      province: provincei ? { [Op.eq]: provincei } : { [Op.ne]: "" },
      branch_title: companyi ? { [Op.eq]: companyi } : { [Op.ne]: "" },
    },
  });
  return data_all;
};

exports.getCountryV2 = async (req, res, next) => {
  const { country, province, company, lang } = req.body;
  if (!country && !province && !company) {
    try {
      const country_data = await get_all("country", lang);
      const province_data = await get_all("province", lang);
      const company_data = await get_all("branch_title", lang);
      res.status(200).send({ country_data, province_data, company_data });
    } catch (error) {
      next(error);
    }
  } else if (country && !province && !company) {
    try {
      const province_data = await get_seperate(country, province, company, lang);
      const company_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ province_data, company_data });
    } catch (error) {
      next(error);
    }
  } else if (!country && province && !company) {
    try {
      const country_data = await get_seperate(country, province, company, lang);
      const company_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ country_data, company_data });
    } catch (error) {
      next(error);
    }
  } else if (!country && !province && company) {
    try {
      const country_data = await get_seperate(country, province, company, lang);
      const province_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ country_data, province_data });
    } catch (error) {
      next(error);
    }
  } else if (country && province && !company) {
    try {
      const company_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ company_data });
    } catch (error) {
      next(error);
    }
  } else if (country && !province && company) {
    try {
      const province_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ province_data });
    } catch (error) {
      next(error);
    }
  } else if (!country && province && company) {
    try {
      const country_data = await get_seperate(country, province, company, lang);
      res.status(200).send({ country_data });
    } catch (error) {
      next(error);
    }
  } else {
    try {
      const branch_data = await get_seperate(country, province, company, lang);
      res.status(200).send(branch_data);
    } catch (error) {
      next(error);
    }
  }
};
