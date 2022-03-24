import express from "express";

import { requireAuth } from "../../middlewares";
import { BadRequestError } from "../../errors";
import { IndustryRepo } from "../../repos/industry-repo";

const router = express.Router();

router.delete("/industries/:id", requireAuth, async (req, res) => {
  const { id } = req.params;

  const existingIndustry = await IndustryRepo.findById(id);
  if (!existingIndustry) {
    throw new BadRequestError("Industry does not exists");
  }

  // const rfqs = await RfqRepo.findByIndustryId(id);
  // if (rfqs && rfqs.length > 0) {
  //   throw new BadRequestError(
  //     "Industry has RFQs. Delete RFQs first or attach them to another Industry."
  //   );
  // }

  const deletedIndustry = await IndustryRepo.delete(id);
  res.send(deletedIndustry);
});

export { router as deleteIndustryRouter };
