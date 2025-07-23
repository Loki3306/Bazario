const Shop = require('../models/Shop');

// Get all shops (with search/filter)
const getShops = async (req, res) => {
  try {
    const { search, category, city, page = 1, limit = 10 } = req.query;
    
    // Build query
    let query = { isActive: true };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (city) {
      query['address.city'] = { $regex: city, $options: 'i' };
    }

    // Execute query with pagination
    const shops = await Shop.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Shop.countDocuments(query);

    res.json({
      shops,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get shops error:', error);
    res.status(500).json({ error: 'Server error while fetching shops' });
  }
};

// Get single shop
const getShop = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id).populate('owner', 'name email phone');
    
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // This line is now changed for consistency
    res.json({ shop });

  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching shop' });
  }
};

// Create shop (merchants only)
const createShop = async (req, res) => {
  try {
    const shopData = {
      ...req.body,
      owner: req.user._id
    };

    const shop = new Shop(shopData);
    await shop.save();

    res.status(201).json({
      message: 'Shop created successfully',
      shop
    });
  } catch (error) {
    console.error('Create shop error:', error);
    res.status(500).json({ error: 'Server error while creating shop' });
  }
};

// Update shop (owner only)
const updateShop = async (req, res) => {
  try {
    const shop = await Shop.findOne({ 
      _id: req.params.id, 
      owner: req.user._id 
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found or unauthorized' });
    }

    Object.assign(shop, req.body);
    await shop.save();

    res.json({
      message: 'Shop updated successfully',
      shop
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error while updating shop' });
  }
};

// Delete shop (owner only)
const deleteShop = async (req, res) => {
  try {
    const shop = await Shop.findOneAndDelete({ 
      _id: req.params.id, 
      owner: req.user._id 
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found or unauthorized' });
    }

    res.json({ message: 'Shop deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error while deleting shop' });
  }
};

// Get merchant's shops
const getMyShops = async (req, res) => {
  try {
    const shops = await Shop.find({ owner: req.user._id })
      .sort({ createdAt: -1 });

    res.json({shops});
  } catch (error) {
    res.status(500).json({ error: 'Server error while fetching your shops' });
  }
};

module.exports = {
  getShops,
  getShop,
  createShop,
  updateShop,
  deleteShop,
  getMyShops
};