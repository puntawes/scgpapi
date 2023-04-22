const { Branch, sequelize } = require("../models");
const { Op } = require("sequelize");

const sequelizer = require('../config/db');
const nodemailer = require('nodemailer');






// exports.getCountry = async (req, res, next) => {
//     try {
    
//         sequelizer.query(`
//         SELECT DISTINCT country,lang_id,status  
//         FROM we_scg.branch
//          where lang_id='en' 
//          and status ='active'
//          ;
//     `).then(([data])=>{
//       res.json({
//         success: true,
//         data: data
//       })
//     })
//     .catch((err)=>{
//       res.json({
//         success: false,
//         message: err,
//       })
//     })

//        // res.status(200).send(rs_highlight_csr_content );
//     } catch (error) {
//         next(error);
//     }
// };

// $business = Branch::select('country','province','branch_title','lang_id','status','lat_lng')
// ->distinct()
// ->where('lang_id',$Lang)
// ->where('status','active')
// ->whereNotNull('branch_title')
// ->where('country',$country_name)
// ->get();

exports.getBusiness = async (req, res, next) => {
    try {
        let country_name=req.body.country_name;  
        sequelizer.query(`
        SELECT DISTINCT country,province,branch_title,lang_id,status,lat_lng  
        FROM we_scg.branch
         where lang_id='en'
         and status ='active' and   branch_title IS NOT NULL    and  country ='`+country_name+ `'
    `).then(([data])=>{
      res.json({
        success: true,
        data: data
      })
    })
    .catch((err)=>{
      res.json({
        success: false,
        message: err,
      })
    })

       // res.status(200).send(rs_highlight_csr_content );
    } catch (error) {
        next(error);
    }
};

// $provice = Branch::select('country','province','lang_id','status')
// ->distinct()
// ->where('lang_id',$Lang)
// ->where('status','active')
// ->whereNotNull('province')
// ->where('country',$country_name)
// ->get();


exports.getContact = async (req, res, next) => {
    try {
        let country_name=req.body.country_name;  
        sequelizer.query(`
        SELECT DISTINCT country,province,lang_id,status,lat_lng
        FROM we_scg.branch
         where lang_id='en'
         and status ='active'
          and   branch_title IS NOT NULL and  country ='`+country_name+ `'
    `).then(([data])=>{
      res.json({
        success: true,
        data: data
      })
    })
    .catch((err)=>{
      res.json({
        success: false,
        message: err,
      })
    })

       // res.status(200).send(rs_highlight_csr_content );
    } catch (error) {
        next(error);
    }
};


// $business = Branch::select('province','branch_title','lang_id','status','lat_lng')
// ->distinct()
// ->where('lang_id',$Lang)
// ->where('status','active')
// ->whereNotNull('branch_title')
// ->where('province',$provice)
// ->get();

exports.getCompany = async (req, res, next) => {
    try {
        let province=req.body.province;  
        sequelizer.query(`
        SELECT DISTINCT country,branch_title,province,lang_id,status  
        FROM we_scg.branch
         where lang_id='en'
         and status ='active'
          and   branch_title IS NOT NULL and  province ='`+province+ `'
    `).then(([data])=>{
      res.json({
        success: true,
        data: data
      })
    })
    .catch((err)=>{
      res.json({
        success: false,
        message: err,
      })
    })

       // res.status(200).send(rs_highlight_csr_content );
    } catch (error) {
        next(error);
    }
};

const getDistinctCountryBranch = async (select, lang) =>{
  const data_all = await Branch.findAll({
        attributes:[
           `${select}`,
          ],
          group: ['country'],
        where: {
          lang_id: lang ? {
              [Op.eq]: lang
          } : {
              [Op.ne]: lang
          },
            status: 'active',
            country: {
              [Op.ne]: null
            },
        }, 
        order: [
          ['country', 'DESC'],
        ],
        raw: true,
    });


    return data_all;
}

const getDistinctBranch = async (select, lang, country) =>{
  const data_all = await Branch.findAll({
          attributes:[
           `${select}`
          ],
          group: [`${select}`],

        where: {
          lang_id: lang ? {
              [Op.eq]: lang
          } : {
              [Op.ne]: lang
          },
            status: 'active',
            province: {
              [Op.ne]: null
            },
            country: country,
        },
        order: [
          [`${select}`, 'ASC'],
        ],
        
        raw: true,
    });


    return data_all;
}

const getDistinctBranchTitle = async (select, lang, countrys, provinces) =>{
  const data_all = await Branch.findAll({
          attributes:[
           `${select}`
          ],
          group: [`${select}`],

        where: {
          lang_id: lang ? {
              [Op.eq]: lang
          } : {
              [Op.ne]: lang
          },
            status: 'active',
            province: provinces,
            country: countrys,
        },
        order: [
          [`${select}`, 'ASC'],
        ],
        
        raw: true,
    });


    return data_all;
}


