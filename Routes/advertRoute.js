import { Router } from "express";
import {
  createAd, getAllAds, getAd,
  updateAd, deleteAd, vendorSummary
} from "../Controllers/advertController.js";
import { secureRoute } from "../Middleware/auth.js";
import { upload } from "../Middleware/upload.js";
import { hasPermission } from "../Middleware/hasPermission.js";

export const advertRouter = Router();

advertRouter.post("/", secureRoute, hasPermission("vendor"), upload.array("images"), createAd);
advertRouter.get("/", getAllAds);
advertRouter.get("/:id", getAd);
advertRouter.put("/:id", secureRoute, hasPermission("vendor"), updateAd);
advertRouter.delete("/:id", secureRoute, hasPermission("vendor"), deleteAd);
advertRouter.get("/vendor/summary", secureRoute, hasPermission("vendor"), vendorSummary);