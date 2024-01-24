const express = require('express')
const { getAllBlogsController, createBlogController, updateBlogController, getBlogByIdController, deleteBlogController } = require('../controllers/blogController')

//router object
const router = express.Router()

//routes 
//get || all blog
router.get('/all-blog', getAllBlogsController)

//Post || create blog
router.post('/create-blog', createBlogController)

//Put || update blog
router.put('/update-blog/:id', updateBlogController)

//Get || single blog Details
router.get('/get-blog/:id', getBlogByIdController)



//delete || delete blog
router.delete('/delete-blog/:id', deleteBlogController)




module.exports = router