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
    body("kam_id")
      .trim()
      .notEmpty()
      .isNumeric()
      .withMessage("You must supply a KamId"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { name, kam_id } = req.body;
    const { id } = req.params;

    const existingClient = await ProjectClientRepo.findById(id);
    if (!existingClient) {
      throw new BadRequestError("Client does not exist");
    }

    const updatedClient = await ProjectClientRepo.updateData({
      id,
      name,
      kam_id,
    });

    res.status(200).send(updatedClient);
  }
);

export { router as updateProjectClientRouter };
