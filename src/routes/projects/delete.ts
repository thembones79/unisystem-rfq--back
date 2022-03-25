import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { ProjectClientRepo } from "../../repos/project-client-repo";

const router = express.Router();

router.delete("/clients/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingClient = await ProjectClientRepo.findById(id);
  if (!existingClient) {
    throw new BadRequestError("Client does not exist");
  }

  // const rfqs = await RfqRepo.findByDistributorId(id);
  // if (rfqs && rfqs.length > 0) {
  //   throw new BadRequestError(
  //     "Client has RFQs. Delete RFQs first or attach them to another distributor."
  //   );
  // }

  const deletedProjectClient = await ProjectClientRepo.delete(id);
  res.send(deletedProjectClient);
});

export { router as deleteProjectClientRouter };
