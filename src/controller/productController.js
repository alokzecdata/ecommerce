import { db } from "../config/db.js";
import { products } from "../models/product.js";
import supabase from "../config/supabase.js";

// Controller functions
export const getProducts = async (req, res) => {
  try {
    const allProducts = await db.select().from(products);
    res.json(allProducts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const [product] = await db
      .select()
      .from(products)
      .where(products.id.eq(parseInt(req.params.id)));

    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock, category } = req.body;
    const file = req.file; // multer handles file upload

    let imageUrl = null;
    if (file) {
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from("product-images") // bucket name
        .upload(`products/${Date.now()}-${file.originalname}`, file.buffer, {
          contentType: file.mimetype,
        });

      if (error) throw error;

      // Get public URL
      const { data: publicUrl } = supabase.storage
        .from("product-images")
        .getPublicUrl(data.path);

      imageUrl = publicUrl.publicUrl;
    }

    // Insert into DB (Drizzle ORM or raw SQL)
    const [newProduct] = await db
      .insert(products)
      .values({
        name,
        price,
        description,
        stock,
        category,
        image_url: imageUrl, // match column name in DB
      })
      .returning();

    res.status(201).json(newProduct);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
};




export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image_url } = req.body;
    const [updatedProduct] = await db
      .update(products)
      .set({ name, description, price, stock, category, image_url, updated_at: new Date(), })
      .where(products.id.eq(parseInt(req.params.id)))
      .returning();

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const [deletedProduct] = await db
      .delete(products)
      .where(products.id.eq(parseInt(req.params.id)))
      .returning();

    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
