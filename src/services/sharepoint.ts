import * as pnp from "@pnp/sp";
import { PnpNode, IPnpNodeSettings } from "sp-pnp-node";
import { keys } from "../config/keys";

const SP_SITE = "/sites/Unisystem-oglne";

const src = `${SP_SITE}/Shared Documents/SZJ/PM/!Drzewo katalogów [NIE USUWAĆ!!]`;

const config = {
  siteUrl: `${keys.SP_DOMAIN}${SP_SITE}`,
  strategy: "UserCredentials",
  password: keys.SP_PASSWORD,
  username: keys.SP_USERNAME,
  online: true,
};

const pnpNodeSettings: IPnpNodeSettings = {
  siteUrl: config.siteUrl,
  authOptions: config,
};

export class Sharepoint {
  constructor() {
    const init = async () => {
      try {
        await pnp.sp.setup({
          sp: {
            fetchClientFactory: () => new PnpNode(pnpNodeSettings),
            baseUrl: config.siteUrl,
          },
        });
      } catch (error: any) {
        console.error({ SHAREPOINT_ERROR: error });
        return "init error";
      }
    };
    init();
  }

  async isFolderExist(folder: string) {
    try {
      await pnp.sp.web.getFolderByServerRelativePath(`${folder}`).get();
    } catch (error: any) {
      return false;
    }

    return true;
  }

  async copyTO(to: string) {
    try {
      if (await this.isFolderExist(to)) {
        return "folder exists";
      }
      await pnp.sp.web.getFolderByServerRelativePath(src).copyTo(`${to}`);
    } catch (error: any) {
      console.error({ SP_ERROR: error });
      return "sharepoint error";
    }

    return "ok";
  }
}
