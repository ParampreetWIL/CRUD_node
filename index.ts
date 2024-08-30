import Express from 'express';
import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { body, param, validationResult } from 'express-validator';
import swaggerUi from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import bodyParser from 'body-parser';

dotenv.configDotenv();
let prisma = new PrismaClient();

const app = Express();
app.use(bodyParser.json())

// Create
// Read
// Update
// Delete

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CRUD API',
      version: '1.0.0',
    },
  },
  apis: ['./index.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


/**
 * @swagger
 * /read:
 *   get:
 *     summary: Retrieve all tasks
 *     description: Fetch all tasks from the database.
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *                   name:
 *                     type: string
 *                     example: "Task Name"
 *                   info:
 *                     type: string
 *                     example: "Task Information"
 *                   isDone:
 *                     type: boolean
 *                     example: false
 */
app.get('/read', async (req, res) => {
  let tasks = await prisma.tasks.findMany({});
  res.json(tasks);
});

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new task
 *     description: Create a new task with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "New Task"
 *               info:
 *                 type: string
 *                 example: "Task details"
 *               isDone:
 *                 type: boolean
 *                 example: false
 *     responses:
 *       200:
 *         description: The created task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "New Task"
 *                 info:
 *                   type: string
 *                   example: "Task details"
 *                 isDone:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */
app.post(
  '/create',
  [body('name').notEmpty(), body('info').default(""), body('isDone').default(false)],
  (req: Express.Request, res: Express.Response) => {
    const result = validationResult(req);
    if (!result.isEmpty()) return res.status(404).send({ errors: result.array() });

    prisma.tasks
      .create({
        data: {
          name: req.body.name,
          info: req.body.info,
          isDone: req.body.isDone,
        },
      })
      .then((result) => {
        console.log(result)
        res.json(result);
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },
);

/**
 * @swagger
 * /update:
 *   post:
 *     summary: Update an existing task
 *     description: Update a task with the provided information.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: integer
 *                 example: 1
 *               name:
 *                 type: string
 *                 example: "Updated Task"
 *               info:
 *                 type: string
 *                 example: "Updated Task details"
 *               isDone:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: The updated task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Updated Task"
 *                 info:
 *                   type: string
 *                   example: "Updated Task details"
 *                 isDone:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */
app.post('/update', [body('name'), body('info'), body('isDone')], (req: Express.Request, res: Express.Response) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.send({ errors: result.array() });

  prisma.tasks
    .update({
      where: {
        id: req.body.id,
      },
      data: {
        name: req.body.name,
        info: req.body.info,
        isDone: req.body.isDone,
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

/**
 * @swagger
 * /delete/{id}:
 *   get:
 *     summary: Delete a task
 *     description: Delete a task by its ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the task to delete
 *     responses:
 *       200:
 *         description: The deleted task.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 1
 *                 name:
 *                   type: string
 *                   example: "Task Name"
 *                 info:
 *                   type: string
 *                   example: "Task Information"
 *                 isDone:
 *                   type: boolean
 *                   example: false
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Server error.
 */
app.get('/delete/:id', param('id').notEmpty(), (req, res) => {
  const result = validationResult(req);
  if (!result.isEmpty()) return res.send({ errors: result.array() });

  prisma.tasks
    .delete({
      where: {
        id: parseInt(req.params!.id)
      },
    })
    .then((result) => {
      res.json(result);
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

app.listen(8080, async () => {
  prisma.$connect().then(() => {
    console.log('Database Connected')
  });

  console.log('Server live at http://localhost:8080');
});
