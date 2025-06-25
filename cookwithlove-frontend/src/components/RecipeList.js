import React, { useState } from "react";
import {
  Box, Card, CardContent, CardMedia, Typography, Button, TextField, CardActions
} from "@mui/material";

function RecipeList({ recipes, currentUser, onEdit, onDelete }) {
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIngredients, setEditIngredients] = useState("");
  const [editInstructions, setEditInstructions] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editMessage, setEditMessage] = useState("");

  const startEdit = (recipe) => {
    setEditId(recipe._id);
    setEditTitle(recipe.title);
    setEditIngredients(recipe.ingredients.join(", "));
    setEditInstructions(recipe.instructions);
    setEditImageUrl(recipe.image_url || "");
    setEditMessage("");
  };

  const handleEdit = (e, id) => {
    e.preventDefault();
    onEdit(id, editTitle, editIngredients, editInstructions, editImageUrl, setEditMessage, () => setEditId(null));
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={3}>
      {recipes.length === 0 && (
        <Typography>No recipes yet.</Typography>
      )}
      {recipes.map(recipe => (
        <Card key={recipe._id} sx={{ width: 320, p: 1, position: "relative" }}>
          {editId === recipe._id ? (
            <Box component="form" onSubmit={e => handleEdit(e, recipe._id)} sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
              <TextField value={editTitle} onChange={e => setEditTitle(e.target.value)} label="Title" required />
              <TextField value={editIngredients} onChange={e => setEditIngredients(e.target.value)} label="Ingredients" required />
              <TextField value={editInstructions} onChange={e => setEditInstructions(e.target.value)} label="Instructions" multiline minRows={2} required />
              <TextField value={editImageUrl} onChange={e => setEditImageUrl(e.target.value)} label="Image URL" />
              <Box display="flex" gap={1}>
                <Button type="submit" variant="contained" color="success">Save</Button>
                <Button type="button" variant="outlined" onClick={() => setEditId(null)}>Cancel</Button>
              </Box>
              <Typography color="success.main">{editMessage}</Typography>
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
              {currentUser === recipe.author && (
                <CardActions>
                  <Button size="small" onClick={() => startEdit(recipe)}>Edit</Button>
                  <Button size="small" color="error" onClick={() => onDelete(recipe._id)}>Delete</Button>
                </CardActions>
              )}
            </>
          )}
        </Card>
      ))}
    </Box>
  );
}

export default RecipeList;