exports.getCountry = async (req, res, next) => {
  try {
  
    const {  lang  } = req.body;
    const rs_branch_province = await getDistinctCountryBranch('country', lang);

    res.status(200).send({'status':true,'result': rs_branch_province} );

  } catch (error) {
      next(error);
  }
};

exports.getProvince = async (req, res, next) => {
  try {
  
    const { country, lang  } = req.body;
    dataAll = [];
    const rs_branch_province = await getDistinctBranch('province', lang, country);
    const rs_branch_title = await getDistinctBranch('branch_title', lang, country);
    dataAll.push({
      province: rs_branch_province, 
      branch_title: rs_branch_title,
    });
    res.status(200).send({'status':true,'result': dataAll} );

  } catch (error) {
      next(error);
  }
};


exports.getBranchTitle = async (req, res, next) => {
  try {
  
    const { lang, country, province  } = req.body;
    dataAll = [];
    const rs_branch_title = await getDistinctBranchTitle('branch_title', lang, country, province);
    dataAll.push({
      branch_title: rs_branch_title,
    });
    res.status(200).send({'status':true,'result': dataAll} );
  } catch (error) {
      next(error);
  }
};

exports.getEmail= async (req, res, next) => {
  
  try {
    let attachments_req = [];
    const { name,company,email,tel,address,country,custype,excountry,product,detail,file,typefile,namefile,lang} = req.body;

        if(typefile === "pdf"){
             attachments_req = {
                filename: namefile,
                content: file,
                encoding: 'base64',
              }
        }else{
            attachments_req = {
                  path: file
                }
            }
    let ResponEmail = await getAuthMail(name,company,email,tel,address,country,custype,excountry,product,detail,attachments_req,lang)
    res.status(200).send(ResponEmail);
  } catch (error) {
      console.log(error);
      next(error);
    
  } 
};

async function getAuthMail(name,company,email,tel,address,country,custype,excountry,product,detail,attachments_req,lang) {
  // สร้างออปเจ็ค transporter เพื่อกำหนดการเชื่อมต่อ SMTP และใช้ตอนส่งเมล
  let transporter = nodemailer.createTransport({
   host: 'mail.smtp2go.com',
   port: 587,
   secure: false, // true for 465, false for other ports
   auth: { // ข้อมูลการเข้าสู่ระบบ
     user: 'winter.co.th', // email user ของเรา
     pass: 'ptWA45gpagCo' // email password
   }
   
  })
  if(lang == 'en'){
    let info = await transporter.sendMail({
      from: '"SCG Packaging : Contact Us" <scgpackaging@scg.com>', // อีเมลผู้ส่ง
      to: `${email}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      subject: `SCG Packaging : Contact Us`, // หัวข้ออีเมล
      text: name, // plain text body
      html: ` <div>
              <h3>Contact Us</h3><br>
              <hr>
              <p>Interest: ${product}</p><br>
              <p>Name: ${name}</p><br>
              <p>Company: ${company}</p><br>
              <p>Address: ${address} ${country} ${excountry}</p><br>
              <p>Email: ${email}</p><br>
              <p>Phone Number: ${tel}</p><br>
              <p>Detail: ${detail}</p><br>
              <div>
      
            `, // html body
      attachments: [attachments_req]
      });
      if(info){
        return {status:'Ok',msg: 'Send Mail Successful'}
      }else{
        return {status:'fail',msg: 'Send Mail failed'}
        
      }
  }else{
    let info = await transporter.sendMail({
      from: '"SCG Packaging : ติดต่อสอบถาม" <scgpackaging@scg.com>', // อีเมลผู้ส่ง
      to: `${email}`, // อีเมลผู้รับ สามารถกำหนดได้มากกว่า 1 อีเมล โดยขั้นด้วย ,(Comma)
      subject: `SCG Packaging : ติดต่อสอบถาม`, // หัวข้ออีเมล
      text: name, // plain text body
      html: ` <div>
              <h3>ติดต่อสอบถาม</h3><br>
              <hr>
              <p>ความสนใจ: ${product}</p><br>
              <p>ชื่อ - สกุล: ${name}</p><br>
              <p>บริษัท: ${company}</p><br>
              <p>ที่อยู่: ${address} ${country} ${excountry}</p><br>
              <p>อีเมล: ${email}</p><br>
              <p>เบอร์โทรศัพท์: ${tel}</p><br>
              <p>รายละเอียด: ${detail}</p><br>
              <div>
            `,// html body
      attachments: [attachments_req]
      });
      if(info){
        return {status:'Ok',msg: 'ส่งเมล์เรียบร้อย'}
      }else{
        return {status:'fail',msg: 'ส่งเมล์ไม่สำเร็จ'}
      }
  }
    // log ข้อมูลการส่งว่าส่งได้-ไม่ได้

}
const getAllbranch= async () =>{
  const data_all = await Branch.findAll()
return data_all;
};

exports.getLatlng = async (req, res, next) => {
  try {
 

    const branch = await getAllbranch();

    res.status(200).send(branch);

  } catch (error) {
      next(error);
  }
};
