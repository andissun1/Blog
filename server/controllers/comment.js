const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Добавление
async function addComment(postId, comment) {
  const newComment = await Comment.create(comment);

  console.log(comment);

  await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } });

  await newComment.populate('author_id');

  return newComment;
}

// Удаление
async function deleteComment(postId, commentId) {
  await Comment.deleteOne({ _id: commentId });
  await Post.findByIdAndUpdate(postId, { $pull: { comments: commentId } });
}

module.exports = {
  addComment,
  deleteComment,
};
