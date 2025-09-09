//landingPageService
import axios from "axios";
import { getBackendUrl } from "./getBackendUrl";
import { middleField } from "./middlefield";

class LandingPageService {
    constructor(baseURL) {
        this.baseURL = baseURL;
        this.api = axios.create({
            baseURL,
        });
        middleField(this.api);
    }

    publishLandingPage(lpId, scope) {
        return this.api.post("/publish", {lpId, scope});
    }
    unPublishLandingPage(lpId, scope) {
        return this.api.post("/unPublish", {lpId, scope});
    }
}

export default new LandingPageService(`${getBackendUrl()}/landingPage`);

