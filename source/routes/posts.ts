import express from 'express';
import controller from '../controllers/posts';
import user from '../controllers/user'
import { verifyToken } from '../middleware/auth';
const router = express.Router();

router.get('/posts', controller.getPosts);
router.get('/posts/:entryId', controller.getPost);
router.put('/posts/:entryId', controller.updatePost);
router.delete('/posts/:entryId', controller.deletePost);
router.post('/posts', controller.addPost);
router.post('/register', user.register);
router.post('/login', user.login);
router.post('/welcome', verifyToken, (req: express.Request, res: express.Response) => {
    res.status(200).json({
        message: "Welcome 🙌 ",
        // data: req.body
        });
});
export = router;