const mongoose = require('mongoose');
const validator = require('validator');

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    image_URL: String,
    content: { type: String },
    preview: { type: String },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
