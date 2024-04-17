const express=require("express")
const rateLimit=require("express-rate-limit")
const router=express.Router()
const apicache=require("apicache")
const { cookie, body,query } = require("express-validator")
const {AdminloginData, createAdminAccount}=require("../Controller/Admin/admin.auth.controller")
const { dataValidator } = require("../Middlewares/api.middleware")
const { AdminTokenValidator } = require("../Middlewares/admin.middleware")
const {getUsersData, getAdminsData,AdminUpdateUsersData, AdminDeleteUserAccount,DeleteAdminAccount, AdminCreateUserData}=require("../Controller/Admin/admin.profile.controller")
const { productImage}=require('../Configs/multer.config')
const { productDuplicateCheck, addProduct, fileUploadStatus, searchProductDataAdmin, deleteProduct, saveProduct, addCategory, deleteCategory, getCategory } = require("../Controller/Admin/admin.product.controller")
const { sendProductImageAdmin,deleteProductImage,saveProductImage } = require("../../public/AdminMedia")
const { getOrdersForAdmin, updateOrderAdmin } = require("../Controller/Admin/admin.orders.controller")

const cache=apicache.middleware

const Loginlimit=rateLimit({
        windowMs: 15*60*1000, 
        max: 8,
        message: {Status:"failed",Message:"Too many requests"},
})

//ROUTES
// router.route("/login").post(Loginlimit,
// [body("username").isString().notEmpty(),body("password").isString().notEmpty()],
// dataValidator,
// AdminloginData
// )

/*

ROUTES MAP :                         
        1. EXPRESS-VALIDATOR            
        2. MIDDLEWARES                   
        3. API Cache
        4. FINAL RESPONSE API       

*/

/* ADMIN MANIPULATIONS HERE : STARTS*/
router.route("/tokenCheck").post(
[body("tokenadmin421").isString().notEmpty()],
dataValidator,AdminTokenValidator,
(req,res)=>{res.send({Status:"success"})}
)

router.route("/getAdminsData").post(
[body("tokenadmin421").isString().notEmpty(),body("search").isString()],
dataValidator,AdminTokenValidator,
getAdminsData
)

router.route("/DeleteAdminAccount").post(
[body("tokenadmin421").isString().notEmpty(),body("id").isString().notEmpty(),body("confirm").isString().notEmpty()],
dataValidator,AdminTokenValidator,
DeleteAdminAccount
)

router.route("/createAdminAccount").post(
[body("tokenadmin421").isString().notEmpty(),body("username").isString().notEmpty(),body("password").isString().notEmpty()],
dataValidator,AdminTokenValidator,
createAdminAccount
)

/* ADMIN MANIPULATIONS HERE : ENDS*/

/* USERS DATA MANIPULATIONS HERE :- STARTS*/

router.route("/getUserData").post(
[body("tokenadmin421").isString().notEmpty(),body("search").isString()],
dataValidator,AdminTokenValidator,
getUsersData
)



router.route("/AdminUpdateUserData").post(
[body("tokenadmin421").isString().notEmpty(),body("id").isString().notEmpty(),body("name").isString().notEmpty(),body("email").isString().notEmpty().isEmail(),body("phone").isNumeric().notEmpty()],
dataValidator,AdminTokenValidator,
AdminUpdateUsersData
)


router.route("/AdminDeleteUserAccount").post(
[body("tokenadmin421").isString().notEmpty(),body("id").isString().notEmpty()],
dataValidator,AdminTokenValidator,
AdminDeleteUserAccount
)

router.route("/AdminCreateUserAccount").post(
[body("tokenadmin421").isString().notEmpty(),body("name").isString().notEmpty(),body("email").isString().notEmpty().isEmail(),body("phone").isNumeric().notEmpty(),body("password").isNumeric().notEmpty()],
dataValidator,AdminTokenValidator,
AdminCreateUserData
)



/* USERS DATA MANIPULATIONS HERE :- ENDS*/




/* PRODUCTS ROUTES STARTS HERE*/

/* PRODUCTS DATA*/ 

router.route("/getProductData").post(
[body("tokenadmin421").isString().notEmpty(),body('search').isString()],
dataValidator,
searchProductDataAdmin
)

router.route("/getProductImage").get(
[query('id').isString().notEmpty()],
dataValidator,
sendProductImageAdmin
)

router.route("/addProduct").post(
[body("tokenadmin421").isString().notEmpty(),body("productName").isString().notEmpty(),body("productPrice").isNumeric().notEmpty(),body("productDiscount").isNumeric().notEmpty(),body("Category").isString().notEmpty(),body("sizeOption").isArray(),body("productDescription").isString().notEmpty(),body("rating").isNumeric().notEmpty(),body("foodType").isString().isIn(["None","Veg","Non Veg"])],
dataValidator,AdminTokenValidator,productDuplicateCheck,
addProduct
)
// NOTE /addProductImage can also be used for saving the new Image
router.route("/addProductImage").post(
productImage.single('file'),fileUploadStatus
)

router.route("/deleteProduct").post(
[body("tokenadmin421").isString().notEmpty(),body("id").isString().notEmpty()],
dataValidator,AdminTokenValidator,deleteProductImage,
deleteProduct
)

router.route("/saveProduct").post(
[body("tokenadmin421").isString().notEmpty(),body("id").isString().notEmpty(),body("productName").isString().notEmpty(),body("productPrice").isNumeric().notEmpty(),body("productDiscount").isNumeric().notEmpty(),body("Category").isString().notEmpty(),body("sizeOption").isArray(),body("productDescription").isString().notEmpty(),body("rating").isNumeric().notEmpty(),body("foodType").isString().isIn(["None","Veg","Non Veg"]).notEmpty()],
dataValidator,AdminTokenValidator,
saveProduct
)




/* ORDERS DATA */
router.route("/getOrders").post(
[body("tokenadmin421").isString().notEmpty(),body("search").isString(),body("category").isString().notEmpty()],
dataValidator,AdminTokenValidator,
getOrdersForAdmin
)

router.route("/updateOrder").post(
[body("tokenadmin421").isString().notEmpty(),body("orderId").isString().notEmpty(),body("action").isString().isIn(['Ordered','Out for Delivery','Delivered']).notEmpty()],
dataValidator,AdminTokenValidator,
updateOrderAdmin
)


/* CATEGORY CRUD */
router.route("/addCategory").post(
[body("tokenadmin421").isString().notEmpty(),body("name").isString().notEmpty()],
dataValidator,AdminTokenValidator,
addCategory
)

router.route("/deleteCategory").post(
[body("tokenadmin421").isString().notEmpty(),body("name").isString().notEmpty()],
dataValidator,AdminTokenValidator,
deleteCategory
)

router.route("/getCategory").post(
[body("tokenadmin421").isString().notEmpty()],
dataValidator,AdminTokenValidator,
getCategory
)

/* PRODUCTS ROUTES ENDS HERE*/
const adminRoutes=router

module.exports=adminRoutes