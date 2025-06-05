const express = require("express")
const  router = express.Router();
const adminController = require('../controller/admin');
const upload = require('../multer/fileUpload');
const uploadProduct=require('../multer/product')
const jwt = require("jsonwebtoken");



// setting layout for admin side seperate...
const setAdminLayout = (req, res, next) => {
    res.locals.layout = 'admin-layout'
    next()
  };
  const forLogin = (req, res, next) => {
  // Prevent caching to avoid "back button" after logout
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '1d');
  res.header('Pragma', 'no-cache');

  // If already logged in, redirect to dashboard
  if (req.cookies.adminToken) {
    return res.redirect('/admin/dashboard-view');
  }

  // Otherwise, allow to proceed to login
  next();
};




const verifyAdminToken = (req, res, next) => {
  const token = req.cookies.adminToken; // ✅ Read from cookies

  if (!token) {
    return res.redirect("/admin");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.adminId = decoded.id;
    next();
  } catch (err) {
    console.error("Token verification failed:", err.message);
    return res.redirect("/admin");
  }
};

  
// using admin layout...
router.use(setAdminLayout)

router.get('/signup',adminController.adminSignGet);
router.post('/signup',adminController.adminSignPost);

router.get('/',forLogin,adminController.adminLoginGet);
router.post('/',forLogin,adminController.adminLoginPost);


router.get('/dashboard-view',verifyAdminToken,adminController.adminDashBoard);
router.get('/product-view',verifyAdminToken,adminController.getAllProduct);
router.get('/category-view',verifyAdminToken,adminController.getAllCategory); 
router.get('/tags-view',verifyAdminToken,adminController.getAllTags); 
router.get('/sub-admin',verifyAdminToken,adminController.getAllSubAdmin); 

// In routes/admin.js

router.post('/add-category',upload.single('image'),verifyAdminToken,adminController.addCategory);

router.put('/edit-category',upload.single('image'),verifyAdminToken,adminController.editCategory);

router.delete('/delete-category/:id',verifyAdminToken,adminController.deleteCategory);

router.post('/add-tag',verifyAdminToken,adminController.adminAddTag);

router.put('/update-tag',verifyAdminToken,adminController.adminUpdateTag);

router.delete('/delete-tag/:id',verifyAdminToken,adminController.deleteTag);
router.put('/edit-product',uploadProduct.fields([{ name: 'image', maxCount: 1 }, { name: 'pdf', maxCount: 1 }]),verifyAdminToken,adminController.adminEditProduct)


router.post(
  '/add-product',
  uploadProduct.fields([
    { name: 'product_image', maxCount: 1 },
    { name: 'product_pdf', maxCount: 1 },
  ]),verifyAdminToken,
  adminController.adminAddProduct
);
router.delete('/delete-product/:id',verifyAdminToken,adminController.adminDeleteProduct,);
router.post('/add-sub-admin',verifyAdminToken,adminController.adminAddSubAdmin,);
router.put('/edit-sub-admin',verifyAdminToken,adminController.adminEditSubAdmin,);
router.delete('/delete-sub-admin/:id',adminController.adminDeleteSubAdmin)
router.put('/change-password',verifyAdminToken,adminController.AdminChangeSubAdminPassword);
router.get('/user-query',verifyAdminToken,adminController.GetUserQuery);
router.post('/user-query',verifyAdminToken,adminController.AddUserQuery);
router.delete('/user-query/:id',verifyAdminToken,adminController.AdminDeleteUserQuery);

router.get('/logout',adminController.logOutAdmin)


module.exports = router;