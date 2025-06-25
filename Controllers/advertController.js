import { Advert } from "../Models/advertModel.js";
import { User } from "../Models/userModel.js";

// 🔧 Helper function to normalize enum input
const normalizeEnum = (value, map) => {
  const key = value?.trim().toLowerCase();
  return map[key] || null;
};

// ✅ CREATE AD
export const createAd = async (req, res) => {
  try {
    const {
      title,
      category,
      description,
      university,
      // contact,
      location,
      price,
      condition
    } = req.body;

    const images = req.files?.map(file => file.path) || [];

    const categoryMap = {
      "electronics": "Electronics",
      "clothing & accessories": "Clothing & Accessories",
      "hostel essentials": "Hostel Essentials",
      "books": "Books",
      "other": "Other"
    };

    const universityMap = {
      "university of ghana": "University Of Ghana",
      "kwame nkrumah university of science and technology (knust)": "Kwame Nkrumah University of Science and Technology (KNUST)",
      "university of cape coast": "University of Cape Coast",
      "university of education, winneba": "University of Education, Winneba",
      "university for development studies": "University for Development Studies",
      "university of mines and technology": "University of Mines and Technology",
      "university of energy and natural resources": "University of Energy and Natural Resources",
      "university of health and allied sciences": "University of Health and Allied Sciences",
      "ashesi university": "Ashesi University",
      "central university": "Central University",
      "pentecost university college": "Pentecost University College",
      "valley view university": "Valley View University",
      "all nations university": "All Nations University",
      "accra institute of technology": "Accra Institute of Technology",
      "methodist university college": "Methodist University College",
      "catholic university college of ghana": "Catholic University College of Ghana",
      "presbyterian university college": "Presbyterian University College",
      "other": "Other"
    };

    const conditionMap = {
      "new": "New",
      "used": "Used"
    };

    const enumCategory = normalizeEnum(category, categoryMap);
    const enumUniversity = normalizeEnum(university, universityMap);
    const enumCondition = normalizeEnum(condition, conditionMap);

    const advert = await Advert.create({
      title,
      category: enumCategory,
      description,
      university: enumUniversity,
      // contact,
      location,
      price,
      condition: enumCondition,
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

// ✅ UPDATE AD (with optional image replacement and enum normalization)
export const updateAd = async (req, res) => {
  try {
    const ad = await Advert.findById(req.params.id);
    if (!ad || ad.vendorId.toString() !== req.user.id)
      return res.status(403).json({ message: "Forbidden" });

    const updatedData = { ...req.body };

    // Normalize enums again if updated
    if (updatedData.category) {
      const categoryMap = {
        "electronics": "Electronics",
        "clothing & accessories": "Clothing & Accessories",
        "hostel essentials": "Hostel Essentials",
        "books": "Books",
        "other": "Other"
      };
      updatedData.category = normalizeEnum(updatedData.category, categoryMap);
    }

    if (updatedData.university) {
      const universityMap = {
        "university of ghana": "University Of Ghana",
        "kwame nkrumah university of science and technology (knust)": "Kwame Nkrumah University of Science and Technology (KNUST)",
        "university of cape coast": "University of Cape Coast",
        "university of education, winneba": "University of Education, Winneba",
        "university for development studies": "University for Development Studies",
        "university of mines and technology": "University of Mines and Technology",
        "university of energy and natural resources": "University of Energy and Natural Resources",
        "university of health and allied sciences": "University of Health and Allied Sciences",
        "ashesi university": "Ashesi University",
        "central university": "Central University",
        "pentecost university college": "Pentecost University College",
        "valley view university": "Valley View University",
        "all nations university": "All Nations University",
        "accra institute of technology": "Accra Institute of Technology",
        "methodist university college": "Methodist University College",
        "catholic university college of ghana": "Catholic University College of Ghana",
        "presbyterian university college": "Presbyterian University College",
        "other": "Other"
      };
      updatedData.university = normalizeEnum(updatedData.university, universityMap);
    }

    if (updatedData.condition) {
      const conditionMap = { "new": "New", "used": "Used" };
      updatedData.condition = normalizeEnum(updatedData.condition, conditionMap);
    }

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



// import { Advert } from "../Models/advertModel.js";
// import { User } from "../Models/userModel.js";

// // Helper function to normalize enums
// const normalizeEnum = (value, map) => {
//   const key = value?.trim().toLowerCase();
//   return map[key] || null;
// };

// // ✅ CREATE AD
// export const createAd = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       university,
//       contact,
//       location,
//       price,
//       condition
//     } = req.body;

//     const images = req.files?.map(file => file.path) || [];

//     const categoryMap = {
//       "electronics": "Electronics",
//       "clothing & accessories": "Clothing & Accessories",
//       "hostel essentials": "Hostel Essentials",
//       "books": "Books",
//       "other": "Other"
//     };

//     const universityMap = {
//       "university of ghana": "University Of Ghana",
//       "kwame nkrumah university of science and technology (knust)": "Kwame Nkrumah University of Science and Technology (KNUST)",
//       "university of cape coast": "University of Cape Coast",
//       "university of education, winneba": "University of Education, Winneba",
//       "university for development studies": "University for Development Studies",
//       "university of mines and technology": "University of Mines and Technology",
//       "university of energy and natural resources": "University of Energy and Natural Resources",
//       "university of health and allied sciences": "University of Health and Allied Sciences",
//       "ashesi university": "Ashesi University",
//       "central university": "Central University",
//       "pentecost university college": "Pentecost University College",
//       "valley view university": "Valley View University",
//       "all nations university": "All Nations University",
//       "accra institute of technology": "Accra Institute of Technology",
//       "methodist university college": "Methodist University College",
//       "catholic university college of ghana": "Catholic University College of Ghana",
//       "presbyterian university college": "Presbyterian University College",
//       "other": "Other"
//     };

//     const conditionMap = {
//       "new": "New",
//       "used": "Used"
//     };

//     const enumCategory = normalizeEnum(category, categoryMap);
//     const enumUniversity = normalizeEnum(university, universityMap);
//     const enumCondition = normalizeEnum(condition, conditionMap);

//     const advert = await Advert.create({
//       title,
//       category: enumCategory,
//       description,
//       university: enumUniversity,
//       contact,
//       location,
//       price,
//       condition: enumCondition,
//       images,
//       vendorId: req.user.id
//     });

//     res.status(201).json(advert);
//   } catch (err) {
//     console.error("Create Ad Error:", err.message);
//     res.status(500).json({ message: "Error creating ad", error: err.message });
//   }
// };

// // ✅ DELETE AD (needed to avoid the import error)
// export const deleteAd = async (req, res) => {
//   try {
//     const ad = await Advert.findById(req.params.id);
//     if (!ad || ad.vendorId.toString() !== req.user.id)
//       return res.status(403).json({ message: "Forbidden" });

//     await ad.deleteOne();
//     res.json({ message: "Ad deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete ad" });
//   }
// };



// import { Advert } from "../Models/advertModel.js";
// import { User } from "../Models/userModel.js";

// const normalizeEnum = (value, map) => {
//   const key = value?.trim().toLowerCase();
//   return map[key] || null;
// };

// export const createAd = async (req, res) => {
//   try {
//     const {
//       title,
//       category,
//       description,
//       university,
//       contact,
//       location,
//       price,
//       condition
//     } = req.body;

//     const images = req.files?.map(file => file.path) || [];

//     const categoryMap = {
//       "electronics": "Electronics",
//       "clothing & accessories": "Clothing & Accessories",
//       "hostel essentials": "Hostel Essentials",
//       "books": "Books",
//       "other": "Other"
//     };

//     const universityMap = {
//       "university of ghana": "University Of Ghana",
//       "kwame nkrumah university of science and technology (knust)": "Kwame Nkrumah University of Science and Technology (KNUST)",
//       "university of cape coast": "University of Cape Coast",
//       "university of education, winneba": "University of Education, Winneba",
//       "university for development studies": "University for Development Studies",
//       "university of mines and technology": "University of Mines and Technology",
//       "university of energy and natural resources": "University of Energy and Natural Resources",
//       "university of health and allied sciences": "University of Health and Allied Sciences",
//       "ashesi university": "Ashesi University",
//       "central university": "Central University",
//       "pentecost university college": "Pentecost University College",
//       "valley view university": "Valley View University",
//       "all nations university": "All Nations University",
//       "accra institute of technology": "Accra Institute of Technology",
//       "methodist university college": "Methodist University College",
//       "catholic university college of ghana": "Catholic University College of Ghana",
//       "presbyterian university college": "Presbyterian University College",
//       "other": "Other"
//     };

//     const conditionMap = {
//       "new": "New",
//       "used": "Used"
//     };

//     const enumCategory = normalizeEnum(category, categoryMap);
//     const enumUniversity = normalizeEnum(university, universityMap);
//     const enumCondition = normalizeEnum(condition, conditionMap);

//     const advert = await Advert.create({
//       title,
//       category: enumCategory,
//       description,
//       university: enumUniversity,
//       contact,
//       location,
//       price,
//       condition: enumCondition,
//       images,
//       vendorId: req.user.id
//     });

//     res.status(201).json(advert);
//   } catch (err) {
//     console.error("Create Ad Error:", err.message);
//     res.status(500).json({ message: "Error creating ad", error: err.message });
//   }
// };

// The rest of your controller functions (getAllAds, getAd, updateAd, deleteAd, vendorSummary) remain unchanged unless you want case-insensitivity there too.




// import { Advert } from "../Models/advertModel.js";
// import { User } from "../Models/userModel.js";

// // ✅ CREATE AD
// export const createAd = async (req, res) => {
//   try {
//     const { title, category, description, university, contact, location } = req.body;
//     const images = req.files?.map(file => file.path) || [];

//     const advert = await Advert.create({
//       title,
//       category,
//       description,
//       price,
//       condition
//       university,
//       location,
//       images,
//       vendorId: req.user.id
//     });

//     res.status(201).json(advert);
//   } catch (err) {
//     console.error("Create Ad Error:", err.message);
//     res.status(500).json({ message: "Error creating ad", error: err.message });
//   }
// };

// // ✅ GET ALL ADS
// export const getAllAds = async (req, res) => {
//   try {
//     const search = req.query.search || "";
//     const query = { title: { $regex: search, $options: "i" } };

//     const ads = await Advert.find(query).populate("vendorId", "firstName lastName");
//     res.json(ads);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch ads" });
//   }
// };

// // ✅ GET SINGLE AD BY ID + INCREMENT VIEWS
// export const getAd = async (req, res) => {
//   try {
//     const ad = await Advert.findById(req.params.id);
//     if (!ad) return res.status(404).json({ message: "Ad not found" });

//     ad.views += 1;
//     await ad.save();
//     res.json(ad);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to fetch ad" });
//   }
// };

// // ✅ UPDATE AD (with optional image replacement)
// export const updateAd = async (req, res) => {
//   try {
//     const ad = await Advert.findById(req.params.id);
//     if (!ad || ad.vendorId.toString() !== req.user.id)
//       return res.status(403).json({ message: "Forbidden" });

//     const updatedData = { ...req.body };

//     if (req.files && req.files.length > 0) {
//       updatedData.images = req.files.map(file => file.path);
//     }

//     Object.assign(ad, updatedData);
//     await ad.save();
//     res.json(ad);
//   } catch (err) {
//     res.status(500).json({ message: "Failed to update ad", error: err.message });
//   }
// };

// // ✅ DELETE AD
// export const deleteAd = async (req, res) => {
//   try {
//     const ad = await Advert.findById(req.params.id);
//     if (!ad || ad.vendorId.toString() !== req.user.id)
//       return res.status(403).json({ message: "Forbidden" });

//     await ad.deleteOne();
//     res.json({ message: "Ad deleted" });
//   } catch (err) {
//     res.status(500).json({ message: "Failed to delete ad" });
//   }
// };

// // ✅ VENDOR SUMMARY (Profile + Total Ads + Date Joined)
// export const vendorSummary = async (req, res) => {
//   try {
//     const vendorId = req.user.id;

//     const user = await User.findById(vendorId).select(
//       "firstName lastName email contact university role createdAt"
//     );

//     if (!user || user.role !== "vendor") {
//       return res.status(404).json({ message: "Vendor not found" });
//     }

//     const totalAds = await Advert.countDocuments({ vendorId });

//     const dateJoined = new Date(user.createdAt).toLocaleDateString("en-GB", {
//       day: "2-digit",
//       month: "short",
//       year: "numeric"
//     });

//     res.json({
//       name: `${user.firstName} ${user.lastName}`,
//       email: user.email,
//       contact: user.contact,
//       university: user.university,
//       dateJoined,
//       totalAds
//     });
//   } catch (err) {
//     console.error("Vendor Summary Error:", err.message);
//     res.status(500).json({ message: "Failed to load vendor summary" });
//   }
// };
