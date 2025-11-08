const mongoose = require('mongoose');
const validator = require('validator');

const PostSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imagePath: {
      type: String,
    },
    content: { type: String },
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
