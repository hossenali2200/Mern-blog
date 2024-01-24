const   mongoose   = require('mongoose')
const blogModel = require('../models/blogModel')
const userModel = require('../models/userModel')

//Get all blogs

exports.getAllBlogsController = async(req, res) => {
    try {
        const blogs = await blogModel.find({})
        if(!blogs){
            return res.status(200).send({
                success:false,
                message:'No Blogs Found'
            })
        }
        return res.status(200).send({
            success:true,
            BlogCount: blogs.length,
            message:"All Blogs lists",
            blogs,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            success:false,
            message:"Error While Getting Blogs",
            error
        })
    }
}


exports.createBlogController = async (req, res) => {
    try {
        const { title, description, image, user } = req.body;

        // Validation
        if (!title || !description || !image || !user) {
            return res.status(400).send({
                success: false,
                message: 'Please Provide All Fields'
            });
        }

        const existingUser = await userModel.findById(user);

        // Validation
        if (!existingUser) {
            return res.status(404).send({
                success: false,
                message: 'User not found'
            });
        }

        const newBlog = new blogModel({ title, description, image, user });

        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            await newBlog.save({ session });

            // Ensure that existingUser.blogs is an array before pushing
            existingUser.blogs = existingUser.blogs || [];
            existingUser.blogs.push(newBlog);

            await existingUser.save({ session });
            await session.commitTransaction();

            return res.status(201).send({
                success: true,
                message: 'Blog Created',
                newBlog,
            });
        } catch (error) {
            // Handle any errors that occurred during the transaction
            await session.abortTransaction();
            throw error;
        } finally {
            // End the session
            session.endSession();
        }
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success: false,
            message: 'Error While Creating Blogs',
            error
        });
    }
};




//Update blog
exports.updateBlogController = async(req, res) => {
    try {
        const {id} = req.params
        const{title, description,image} = req.body
        const blog = await blogModel.findByIdAndUpdate(id,{...req.body}, {new:true})
        return res.status(200).send({
            success:true,
            message:"Blog Updated!",
            blog
        });
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error While Updating Blogs",
            error
        })
    }
}


//get single blog
exports.getBlogByIdController = async(req,res) => {
    try {
        const {id} = req.params
        const blog = await blogModel.findById(id)
        if(!blog){
            return res.status(404).send({
                success:false,
                message:"blog not found with this id"
            })
        }
        return res.status(200).send({
            success:true,
            message:'fetch single blog',
            blog
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error While single Blog",
            error
        })
    }
}


//Delete blog
exports.deleteBlogController = async(req,res) => {
    try {
        await blogModel.findByIdAndDelete(req.params.id)
        return res.status(200).send({
            success:true,
            message:'Blog deleted'
        })
    } catch (error) {
        console.log(error);
        return res.status(400).send({
            success:false,
            message:"Error While deleteing Blog",
            error
        })
    }
}