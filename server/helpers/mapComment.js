module.exports = function (comment) {
  return {
    content: comment.content,
    author: comment.author_id.login,
    id: comment._id,
    published_at: comment.createdAt,
  };
};
