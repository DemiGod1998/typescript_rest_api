import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/posts', controller.getPosts);
router.get('/posts/:entryId', controller.getPost);
router.put('/posts/:entryId', controller.updatePost);
router.delete('/posts/:entryId', controller.deletePost);
router.post('/posts', controller.addPost);

export = router;