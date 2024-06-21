import express from 'express';
import { ping, submit, read, deleteSubmission, editSubmission, searchByEmail } from '../controllers/submissionController';

const router = express.Router();

router.get('/ping', ping);
router.post('/submit', submit);
router.get('/read', read);
router.delete('/delete', deleteSubmission);
router.put('/edit', editSubmission);
router.get('/search', searchByEmail);

export default router;
