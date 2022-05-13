import { NotAuthorizedError } from "../errors";
import { getAllowedData, IRepo, ReqWithUser } from "./getAllowedData";

export const checkPermissions = async (
  req: ReqWithUser,
  repo: IRepo,
  id: string
) => {
  const currentUserData = await getAllowedData(req, repo);

  if (currentUserData) {
    if (!currentUserData.find((x: any) => x.id === parseInt(id))) {
      throw new NotAuthorizedError();
    }
  }
};
