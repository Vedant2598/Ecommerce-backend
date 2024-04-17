const express=require("express")
const rateLimit=require("express-rate-limit")
const router=express.Router()
let apicache=require("apicache")
const { cookie, body, query} = require("express-validator")
const {dataValidator, jwtTokenValidator}=require("../Middlewares/api.middleware")
const { registerData,loginData, returnToken,registerStep1,registerStep2, userAvailableOrNot} = require("../Controller/Client/users.auth.controller")
const { getData, updateData,deleteAccount, updateAddress, getAddress } = require("../Controller/Client/users.profile.controller")
const { sendProductImage }=require("../../public/Media")
const { SearchProduct, getSingleProductData, addToCart, getCartItems, removeFromCart, addFavourites, removeFavourites, getFavourites, getSingleFavourites, cartUpdate, getCategoryProduct, placeOrder, getOrders, cancelProductOrder, getUserRating, removeRating, addRating, getProductRating, deleteRating, } = require("../Controller/Client/users.product.controller")

const limit=rateLimit({windowMs:15*60*1000,max:10,message:{status:"failed",message:"Too many requests"}})
const Updatelimit=rateLimit({windowMs:8*60*1000,max:15,message:{status:"failed",message:"Too many requests"}})
const registerLimit=rateLimit({windowMs:60*60*1000,max:3,message:{status:"failed",message:"Too many requests"}})

let cache=apicache.middleware

//COMMON MIDDLEWARES
router.use(dataValidator)

//ROUTES ARE RELATED TO USER PROFILES AND AUTHS

/*REGISTRATION AND LOGIN ROUTES :- START*/
router.route("/login").post(
[body('email').isEmail().isString().notEmpty(),body('password').isString().notEmpty()],
loginData
)

// registerLimit,
//REGISTER API WITHOUT OTP

// router.route("/register").post(
// [body("email").isString().notEmpty().isEmail(),body("password").notEmpty().isString(),body("name").isString().notEmpty(),body("phone").notEmpty().isNumeric()],
// registerData)

//REGISTER API WITH OTP
router.route("/registerStep1").post(
[body("email").isString().notEmpty().isEmail(),body("password").notEmpty().isString(),body("name").isString().notEmpty(),body("phone").notEmpty().isNumeric()],
registerStep1
)

let otpCheck=(value)=>{
        return String(value).length==6
}

router.route("/registerStep2").post(
[body("email").isString().notEmpty().isEmail(),body("password").notEmpty().isString(),body("name").isString().notEmpty(),body("phone").notEmpty().isNumeric(),body("otp").notEmpty().isNumeric().notEmpty()],
registerStep2
)


router.route("/getToken").post(
[body("token").isString().notEmpty()],
jwtTokenValidator,
returnToken)

router.route("/checkUser").post(
[body("token").isString().notEmpty()],
jwtTokenValidator,
userAvailableOrNot)
        

/* REGISTRATION AND LOGIN ROUTES:= ENDS */



/* 
ROUTES MAP :                         
        1. EXPRESS-VALIDATOR            
        2. MIDDLEWARES                   
        3. API Cache    (optional)
        4. FINAL RESPONSE API       
*/

/* EDIT PROFILE ROUTES :- START */
router.route("/getdata").post(
[body('token').isString().notEmpty()],
jwtTokenValidator,
getData
)

router.route("/updateProfile").post(Updatelimit,
[body("token").isString().notEmpty(),body('name').isString().notEmpty(),body("image").isBoolean().notEmpty()],
jwtTokenValidator,
updateData
)

// router.route("/deleteAccount").post(
// [body("token").isString().notEmpty(),body('confirm').isString().notEmpty()],
// jwtTokenValidator,
// deleteAccount
// )

router.route("/updateAddress").post(
[body("token").isString().notEmpty(),body("index").isNumeric(),body('state').isString(),body('city').isString(),body('landmark').isString(),body('address').isString()],
jwtTokenValidator,
updateAddress
)

