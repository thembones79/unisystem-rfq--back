import { spsave } from "spsave";
import { keys } from "../config/keys";

import { BadRequestError } from "../errors";

interface IspPath {
  department: string;
  clientName: string;
  kam: string;
}

interface IspFileCreate extends IspPath {
  projectCode: string;
}

const creds = {
  username: keys.SP_USERNAME,
  password: keys.SP_PASSWORD,
  domain: keys.SP_DOMAIN,
};

const spPath = ({ department, clientName, kam }: IspPath) => {
  if (department === "EX") {
    return {
      urlPath: `${creds.domain}/sites/SalesEX`,
      folderPath: `Shared Documents/Projects/${clientName}/`,
    };
  } else if (department === "PL") {
    return {
      urlPath: `${creds.domain}/sites/Customers-${kam}`,
      folderPath: `Shared Documents/${clientName}/`,
    };
  } else {
    throw new BadRequestError(`Department ${department} does not exist!`);
  }
};

export const spFileCreate = async ({
  projectCode,
  clientName,
  kam,
  department,
}: IspFileCreate) => {
  const path = spPath({ clientName, kam, department });

  const coreOptions = {
    siteUrl: path.urlPath,
    notification: true,
    checkin: true,
    checkinType: 1,
  };

  const fileOptions = {
    folder: path.folderPath + projectCode,
    fileName: "❤️",
    fileContent: " ",
  };

  try {
    await spsave(coreOptions, creds, fileOptions);
  } catch (error: any) {
    console.error(error);
    throw new BadRequestError("Dir not created");
  }
};
