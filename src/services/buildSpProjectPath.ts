import { spPath } from "./spFileCreate";

interface IProject {
  department: string;
  client: string;
  kam_folder: string;
  project_code: string;
}

export const buildSpProjectPath = (project: IProject) => {
  const { department, client, kam_folder, project_code } = project;
  const sp = spPath({ department, clientName: client, kam: kam_folder });
  const { urlPath, folderPath } = sp;
  return `${urlPath.substring(33)}/${folderPath}${project_code}`;
};