router.route("/getAddress").post(
[body("token").isString().notEmpty()],
jwtTokenValidator,
getAddress
)

/* EDIT PROFILE ROUTES :- ENDS */



/* PRODUCT USERS ROUTES :- STARTS */
/***** GUEST USERS *****/

router.route("/getProductImage").get(
[query('name').isString().notEmpty()],
cache("2 minutes"),
sendProductImage
)

router.route("/getCategoryProducts").post(
[body('category').isString().isLength({max:80}).notEmpty()],
getCategoryProduct
)

router.route("/search").post(
[body('search').isString().isLength({max:80})],
SearchProduct
)

router.route("/getSingleProductData").post(
[body('name').isString().isLength({max:80})],
getSingleProductData
)


//***** TOKEN REQUIRES ******//

//EXPRESS VALIDATOR FUNCTION
const quantityCheck=(value)=>{const number=Number(value); return number>0 && number<=10;}

/* CART ROUTES */
router.route("/addToCart").post(
[body("token").isString().notEmpty(),body('ProductName').isString().notEmpty(),body('ProductQuantity').isNumeric().notEmpty().custom(quantityCheck),body('size').isString().isIn(["Small","Medium","Large"]).notEmpty()],
jwtTokenValidator,
addToCart
)

router.route("/removeFromCart").post(
[body("token").isString().notEmpty(),body('id').isString().notEmpty()],
jwtTokenValidator,
removeFromCart
)

router.route("/getCartItems").post(
[body("token").isString().notEmpty()],
jwtTokenValidator,
getCartItems
)

router.route("/cartUpdate").post(
[body("token").isString().notEmpty(),body("data").isArray()],
jwtTokenValidator,
cartUpdate
)



/* FAVOURITES ROUTES */
router.route("/getSingleFavourites").post(
[body("token").isString().notEmpty(),body('ProductName').isString().notEmpty()],
jwtTokenValidator,
getSingleFavourites
)

router.route("/getFavourites").post(
[body("token").isString().notEmpty(),body('ProductName').isString().notEmpty()],
jwtTokenValidator,
getFavourites
)

router.route("/addToFavourite").post(
[body("token").isString().notEmpty(),body('ProductName').isString().notEmpty()],
jwtTokenValidator,
addFavourites
)

router.route("/removeFromFavourite").post(
[body("token").isString().notEmpty(),body('ProductName').isString().notEmpty()],
jwtTokenValidator,
removeFavourites
)


/* ORDER ROUTES */
router.route("/getOrders").post(
[body("token").isString().notEmpty(),body('confirm').isString().notEmpty()],
jwtTokenValidator,
getOrders
)

router.route("/placeOrder").post(
[body("token").isString().notEmpty(),body("address").isObject().notEmpty(),body("products").isArray().notEmpty(),body("totalPrice").isNumeric().notEmpty()],
jwtTokenValidator,
placeOrder
)

router.route("/cancelOrder").post(
[body("token").isString().notEmpty(),body('confirm').isString().notEmpty()],
jwtTokenValidator,
cancelProductOrder
)

/* RATINGS ROUTES */

router.route("/addRating").post(
[body("token").isString().notEmpty(),body("rating").isNumeric().notEmpty(),body("productName").isString().notEmpty()],
jwtTokenValidator,
addRating
)
router.route("/deleteRating").post(
[body("token").isString().notEmpty(),body("productName").isString().notEmpty()],
jwtTokenValidator,
deleteRating
)
router.route("/getUserRatings").post(
[body("token").isString().notEmpty(),body("productName").isString().notEmpty()],
jwtTokenValidator,
getUserRating
)


// CHECKING THE AVAILABILITY WHETHER THE USER HAD ORDERED THIS PRODUCT PREVIOUSLY SO THAT RATING OPTION WILL BE AVAILABLE
// router.route("/checkRatingAvailable").post(
// [body("token").isString().notEmpty()],
// jwtTokenValidator,
    
// )


/* PRODUCT USERS ROUTES :- ENDS */

const usersRoutes=router

module.exports=usersRoutes