import {Router} from 'express';
import { register, signin } from "../controllers/user.controller.js";
import {prediction} from "../controllers/prediction.controller.js"; 
const router = Router()

router.route("/register").post(register)

router.route("/signin").post(signin)
router.route("/prediction").put(prediction)

export default router;