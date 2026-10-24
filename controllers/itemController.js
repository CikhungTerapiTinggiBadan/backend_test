const { Op } = require('sequelize');
const Item = require('../models/Item');
const { itemSchema } = require('../utils/validators');

exports.createItem = async (req, res) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await Item.create(validatedData);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

exports.getItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const offset = (page - 1) * limit;

    const { count, rows } = await Item.findAndCountAll({
      where: {
        name: {
          [Op.iLike]: `%${search}%` // iLike untuk pencarian case-insensitive di PostgreSQL
        }
      },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      data: rows
    });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

exports.updateItem = async (req, res) => {
  try {
    const validatedData = itemSchema.parse(req.body);
    const item = await Item.findByPk(req.params.id);
    
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });

    await item.update(validatedData);
    res.json(item);
  } catch (error) {
    res.status(400).json({ error: error.errors || error.message });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByPk(req.params.id);
    
    if (!item) return res.status(404).json({ error: 'Barang tidak ditemukan' });

    await item.destroy();
    res.json({ message: 'Barang berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};