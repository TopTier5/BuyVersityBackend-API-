import { Advert } from "../Models/advertModel.js";

export const createAd = async (req, res) => {
  try {
    const { title, category, description, university, location } = req.body;
    const images = req.files.map(file => file.path);
    const vendorId = req.user.id;

    const advert = await Advert.create({
      title, category, description, university, location,
      images, vendorId
    });

    res.status(201).json(advert);
  } catch (err) {
    res.status(500).json({ message: "Error creating ad", error: err.message });
  }
};

export const getAllAds = async (req, res) => {
  const search = req.query.search || "";
  const query = {
    title: { $regex: search, $options: "i" }
  };
  const ads = await Advert.find(query).populate("vendorId", "firstName lastName");
  res.json(ads);
};

export const getAd = async (req, res) => {
  const ad = await Advert.findById(req.params.id);
  if (!ad) return res.status(404).json({ message: "Ad not found" });
  ad.views += 1;
  await ad.save();
  res.json(ad);
};

export const updateAd = async (req, res) => {
  const ad = await Advert.findById(req.params.id);
  if (!ad || ad.vendorId.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  Object.assign(ad, req.body);
  await ad.save();
  res.json(ad);
};

export const deleteAd = async (req, res) => {
  const ad = await Advert.findById(req.params.id);
  if (!ad || ad.vendorId.toString() !== req.user.id)
    return res.status(403).json({ message: "Forbidden" });
  await ad.deleteOne();
  res.json({ message: "Ad deleted" });
};

export const vendorSummary = async (req, res) => {
  const vendorId = req.user.id;
  const totalAds = await Advert.countDocuments({ vendorId });
  const activeAds = await Advert.countDocuments({ vendorId, isActive: true });
  const allAds = await Advert.find({ vendorId });

  const totalViews = allAds.reduce((acc, ad) => acc + ad.views, 0);

  res.json({ totalAds, activeAds, totalViews });
};