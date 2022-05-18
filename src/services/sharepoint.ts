import * as pnp from "@pnp/sp";
import { PnpNode, IPnpNodeSettings } from "sp-pnp-node";
import { keys } from "../config/keys";

const SP_SITE = "/sites/RocknDevelopment";
const COPY_SOURCE =
  "/Shared Documents/RD - Department Documentation/RD000 - RnD Document template/OPEN/RD000D1/Catalog structure for 2022";
const src = `${SP_SITE}${COPY_SOURCE}`;
const DESTINATION_PATH = "/Shared Documents/UC - Unisystem Custom/";
const dest = `${SP_SITE}${DESTINATION_PATH}`;

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
        return "dupa";
      }
    };
    init();
  }

  async isFolderExist(folder: string) {
    try {
      await pnp.sp.web.getFolderByServerRelativePath(`${dest}${folder}`).get();
    } catch (error: any) {
      return false;
    }

    return true;
  }

  async copyTO(to: string) {
    try {
      if (await this.isFolderExist(to)) {
        return "kupa";
      }
      await pnp.sp.web
        .getFolderByServerRelativePath(src)
        .copyTo(`${dest}${to}`);
    } catch (error: any) {
      console.error({ SP_ERROR: error });
      return "lupa";
    }

    return "zupa";
  }
}
