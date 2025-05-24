const express = require("express")
const  router = express.Router();
const userController = require('../controller/user')



router.get('/',userController.userHomeGet);
router.get('/about-us',userController.getAboutPage);
router.get('/downloads',userController.getDownloadPage);
router.get('/product-page',userController.getAllProduct);
router.get('/single-product/:id',userController.getSingleProduct);
router.get('/contact-us',userController.getContactPage);
router.get('/category/:mainCategory', userController.getCategoryPage);



module.exports = router;