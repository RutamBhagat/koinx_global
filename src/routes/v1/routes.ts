import { Router } from "express";
import cryptoRoutes from "./crypto-routes";

const v1Router = Router();

v1Router.use("/crypto", cryptoRoutes);

export default v1Router;
