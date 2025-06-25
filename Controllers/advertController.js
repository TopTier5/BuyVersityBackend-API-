import { Advert } from "../Models/advertModel.js";
import { User } from "../Models/userModel.js";

// ✅ CREATE AD
export const createAd = async (req, res) => {
  try {
    const { title, category, description, university, contact, location } = req.body;
    const images = req.files?.map(file => file.path) || [];

    const advert = await Advert.create({
      title,
      category,
      description,
      university,
      location,
      contact,
      images,
      vendorId: req.user.id
    });

    res.status(201).json(advert);
  } catch (err) {
    console.error("Create Ad Error:", err.message);
    res.status(500).json({ message: "Error creating ad", error: err.message });
  }
};

// ✅ GET ALL ADS
export const getAllAds = async (req, res) => {
  try {
    const search = req.query.search || "";
    const query = { title: { $regex: search, $options: "i" } };

    const ads = await Advert.find(query).populate("vendorId", "firstName lastName");
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ads" });
  }
};

// ✅ GET SINGLE AD BY ID + INCREMENT VIEWS
export const getAd = async (req, res) => {
  try {
    const ad = await Advert.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    ad.views += 1;
    await ad.save();
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch ad" });
  }
};

// ✅ UPDATE AD (with optional image replacement)
export const updateAd = async (req, res) => {
  try {
    const ad = await Advert.findById(req.params.id);
    if (!ad || ad.vendorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const updatedData = { ...req.body };

    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => file.path);
    }

    Object.assign(ad, updatedData);
    await ad.save();
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Failed to update ad", error: err.message });
  }
};

// ✅ DELETE AD
export const deleteAd = async (req, res) => {
  try {
    const ad = await Advert.findById(req.params.id);
    if (!ad || ad.vendorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    await ad.deleteOne();
    res.json({ message: "Ad deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ad" });
  }
};

// ✅ VENDOR SUMMARY (Profile + Total Ads + Date Joined)
export const vendorSummary = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const user = await User.findById(vendorId).select(
      "firstName lastName email contact university role createdAt"
    );

    if (!user || user.role !== "vendor") {
      return res.status(404).json({ message: "Vendor not found" });
    }

    const totalAds = await Advert.countDocuments({ vendorId });

    const dateJoined = new Date(user.createdAt).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      contact: user.contact,
      university: user.university,
      dateJoined,
      totalAds
    });
  } catch (err) {
    console.error("Vendor Summary Error:", err.message);
    res.status(500).json({ message: "Failed to load vendor summary" });
  }
};
