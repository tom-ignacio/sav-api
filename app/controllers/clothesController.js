import Clothes from "../models/clothesModel.js";
import Size from "../models/sizeModel.js";

export const getAllClothes = async (req, res) => {
  try {
    const clothes = await Clothes.find();
    const allSizes = await Size.find();

    // Group sizes by clothesId
    const sizesByClothesId = allSizes.reduce((acc, size) => {
      const key = size.clothesId.toString();
      if (!acc[key]) acc[key] = [];
      acc[key].push({
        description: size.description,
        available: size.available
      });
      return acc;
    }, {});

    // Attach sizes to each clothing item
    const clothesWithSizes = clothes.map(item => ({
      ...item.toObject(),
      sizes: sizesByClothesId[item._id.toString()] || []
    }));

    res.status(200).json(clothesWithSizes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const createClothes = async (req, res) => {
  try {
    const { name, description, images, sizes, price } = req.body;

    // Step 1: Upsert the clothing item
    const filter = { name };
    const update = { description, images, price };
    const options = { new: true, upsert: true, runValidators: true };

    const clothes = await Clothes.findOneAndUpdate(filter, update, options);

    // Step 2: Handle sizes
    const incomingSizeDescriptions = sizes.map(size => size.description);
    const existingSizes = await Size.find({ clothesId: clothes._id });

    // Create or update sizes
    for (const size of sizes) {
      await Size.findOneAndUpdate(
        { clothesId: clothes._id, description: size.description },
        { available: size.available ?? true },
        { upsert: true, runValidators: true }
      );
    }

    // Delete sizes that are no longer in the request
    for (const existing of existingSizes) {
      if (!incomingSizeDescriptions.includes(existing.description)) {
        await Size.deleteOne({ _id: existing._id });
      }
    }

    res.status(201).json({ clothes, message: 'Clothes and sizes processed successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};


export const deleteClothes = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the clothing item
    const deletedItem = await Clothes.findByIdAndDelete(id);

    if (!deletedItem) {
      return res.status(404).json({ error: 'Clothes item not found' });
    }

    // Delete all associated sizes
    await Size.deleteMany({ clothesId: id });

    res.status(200).json({ message: 'Clothes item and associated sizes deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

