import axios from "axios";
import { keys } from "../config/keys";
import { BadRequestError } from "../errors";

type CustomField = {
  id: string;
  value: string;
};

interface ICreateTask {
  pmEmail: string;
  code: string;
  status?: string;
  list?: string;
  description?: string;
}

interface ICreateRndTask {
  description: string;
  priority: string;
  name: string;
  due_date?: any;
  status?: string;
  custom_fields: CustomField[];
  tags: string[];
}

interface IUpdateDescription {
  taskId: string;
  description: string;
}

interface IUpdateStatus {
  taskId: string;
  status: string;
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

const CLICKUP_RND_DEFAULT = 27841908;

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

  static async createTask({
    pmEmail,
    code,
    status,
    list,
    description,
  }: ICreateTask) {
    const userId = await this.findUserId(pmEmail);

    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${
          list || CLICKUP_UNISYSTEM_RFQ_LIST
        }/task`,
        {
          name: code,
          assignees: [userId],
          description,
          status: status || "open projects",
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

  static async createRndTask({
    name,
    description,
    priority,
    status,
    due_date,
    custom_fields,
    tags,
  }: ICreateRndTask) {
    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/list/${CLICKUP_RND_DEFAULT}/task`,
        {
          name,
          description,
          priority,
          due_date: due_date === 0 ? null : due_date,
          custom_fields,
          tags,
          status: status || "Open",
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

  static async updateStatus({ taskId, status }: IUpdateStatus) {
    try {
      const response = await axios.put(
        `https://api.clickup.com/api/v2/task/${taskId}`,
        {
          status,
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

  static async getTaskNameAndStatus(taskId: string) {
    try {
      const response = await axios.get(
        `https://api.clickup.com/api/v2/task/${taskId}`,
        {
          headers: { Authorization: keys.CLICKUP_API_SECRET },
        }
      );
      const { name } = response.data;
      const { status } = response.data.status;

      return { name, status };
    } catch (e: any) {
      console.warn(e);
      throw new BadRequestError(e.response.data.error);
    }
  }

  static async linkTasks(task1Id: string, task2Id: string) {
    try {
      const response = await axios.post(
        `https://api.clickup.com/api/v2/task/${task1Id}/link/${task2Id}/`,
        {},
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
}
