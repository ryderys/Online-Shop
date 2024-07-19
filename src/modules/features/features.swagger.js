/**
 * @swagger
 * tags:
 *  name: Feature
 *  description: Features module an Routes
 */

/**
 * @swagger
 *  components:
 *      schemas:
 *          CreateFeature:
 *              type: object
 *              required:
 *                  -   title
 *                  -   key
 *                  -   type
 *                  -   category
 *              properties:
 *                  title:
 *                      type: string
 *                  key:
 *                      type: string
 *                  category:
 *                      type: string
 *                  guid:
 *                      type: string
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 *          UpdateFeature:
 *              type: object
 *              properties:
 *                  title:
 *                      type: string
 *                  key:
 *                      type: string
 *                  category:
 *                      type: string
 *                  guid:
 *                      type: string
 *                  type:
 *                      type: string
 *                      enum:
 *                          -   number
 *                          -   string
 *                          -   boolean
 *                          -   array
 *                  list:
 *                      type: array
 *                      items:
 *                          type: string
 */

/**
 * @swagger
 * /feature:
 *  post:
 *      summary: create new feature for category
 *      tags:
 *          -   Feature
 *      requestBody:
 *          content:
 *              application/x-www-form-urlencoded:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateFeature'
 *              application/json:
 *                  schema:
 *                      $ref: '#/components/schemas/CreateFeature'
 *      responses:
 *          201:
 *              description: created
 */

/**
 * @swagger
 * /feature:
 *  get:
 *      summary: get all features
 *      tags:
 *          -   Feature
 *      responses:
 *          200:
 *              description: success
 */