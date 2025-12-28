const express = require('express');
const {
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
} = require('../controllers/post');
const { addComment, deleteComment } = require('../controllers/comment');
const authenticated = require('../middlewares/authenticated');
const hasRole = require('../middlewares/hasRole');
const mapPost = require('../helpers/mapPost');
const mapComment = require('../helpers/mapComment');
const ROLES = require('../constants');

const router = express.Router({ mergeParams: true });

router.get('/', async (req, res) => {
  const { posts, lastPage } = await getPosts(
    req.query.search,
    req.query.limit,
    req.query.page
  );

  res.send({ data: { lastPage, posts: posts.map(mapPost) } });
});

router.get('/:id', async (req, res) => {
  const post = await getPost(req.params.id);

  res.send({ data: mapPost(post) });
});

router.post('/:id/comments', authenticated, async (req, res) => {
  const newComment = await addComment(req.params.id, {
    content: req.body.content,
    author_id: req.user.id,
  });

  res.send({ data: mapComment(newComment) });
});

router.delete(
  '/:postId/comments/:commentId',
  authenticated,
  hasRole([ROLES.admin, ROLES.moderator]),
  async (req, res) => {
    await deleteComment(req.params.postId, req.params.commentId);

    res.send({ error: null });
  }
);

router.post('/', authenticated, hasRole([ROLES.admin]), async (req, res) => {
  const newPost = await addPost({
    title: req.body.title,
    content: req.body.content,
    image_URL: req.body.image_URL,
  });

  res.send({ data: mapPost(newPost) });
});

router.patch('/:id', authenticated, hasRole([ROLES.admin]), async (req, res) => {
  const updatedPost = await editPost(req.params.id, {
    ...req.body,
  });

  res.send({ data: mapPost(updatedPost) });
});

router.delete('/:id', authenticated, hasRole([ROLES.admin]), async (req, res) => {
  await deletePost(req.params.id);

  res.send({ error: null });
});

module.exports = router;
