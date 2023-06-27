import { Client } from "@elastic/elasticsearch";
import { ELASTIC_SEARCH_URI } from "./utils/secret";

let url = new URL(ELASTIC_SEARCH_URI);
url["username"] = "elastic";
url["password"] = "xOYKcdGEcsCLX6iCRhO7";
export const esClient = new Client({
  node: {
    url: url
  }
});
