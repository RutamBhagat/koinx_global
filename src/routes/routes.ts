import { Router } from "express";
import v1Routes from "./v1/routes";
import v2Routes from "./v2/routes";

const mainRouter = Router();

mainRouter.use("/v1", v1Routes);
mainRouter.use("/v2", v2Routes);

export default mainRouter;
