import axios from "axios";
import { keys } from "../config/keys";
import { BadRequestError } from "../errors";

interface IcreateTask {
  pmEmail: string;
  rfqCode: string;
}

interface IUpdateDescription {
  taskId: string;
  description: string;
}

interface ITeamMember {
  id: number;
  email: string;
}

interface IClickUpUser {
  user: ITeamMember;
}

interface ICreateList {
  listName: string;
  folderId: string;
}

const CLICKUP_UNISYSTEM_RFQ_LIST = 168766394;

const CLICKUP_PM_SPACE = 4625373;

export class ClickUp {
  static async findUserId(email: string) {
    try {
      const response = await axios.get(`https://api.clickup.com/api/v2/team`, {
        headers: { Authorization: keys.CLICKUP_API_SECRET },
      });

      const team = response.data.teams[0].members.map((t: IClickUpUser) => {
        return { id: t.user.id, email: t.user.email };
      });

      const teamMember = team.filter((tm: ITeamMember) =>
        tm.email.includes(email)
      )[0];

      return teamMember?.id || 0;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async createTask({ pmEmail, rfqCode }: IcreateTask) {
    const userId = await this.findUserId(pmEmail);

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_UNISYSTEM_RFQ_LIST}/task`,
        {
          name: rfqCode,
          assignees: [userId],
          status: "open projects",
        },
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );

      return response.data.id;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async createFolder(folderName: string) {
    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/space/${CLICKUP_PM_SPACE}/folder`,
        {
          name: folderName,
        },
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );

      return response.data.id;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async createList({ listName, folderId }: ICreateList) {
    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/folder/${folderId}/list`,
        {
          name: listName,
        },
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );

      return response.data.id;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async updateDescription({ taskId, description }: IUpdateDescription) {
    try {
      const response = await axios.put(
        `https://api.clickup.com/api/v2/task/${taskId}`,
        {
          description,
        },
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );

      return response.data.id;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async getTaskStatus(taskId: string) {
    try {
      const response = await axios.get(
        `https://api.clickup.com/api/v2/task/${taskId}`,
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );

      return response.data.status.status;
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }
}
