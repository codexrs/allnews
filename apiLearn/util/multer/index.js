var multer = require('multer');
let methodsFile = {
    'public/images/news': ['/admin/uploadImg'],
    'public/images/swiper': ['/admin/swiperImgUpload'],
    'public/images/batchUpload':['/admin/batchUpload'],
    'public/images/user': ['/admin/userImgUpload'],
    'public/images/admin': ['/admin/adminImgUpload'],
    'public/images/advert':['/admin/advertImgUpload']
}
var storage = multer.diskStorage({
    //将上传的文件存储在指定的位置（不存在的话需要手动创建）
    destination: function (req, file, cb) {
        console.log(req.originalUrl);
        let url = '';
        Object.entries(methodsFile).forEach(item => {
            if (item[1].indexOf(req.originalUrl) >= 0) {
                url = item[0];
            }
        })

        cb(null, url || 'public/images/admin')
    },
    //将上传的文件做名称的更改
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname)
    }
})
const upload = multer({ storage: storage })

module.exports = upload;