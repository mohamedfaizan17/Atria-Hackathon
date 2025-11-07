const Blog = require('../models/Blog');

// @desc    Get all blogs
// @route   GET /api/blog
// @access  Public
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, isPublished, search } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (isPublished !== undefined) filter.isPublished = isPublished === 'true';
    if (search) {
      filter.$or = [
        { title: new RegExp(search, 'i') },
        { content: new RegExp(search, 'i') },
        { tags: new RegExp(search, 'i') }
      ];
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'name email avatar')
      .sort({ publishedAt: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      count: blogs.length,
      data: blogs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single blog
// @route   GET /api/blog/:slug
// @access  Public
exports.getBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug })
      .populate('author', 'name email avatar');

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views
    blog.views += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create blog
// @route   POST /api/blog
// @access  Private (Admin)
exports.createBlog = async (req, res, next) => {
  try {
    req.body.author = req.user.id;
    
    if (req.body.isPublished && !req.body.publishedAt) {
      req.body.publishedAt = new Date();
    }

    const blog = await Blog.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update blog
// @route   PUT /api/blog/:id
// @access  Private (Admin)
exports.updateBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // If publishing for the first time, set publishedAt
    if (req.body.isPublished && !blog.isPublished) {
      req.body.publishedAt = new Date();
    }

    Object.assign(blog, req.body);
    await blog.save();

    res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      data: blog
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete blog
// @route   DELETE /api/blog/:id
// @access  Private (Admin)
exports.deleteBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like blog
// @route   POST /api/blog/:id/like
// @access  Public
exports.likeBlog = async (req, res, next) => {
  try {
    const blog = await Blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.likes += 1;
    await blog.save();

    res.status(200).json({
      success: true,
      data: { likes: blog.likes }
    });
  } catch (error) {
    next(error);
  }
};
