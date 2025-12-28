const mongoose = require('mongoose');
const mapComment = require('./mapComment');

module.exports = function (post) {
  return {
    id: post.id,
    title: post.title,
    image_URL: post.image_URL,
    preview: post.preview,
    content: post.content,
    published_at: post.createdAt,
    comments: post.comments.map((comment) =>
      mongoose.isObjectIdOrHexString(comment) ? comment : mapComment(comment)
    ),
  };
};
