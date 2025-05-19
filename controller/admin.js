const Admin = require("../model/adminModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Category = require("../model/categoryModel");
const Tag = require("../model/tagModel");
const Product=require('../model/productModel');
const moment = require('moment');
const { log } = require("console");
const SubAdmin = require('../model/subAdmin')





const adminController = {
  adminSignGet: (req, res) => {
    res.render("admin/signup");
  },

  adminSignPost: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Check if user already exists
      const existingUser = await Admin.findOne({ email: email });
      if (existingUser) {
        return res.send("hu", {
          message: "Username or email already exists",
          messageClass: "error",
        });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create new user
      const newAdmin = new Admin({
        username,
        email,
        password: hashedPassword,
      });

      await newAdmin.save();

      res.render("admin/dashboard", {
        message: "Registration successful! You can now log in.",
        messageClass: "success",
      });
    } catch (error) {
      console.error("Signup error:", error);
      res.send("hbubi", {
        message: "An error occurred. Please try again.",
        messageClass: "error",
      });
    }
  },

  adminLoginGet: (req, res) => {
    res.render("admin/login");
  },
  adminLoginPost: async (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;

  try {
    // Step 1: Try to find in Admin collection
    let admin = await Admin.findOne({ email: email });
    let userType = "admin"; // default

    // Step 2: If not found in Admin, try SubAdmin
    if (!admin) {
      admin = await SubAdmin.findOne({ email: email });
      userType = "subAdmin";
    }

    if (!admin) {
      console.log("Not Found");
      return res.render("admin/login", {
        message: "Invalid email or password.",
      });
    }

    // Step 3: Compare password
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.render("admin/login", {
        message: "Invalid email or password.",
      });
    }

    // Step 4: Generate JWT token
    const token = jwt.sign({ id: admin._id, type: userType }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // Step 5: Set cookies
    res.cookie("adminToken", token, { httpOnly: true });
    res.cookie("adminName", admin.username || admin.name || "Admin"); // support both Admin.username and SubAdmin.name
    res.cookie("adminId", admin._id.toString());
    res.cookie("userType", userType); // optional: if you want to distinguish between admin and sub-admin

    // Redirect
    return res.redirect("/admin/dashboard-view");

  } catch (err) {
    console.error(err);
    res.render("admin/login", { message: "Server error. Please try again." });
  }
},

adminDashBoard: async (req, res) => {
  try {
    const [productCount, categoryCount, tagCount, latestProducts] = await Promise.all([
      Product.countDocuments(),
      Category.countDocuments(),
      Tag.countDocuments(),
      Product.find().sort({ createdAt: -1 }).limit(8) // Fetch latest 8 products
    ]);
const formattedProducts = latestProducts.map(product => {
  return {
    ...product._doc,
    formattedDate: moment(product.createdAt).format('DD/MM/YYYY hh:mmA'), // e.g. 12/05/2025 02:30PM
  };
});
console.log(formattedProducts)

    res.render("admin/dashboard", {
      productCount,
      categoryCount,
      tagCount,
      formattedProducts, // Pass this to view
    });
  } catch (error) {
    console.error("Error loading admin dashboard:", error);
    res.status(500).render("error", {
      message: "Failed to load dashboard",
      error: error.message,
    });
  }
},

  getAllProduct: async (req, res) => {
    try {
      const categories = await Category.find({});
      const tags = await Tag.find({});
      const products = await Product.find({}).sort({ createdAt: -1 });; // optional populate if using refs
  
      res.render("admin/product", {
        tags,
        categories,
        categoriesJSON: JSON.stringify(categories),
        products, // pass products to view
      });
    } catch (error) {
      console.error("Error loading admin product page:", error);
      res.status(500).render("error", {
        message: "Failed to load Product-Page",
        error: error.message,
      });
    }
  },
  
  getAllCategory: async (req, res) => {
    try {
      const allCategories = await Category.find().sort({ createdAt: -1 }); // Fetch all categories
      // console.log(allCategories)
      res.render("admin/category", { allCategories });
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
      res.status(500).render("error", {
        message: "Failed to load Category-Page",
        error: error.message,
      });
    }
  },
  addCategory: async (req, res) => {
    console.log("kkkkkkkkkkkk");
    try {
      const { mainCategory } = req.body;
      const subCategories = JSON.parse(req.body.subCategories); // Parse JSON string

      //  Check if the mainCategory already exists
      const existingCategory = await Category.findOne({ mainCategory });

      if (existingCategory) {
        return res.status(400).json({ message: "Category already exists" });
      }

      const imageUrl = `/uploads/${mainCategory
        .toLowerCase()
        .replace(/\s+/g, "-")}/${req.file.filename}`;

      const newCategory = new Category({
        mainCategory: mainCategory.trim(),
        subCategories,
        imageUrl,
      });

      await newCategory.save();
      const allCategories = await Category.find().sort({ createdAt: -1 }); // Optional: sort latest first

      res.status(201).json({
        message: "Category added!",
        allCategories: allCategories,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Something went wrong" });
    }
  },

  getAllTags: async (req, res) => {
    try {
      const AllTags = await Tag.find().sort({ createdAt: -1 });
      res.render("admin/tags", { AllTags });
    } catch (error) {
      console.error("Error loading admin dashboard:", error);
      res.status(500).render("error", {
        message: "Failed to load Tags-Page",
        error: error.message,
      });
    }
  },

 getAllSubAdmin: async (req, res) => {
  try {
const subAdmins = await SubAdmin.find().sort({ _id: -1 });

    res.render("admin/sub-admin", {
      subAdmins, // pass to frontend
    });

  } catch (error) {
    console.error("Error loading sub-admin page:", error);
    res.status(500).render("error", {
      message: "Failed to load Sub Admin Page",
      error: error.message,
    });
  }
},

  editCategory: async (req, res) => {
    try {
      const { categoryId, mainCategory, subCategories } = req.body;
      const image = req.file ? req.file.filename : null;

      console.log(categoryId, mainCategory, subCategories, image);

      // Parse subCategories if it's a JSON string
      let parsedSubCategories = subCategories;
      if (typeof subCategories === "string") {
        try {
          parsedSubCategories = JSON.parse(subCategories);
        } catch (err) {
          return res
            .status(400)
            .json({ message: "Invalid subCategories format" });
        }
      }

      // Find existing category
      const existingCategory = await Category.findById(categoryId);
      if (!existingCategory) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Check if mainCategory already exists (excluding current)
      const isNameExist = await Category.findOne({
        mainCategory,
        _id: { $ne: categoryId },
      });
      if (isNameExist) {
        return res
          .status(400)
          .json({ message: "Category with this name already exists" });
      }

      // Update name and subcategories
      existingCategory.mainCategory = mainCategory;
      existingCategory.subCategories = parsedSubCategories;

      // If image exists, update imageUrl
      if (image) {
        const formattedMainCategory = mainCategory
          .toLowerCase()
          .replace(/\s+/g, "-");
        const imageUrl = `/uploads/${formattedMainCategory}/${image}`;
        existingCategory.imageUrl = imageUrl;
      }

      await existingCategory.save();

      console.log(existingCategory);
      return res
        .status(200)
        .json({
          message: "Category updated successfully",
          category: existingCategory,
        });
    } catch (error) {
      console.error("Error editing category:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  deleteCategory: async (req, res) => {
    try {
      const categoryId = req.params.id;

      console.log(categoryId);

      const deleted = await Category.findByIdAndDelete(categoryId);

      if (!deleted) {
        return res.status(404).json({ message: "Category not found" });
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error("Error deleting category:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  },

  adminAddTag: async (req, res) => {
    const { productTag } = req.body;

    // Check if the productTag is not empty or null
    if (!productTag || productTag.trim() === "") {
      return res.status(400).json({ message: "Tag cannot be empty" });
    }

    try {
      // Check if the tag already exists
      const existingTag = await Tag.findOne({ productTag: productTag });
      if (existingTag) {
        return res.status(400).json({ message: "Tag already exists" });
      }

      // Create a new tag
      const tag = new Tag({ productTag: productTag });
      await tag.save();

      // Respond with success message
      res.status(201).json({ message: "Tag added successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error adding tag" });
    }
  },
  adminUpdateTag: async (req, res) => {
  const { id, productTag } = req.body;

  if (!id || !productTag) {
    return res
      .status(400)
      .json({ message: "Tag ID and product tag are required" });
  }

  try {
    const existingTag = await Tag.findOne({
      productTag: productTag.toUpperCase(),
      _id: { $ne: id }, // Exclude the current tag being edited
    });

    if (existingTag) {
      return res.status(409).json({
        message: "A tag with this name already exists. Please choose a different name.",
      });
    }

    const tag = await Tag.findById(id);
    if (!tag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    tag.productTag = productTag.toUpperCase();
    await tag.save();

    res.status(200).json({
      message: "Tag updated successfully",
      tag: tag,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "An error occurred while updating the tag. Please try again later.",
    });
  }
},

  deleteTag: async (req, res) => {
    const tagId = req.params.id;
    if (!tagId) {
      return res.status(400).json({ message: "Tag ID is required" });
    }

    try {
      // Find the tag by ID and delete it
      const tag = await Tag.findByIdAndDelete(tagId);

      // If tag is not found
      if (!tag) {
        return res.status(404).json({ message: "Tag not found" });
      }

      // Send a success response
      res.status(200).json({
        message: "Tag deleted successfully",
        productTag: tag,
      });
    } catch (error) {
      console.error(error);
      // Return a server error if something goes wrong
      res
        .status(500)
        .json({
          message:
            "An error occurred while deleting the tag. Please try again later.",
        });
    }
  },
  
  adminAddProduct:async(req,res)=>{
    try {
      const {
        p_name,
        p_code,
        p_category,
        p_subcategory,
        product_tag,
        p_description,
        feature_title,
        feature_points
      } = req.body;
  
      // Check if product already exists
      const existing = await Product.findOne({ 
        $or: [{ p_name }, { p_code }]
      });
  
      if (existing) {
        return res.status(400).json({ message: 'Product already exists' });
      }
  
      // Get uploaded files
      const productImageFile = req.files?.product_image?.[0];
      const productPdfFile = req.files?.product_pdf?.[0];
  
      // Construct URLs for files
      const imageUrl = productImageFile ? `/product/${productImageFile.filename}` : '';
      const pdfUrl = productPdfFile ? `/product/${productPdfFile.filename}` : '';
  
      // Create product
      const newProduct = new Product({
        p_name,
        p_code,
        p_category,
        p_subcategory,
        product_tag,
        p_description,
        feature_title,
        feature_points,
        product_image_url: imageUrl,
        product_pdf_url: pdfUrl
      });
  
      await newProduct.save();
  
      res.status(200).json({ message: 'Product added successfully', product: newProduct });
  
    } catch (err) {
      console.error('Add product error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
    
  },

  adminEditProduct: async (req, res) => {
  try {
    const {
      id,
      name,
      code,
      tag,
      category,
      subcategory,
      description,
      featureTitle,
      featurePoints,
    } = req.body;

    const parsedFeaturePoints = JSON.parse(featurePoints || '[]');

    // 🔍 Check for duplicate product name/code (excluding current product)
    const duplicate = await Product.findOne({
      _id: { $ne: id },
      $or: [{ p_name: name }, { p_code: code }],
    });

    if (duplicate) {
      return res.status(400).json({
        success: false,
        message: 'A product with the same name or code already exists.',
      });
    }

    // 🔎 Get current product
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // 📝 Update basic fields
    product.p_name = name;
    product.p_code = code;
    product.product_tag = tag;
    product.p_category = category;
    product.p_subcategory = subcategory;
    product.p_description = description;
    product.feature_title = featureTitle;
    product.feature_points = parsedFeaturePoints;

    // 📦 Handle files
    const imageFile = req.files?.image?.[0];
    const pdfFile = req.files?.pdf?.[0];

    // If new image uploaded, update it; else keep old
    if (imageFile) {
      product.product_image_url = `/product/${imageFile.filename}`;
    }

    // If new PDF uploaded, update it; else keep old
    if (pdfFile) {
      product.product_pdf_url = `/product/${pdfFile.filename}`;
    }

    // 💾 Save updated product
    await product.save();

    return res.status(200).json({ success: true, message: 'Product updated successfully' });

  } catch (error) {
    console.error('Error updating product:', error);
    return res.status(500).json({ success: false, message: 'Server error while updating product' });
  }
},

adminDeleteProduct:async(req,res)=>{
 const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: 'Product ID is required.' });
    }

    try {
      const product = await Product.findById(id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found.' });
      }

      await Product.findByIdAndDelete(id);

      res.status(200).json({ success: true, message: 'Product deleted successfully.' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ message: 'Server error. Could not delete product.' });
    }


  },
  adminAddSubAdmin :async (req, res) => {
  try {
    const { username, email, role, password } = req.body;

let existingAdmin = await Admin.findOne({ email });
if (!existingAdmin) {
  existingAdmin = await SubAdmin.findOne({ email });
}

if (existingAdmin) {
  return res.status(400).json({ message: "An admin already exists with this email." });
}


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    if (role === "superadmin") {
      // Save in Admin model
      const newAdmin = new Admin({
        username,
        email,
        role,
        password: hashedPassword,
      });
      await newAdmin.save();
      return res.status(200).json({ message: "Super Admin added successfully." });
    } else if (role === "subadmin") {
      // Save in SubAdmin model
      const newSubAdmin = new SubAdmin({
        username,
        email,
        role,
        password: hashedPassword,
      });
      await newSubAdmin.save();
      return res.status(200).json({ message: "Sub Admin added successfully." });
    } else {
      return res.status(400).json({ message: "Invalid role selected." });
    }
  } catch (error) {
    console.error("Error adding admin:", error);
    res.status(500).json({ message: "Internal server error." });
  }
},
  adminEditSubAdmin:async(req,res)=>{
   try {
    const {id,username, email } = req.body;

    // Check for existing email in Admin (excluding the same ID if it's the same person)
    const existingInAdmin = await Admin.findOne({ email });
    if (existingInAdmin) {
      return res.status(400).json({ message: "Email already exists in Admin model." });
    }

    // Check for existing email in SubAdmin (excluding the current subadmin being edited)
    const existingInSubAdmin = await SubAdmin.findOne({ email, _id: { $ne: id } });
    if (existingInSubAdmin) {
      return res.status(400).json({ message: "Email already exists in SubAdmin model." });
    }

    // Update the SubAdmin details
    const updated = await SubAdmin.findByIdAndUpdate(
      id,
      { username, email },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Sub-admin not found." });
    }

    res.status(200).json({ message: "Sub-admin updated successfully.", data: updated });
  } catch (error) {
    console.error("Error updating sub-admin:", error);
    res.status(500).json({ message: "Internal server error." });
  }
  },


  AdminChangeSubAdminPassword:async(req,res)=>{
    try {
    const { id, email, newPassword } = req.body;

    // Basic validation
    if (!id || !email || !newPassword) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find sub-admin by ID and email
    const subAdmin = await SubAdmin.findOne({ _id: id, email: email });
    if (!subAdmin) {
      return res.status(404).json({ message: 'Sub-admin not found.' });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    subAdmin.password = hashedPassword;
    await subAdmin.save();

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (error) {
    console.error('Change Password Error:', error);
    return res.status(500).json({ message: 'Internal server error.' });
  }
  },























  logOutAdmin:(req,res)=>{
      res.clearCookie("adminToken");
  res.clearCookie("adminName");
  res.clearCookie("adminId");

  // Redirect to login page
  res.redirect("/admin/");
  }

































};

module.exports = adminController;
