import { Router } from "express";
import {
  createAd,
  getAllAds,
  getAd,
  updateAd,
  deleteAd,
  vendorSummary
} from "../Controllers/advertController.js";

import { secureRoute } from "../Middleware/auth.js";
import { optionalAuth } from "../Middleware/optionalAuth.js";
import { hasPermission } from "../Middleware/hasPermission.js";
import { upload } from "../Middleware/upload.js";

export const advertRouter = Router();

// Create Ad (protected)
advertRouter.post(
  "/",
  secureRoute,
  hasPermission("vendor"),
  upload.array("images"),
  createAd
);

// Get All Ads — behaves differently based on user role
advertRouter.get("/", optionalAuth, getAllAds);

// Get Single Ad by ID
advertRouter.get("/:id", getAd);

// Update Ad (protected)
advertRouter.put(
  "/:id",
  secureRoute,
  hasPermission("vendor"),
  upload.array("images"),
  updateAd
);

// Delete Ad (protected)
advertRouter.delete(
  "/:id",
  secureRoute,
  hasPermission("vendor"),
  deleteAd
);

// Vendor Summary (protected)
advertRouter.get(
  "/vendor/summary",
  secureRoute,
  hasPermission("vendor"),
  vendorSummary
);




// import { Router } from "express";
// import {
//   createAd, getAllAds, getAd,
//   updateAd, deleteAd, vendorSummary
// } from "../Controllers/advertController.js";
// import { secureRoute } from "../Middleware/auth.js";
// import { upload } from "../Middleware/upload.js";
// import { hasPermission } from "../Middleware/hasPermission.js";

// export const advertRouter = Router();

// advertRouter.post("/", secureRoute, hasPermission("vendor"), upload.array("images"), createAd);
// advertRouter.get("/", getAllAds);
// advertRouter.get("/:id", getAd);
// advertRouter.put("/:id", secureRoute, hasPermission("vendor"), updateAd);
// advertRouter.delete("/:id", secureRoute, hasPermission("vendor"), deleteAd);
// advertRouter.get("/vendor/summary", secureRoute, hasPermission("vendor"), vendorSummary);