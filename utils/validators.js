const { z } = require('zod');

const itemSchema = z.object({
  name: z.string().min(1, "Nama barang wajib diisi"),
  description: z.string().optional(),
  stock: z.number().int().min(0, "Stok tidak boleh negatif"),
  price: z.number().min(0, "Harga tidak boleh negatif")
});

module.exports = { itemSchema };