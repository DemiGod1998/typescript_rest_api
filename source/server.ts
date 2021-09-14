import http from 'http';
import express, { Express } from 'express';
import morgan from 'morgan';
import routes from './routes/posts';
import  swaggerUi from 'swagger-ui-express';
const swaggerDocument = require('./swagger/swagger-docs.json');
// const swaggerStyle = require('./swagger/swagger.css');
const router: Express = express();

/** Logging */
router.use(morgan('dev'));
/** Parse the request */
router.use(express.urlencoded({ extended: false }));
/** Takes care of JSON data */
router.use(express.json());

/** RULES OF OUR API */
router.use((req, res, next) => {
    // set the CORS policy
    res.header('Access-Control-Allow-Origin', '*');
    // set the CORS headers
    res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
    // set the CORS method headers
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
        return res.status(200).json({});
    }
    next();
});
 
/** Routes */
router.use('/', routes);

var options = {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none } .swagger-ui .info .title {color: magenta;}',
    // customCssUrl: "/Users/rajansukanth/Desktop/Projects/typescript_rest_api/source/swagger/custom.css"
};
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, options))

/** Error handling */
router.use((req, res, next) => {
    const error = new Error('not found');
    return res.status(404).json({
        message: error.message
    });
});

/** Server */
const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 6060;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));