const Post = require('../models/Post');

// Добавление
async function addPost(post) {
  const newPost = await Post.create(post);
  await newPost.populate({
    path: 'comments',
    populate: 'author_id',
  });

  return newPost;
}

// Изменение
async function editPost(id, post) {
  const newPost = await Post.findOneAndUpdate({ _id: id }, post, {
    returnDocument: 'after',
  });

  console.log(newPost);

  await newPost.populate({
    path: 'comments',
    populate: 'author_id',
  });

  return newPost;
}

// Удаление
function deletePost(id) {
  return Post.deleteOne({ _id: id });
}

// Получение списка с пагинацией и поиском
async function getPosts(search = '', limit = 10, page = 1) {
  const [posts, count] = await Promise.all([
    Post.find({ title: { $regex: search, $options: 'i' } })
      .limit(limit)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 }),
    Post.countDocuments({ title: { $regex: search, $options: 'i' } }),
  ]);

  return {
    posts,
    lastPage: Math.ceil(count / limit),
  };
}

// Получение одного поста
function getPost(id) {
  return Post.findById(id).populate({ path: 'comments', populate: 'author_id' });
}

module.exports = {
  addPost,
  editPost,
  deletePost,
  getPost,
  getPosts,
};
