import React, { useEffect, useState } from "react";
import { Container, Typography, Box, Button, Card, CardMedia, CardContent, CardActions, TextField, Paper } from "@mui/material";
import API from "../api";

function RecipesList({ user }) {
  const [recipes, setRecipes] = useState([]);
  const [adding, setAdding] = useState(false);

  // For adding new recipe
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [addMsg, setAddMsg] = useState("");

  // For editing recipe
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editMsg, setEditMsg] = useState("");

  const fetchRecipes = () => {
    API.get("/recipes")
      .then(res => setRecipes(res.data))
      .catch(() => setRecipes([]));
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const handleAddRecipe = async (e) => {
    e.preventDefault();
    setAddMsg("");
    try {
      await API.post("/recipes", {
        title,
        ingredients: ingredients.split(",").map(i => i.trim()),
        instructions,
        image_url: imageUrl
      });
      setAddMsg("Recipe added!");
      setTitle(""); setIngredients(""); setInstructions(""); setImageUrl("");
      setAdding(false);
      fetchRecipes();
    } catch (err) {
      setAddMsg(err.response?.data?.error || "Error adding recipe");
    }
  };

  const openEdit = (r) => {
    setEditId(r._id);
    setEditTitle(r.title);
    setEditIngredients(r.ingredients.join(", "));
    setEditInstructions(r.instructions);
    setEditImageUrl(r.image_url || "");
    setEditMsg("");
  };

  const handleEditRecipe = async (e) => {
    e.preventDefault();
    setEditMsg("");
    try {
      await API.put(`/recipes/${editId}`, {
        title: editTitle,
        ingredients: editIngredients.split(",").map(i => i.trim()),
        instructions: editInstructions,
        image_url: editImageUrl
      });
      setEditMsg("Updated!");
      setEditId(null);
      fetchRecipes();
    } catch (err) {
      setEditMsg(err.response?.data?.error || "Error updating recipe");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this recipe?")) return;
    try {
      await API.delete(`/recipes/${id}`);
      fetchRecipes();
    } catch (err) {
      alert(err.response?.data?.error || "Error deleting recipe");
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h4">All Recipes</Typography>
        {user && (
          <Button variant="contained" color="success" onClick={() => setAdding(a => !a)}>
            {adding ? "Cancel" : "Add Recipe"}
          </Button>
        )}
      </Box>
      {adding && (
        <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>Add a Recipe</Typography>
          <Box component="form" onSubmit={handleAddRecipe} display="flex" flexDirection="column" gap={2}>
            <TextField label="Title" value={title} onChange={e => setTitle(e.target.value)} required />
            <TextField label="Ingredients (comma separated)" value={ingredients} onChange={e => setIngredients(e.target.value)} required />
            <TextField label="Instructions" value={instructions} onChange={e => setInstructions(e.target.value)} multiline minRows={2} required />
            <TextField label="Image URL (optional)" value={imageUrl} onChange={e => setImageUrl(e.target.value)} />
            <Button type="submit" variant="contained" color="primary">Add Recipe</Button>
            <Typography color={addMsg.startsWith("Recipe added") ? "success.main" : "error"}>{addMsg}</Typography>
          </Box>
        </Paper>
      )}
      <Box display="flex" flexWrap="wrap" gap={3}>
        {recipes.length === 0 && <Typography>No recipes yet.</Typography>}
        {recipes.map(recipe => (
          <Card key={recipe._id} sx={{ width: 320, p: 1, position: "relative" }}>
            {editId === recipe._id ? (
              <Box component="form" onSubmit={handleEditRecipe} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} label="Title" required />
                <TextField value={editIngredients} onChange={e => setEditIngredients(e.target.value)} label="Ingredients" required />
                <TextField value={editInstructions} onChange={e => setEditInstructions(e.target.value)} label="Instructions" multiline minRows={2} required />
                <TextField value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} label="Image URL" />
                <Box display="flex" gap={1}>
                  <Button type="submit" variant="contained" color="success">Save</Button>
                  <Button type="button" variant="outlined" onClick={() => setEditId(null)}>Cancel</Button>
                </Box>
                <Typography color="success.main">{editMsg}</Typography>
              </Box>
            ) : (
              <>
                {recipe.image_url && (
                  <CardMedia
                    component="img"
                    height="140"
                    image={recipe.image_url}
                    alt={recipe.title}
                  />
                )}
                <CardContent>
                  <Typography variant="h6">{recipe.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    <b>By:</b> {recipe.author}<br />
                    <b>Ingredients:</b> {recipe.ingredients.join(", ")}<br />
                    <b>Instructions:</b> {recipe.instructions}
                  </Typography>
                </CardContent>
                {user === recipe.author && (
                  <CardActions>
                    <Button size="small" onClick={() => openEdit(recipe)}>Edit</Button>
                    <Button size="small" color="error" onClick={() => handleDelete(recipe._id)}>Delete</Button>
                  </CardActions>
                )}
              </>
            )}
          </Card>
        ))}
      </Box>
    </Container>
  );
}

export default RecipesList;