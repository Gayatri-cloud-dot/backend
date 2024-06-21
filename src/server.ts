import express from 'express';
import bodyParser from 'body-parser';
import router from './routes';
import cors from 'cors';

const app = express();
app.use(bodyParser.json());
app.use(cors())

app.use('/', router);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
