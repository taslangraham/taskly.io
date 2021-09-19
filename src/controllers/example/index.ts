import { Application, Request, Response, Router } from "express";
import { exampleService } from "../../services/example";

module.exports = () => {
  const router = Router();

  /**
   * Create a new Item
   */
  router.post("/", async (req, res) => {
    // This can be easily updated to accept a body as part of the request
    // Then use the details passed in the body to create the new Item
    // Values were hardcoded for demonstration purposes
    try {
      const { success, data } = await exampleService.save("Harry Potter First Book");

      return res.status(201).send(data);

    } catch (error) {
      console.log(error);
      return res.status(500).send("Internal Server Error");
    }
  });

  /**
   * Get all Items
   */
  router.get("/", (req: Request, res: Response) => {
    res.send("Example route - GET");
  });

  /**
   * Get an Item by Id
   */
  router.get("/:id", (req: Request, res: Response) => {
    res.send("Example route - GET /id");

  });

  /**
   * Update an Item
   */
  router.patch("/:id", (req: Request, res: Response) => {
    res.send("Example route - PATCH /id");

  });

  return router;
};
