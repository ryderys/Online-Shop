/**
 * @swagger
 * tags:
 *  name: Product
 *  description: Product Module and Routes
 */
/**
 * @swagger
 *  definitions:
 *      publicDefinition:
 *          type: object
 *          properties:
 *              statusCode:                 
 *                  type: integer
 *                  example: 20X
 *              data:
 *                  type: object
 *                  properties:
 *                      message:
 *                          type: string
 *                          example: "the best message for that action"
 */
/**
 * @swagger
 *  components:
 *      schemas:
 *          Color:
 *              type: string
 *              enum:
 *                  - black
 *                  - white
 *                  - gray
 *                  - red
 *                  - blue
 *                  - green
 *                  - orange
 *                  - purple
 *          addProduct:
 *              type: object
 *              required:
 *                  - title
 *                  - summary
 *                  - description
 *              properties:
 *                  title:
 *                      type: string
 *                      description: the title of product
 *                      example: عنوان محصول
 *                  summary:
 *                      type: string
 *                      description: the summary of product
 *                      example: خلاصه ای از محصول
 *                  description:
 *                      type: string
 *                      description: the description of product
 *                      example: توضیحات کامل محصول
 *                  tags:
 *                      type: array
 *                      items:
 *                          type: string
 *                  category:
 *                      type: string
 *                      description: the category of product
 *                      example: دسته بندی محصول
 *                  price:
 *                      type: string
 *                      description: the price of product
 *                      example: 200000
 *                  images:
 *                      type: array
 *                      items:
 *                          type: string
 *                          format: binary
 *                  height:
 *                      type: string
 *                      description: the height of product
 *                      example: 0
 *                  width:
 *                      type: string
 *                      description: the width of product
 *                      example: 0
 *                  length:
 *                      type: string
 *                      description: the length of product packet
 *                      example: 0
 *                  colors:
 *                      $ref: '#/components/schemas/Color'
 */

/**
 * @swagger
 *  /products/add:
 *  post:
 *      summary: add new product
 *      tags:
 *          - Product
 *      requestBody:
 *          content:
 *              multipart/form-data:
 *                  schema:
 *                      $ref: '#/components/schemas/addProduct'
 *      responses:
 *          201:
 *              description: created
 *              content:
 *                  application/json:
 *                      schema:
 *                          $ref: '#/definitions/publicDefinition'
 */