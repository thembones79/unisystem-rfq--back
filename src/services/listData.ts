import { Request } from "express";
import { UserPayload } from "../middlewares/current-user";

interface ReqWithUser extends Request {
  currentUser?: UserPayload;
}

interface IRepo {
  find: () => Promise<any[] | undefined>;
  findByKamId: (kamId: string) => Promise<any[] | undefined>;
}

export const listData = async (req: ReqWithUser, repo: IRepo) => {
  const { currentUser } = req;

  if (!currentUser) return [];

  const isKam = currentUser.role_id > 2;

  if (isKam) {
    const { id } = currentUser;
    return await repo.findByKamId(id);
  } else {
    return await repo.find();
  }
};
