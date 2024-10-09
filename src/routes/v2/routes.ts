import { Router } from "express";
import cryptoRoutes from "./crypto-routes";

const v2Router = Router();

v2Router.use("/crypto", cryptoRoutes);

export default v2Router;
