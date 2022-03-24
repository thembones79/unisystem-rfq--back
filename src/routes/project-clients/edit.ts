import express, { Request, Response } from "express";
import { body } from "express-validator";

import { validateRequest, requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectClientRepo } from "../../repos/project-client-repo";

const router = express.Router();

router.put(
  "/clients/:id",
  requireAuth,
  [
    body("name")
      .trim()
      .notEmpty()
      .escape()
      .withMessage("You must supply a client name"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, code } = req.body;
    const { id } = req.params;

    const existingClient = await ProjectClientRepo.findById(id);
    if (!existingClient) {
      throw new BadRequestError("Client does not exist");
    }

    const newClient = await ProjectClientRepo.updateData({
      id,
      name,
      code,
    });

    res.status(200).send(newClient);
  }
);

export { router as updateProjectClientRouter };
