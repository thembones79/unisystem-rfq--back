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

const CLICKUP_RIVERDI_SUBCATEGORY =
  process.env.NODE_ENV === "production" ? 55059859 : 65635652;

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
    } catch (e) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async createTask({ pmEmail, rfqCode }: IcreateTask) {
    const userId = await this.findUserId(pmEmail);

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_RIVERDI_SUBCATEGORY}/task`,
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
    } catch (e) {
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
    } catch (e) {
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
    } catch (e) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }
}
