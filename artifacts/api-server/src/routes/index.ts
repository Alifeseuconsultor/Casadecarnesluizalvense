import { Router, type IRouter } from "express";
import healthRouter from "./health";
import ordersRouter from "./orders";
import catalogAdminRouter from "./catalog-admin";

const router: IRouter = Router();

router.use(healthRouter);
router.use(ordersRouter);
router.use(catalogAdminRouter);

export default router;
