import { spsave } from "spsave";
import { keys } from "../config/keys";
import { BadRequestError } from "../errors";

interface IspFileCreate {
  kam: string;
  rfq_code: string;
}

const coreOptions = {
  siteUrl: "https://riverdi.sharepoint.com/sites/ProjectsManagementGroup",
  notification: true,
  checkin: true,
  checkinType: 1,
};

const creds = {
  username: keys.SP_USERNAME,
  password: keys.SP_PASSWORD,
  domain: keys.SP_DOMAIN,
};

const pathModifier = process.env.NODE_ENV === "production" ? "" : "testing/";

export const spFileCreate = async ({ kam, rfq_code }: IspFileCreate) => {
  const fileOptions = {
    folder: `Shared Documents/RIVERDI PROJECTS/${pathModifier}${kam}_!PROSPECTS/${rfq_code}`,
    fileName: "❤️",
    fileContent: " ",
  };

  try {
    await spsave(coreOptions, creds, fileOptions);
  } catch (error) {
    console.error(error);
    throw new BadRequestError("Dir not created");
  }
};
