const Category = require('../model/categoryModel'); // adjust the path to your Category model
const Product = require('../model/productModel');
const Tag=require('../model/tagModel')

const userController = {
    userHomeGet: async (req, res) => {
        try {
          const products=await Product.find({})
          const categories = await Category.find().lean();
          const tags = await Tag.find()
          res.render("user/index", { categories,productsJSON: JSON.stringify(products),tags,categoriesJSON:JSON.stringify(categories) }); // ✅ This is correct
        } catch (err) {
          console.error(err);
          res.status(500).send("Internal Server Error");
        }
      },
      getAboutPage:async(req,res)=>{
        try {
    // Fetch all categories and products
    const categories = await Category.find();  // or .lean() if using Handlebars
    const products = await Product.find();     // or .lean()

    res.render("user/about-us", {
      categories,
      products,productsJSON:JSON.stringify(products),categoriesJSON:JSON.stringify(categories)
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).send("Server Error");
  }
      },
      getDownloadPage:async(req,res)=>{
        const products=await Product.find({})
        const categories = await Category.find().lean();

        res.render("user/downloads",{categories,productsJSON: JSON.stringify(products),categoriesJSON: JSON.stringify(categories)})
      },


      getSingleProduct: async (req, res) => {
        try {
          const productId = req.params.id;
        console.log(productId)
          // Find product by ID
          const product = await Product.findById(productId);
          const categories = await Category.find({})
          const allProduct = await Product.find({})
      
          if (!product) {
            return res.status(404).send('Product not found');
          }
      
          // Render the product page
          res.render('user/single-product', { product,categories,productsJSON:JSON.stringify(allProduct),categoriesJSON:JSON.stringify(categories)});
        } catch (err) {
          console.error('Error fetching product:', err);
          res.status(500).send('Server error');
        }
      },

      getAllProduct:async(req,res)=>{
        try {
          const products = await Product.find({});
          res.render('user/product-page', { products });
        } catch (error) {
          console.error("Error fetching products:", error);
          res.status(500).render('error', {
            message: "Failed to load products",
            error: error.message,
          });
        }
      },
getContactPage: async (req, res) => {
  try {
    const categories = await Category.find({});
    const products = await Product.find({});
    res.render('user/contact-us',{categories,productsJSON: JSON.stringify(products),categoriesJSON: JSON.stringify(categories)});
  } catch (error) {
    console.error("Error loading contact page:", error);
    res.status(500).send("Server Error");
  }
}


      

};

module.exports = userController;
