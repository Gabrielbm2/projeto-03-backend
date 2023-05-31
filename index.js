const express = require("express");
const { createClient } = require("@supabase/supabase-js");
const cors = require("cors");

const app = express();
const port = 8000;

// Configure a conexão com o banco de dados Supabase
const supabaseUrl = "https://tlrhjzoxijelnkdzjoql.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRscmhqem94aWplbG5rZHpqb3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODU1NTg3NTksImV4cCI6MjAwMTEzNDc1OX0.H2BtP18tpW17o56czE3tEWF2oT85uiKjTvxZqUIq9PM";
const supabase = createClient(supabaseUrl, supabaseKey);

app.use(express.json());
app.use(cors())
// Consultar todos os produtos
app.get("/products", async (req, res) => {
  try {
    const { data, error } = await supabase.from("products").select("*");
    if (error) {
      throw new Error(error.message);
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consultar um produto pelo ID
app.get("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", productId)
      .single();
    if (error) {
      throw new Error(error.message);
    }
    if (data) {
      res.json(data);
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Cadastrar um produto
app.post("/products", async (req, res) => {
  const newProduct = req.body;
  try {
    const { error } = await supabase.from("products").insert(newProduct);
    if (error) {
      throw new Error(error.message);
    }
    res.status(200).json({ message: "created with success!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Alterar um produto
app.put("/products/:id", async (req, res) => {
  const productId = req.params.id;
  const updatedProduct = req.body;
  try {
    const { data, error } = await supabase
      .from("products")
      .update(updatedProduct)
      .eq("id", productId);
    if (error) {
      throw new Error(error.message);
    }
    res.json({data});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deletar um produto
app.delete("/products/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", (productId));
    if (error) {
      throw new Error(error.message);
    }
    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port);
