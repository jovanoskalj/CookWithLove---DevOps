import React, { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

function AddRecipeForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [ingredients, setIngredients] = useState("");
  const [instructions, setInstructions] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");

  return (
    <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>Add a Recipe</Typography>
      <Box component="form" onSubmit={e => {
        e.preventDefault();
        onAdd(title, ingredients, instructions, imageUrl, setMessage, () => {
          setTitle(""); setIngredients(""); setInstructions(""); setImageUrl("");
        });
      }} display="flex" flexDirection="column" gap={2}>
        <TextField
          label="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          required
        />
        <TextField
          label="Ingredients (comma separated)"
          value={ingredients}
          onChange={e => setIngredients(e.target.value)}
          required
        />
        <TextField
          label="Instructions"
          value={instructions}
          multiline
          minRows={2}
          onChange={e => setInstructions(e.target.value)}
          required
        />
        <TextField
          label="Image URL (optional)"
          value={imageUrl}
          onChange={e => setImageUrl(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary">Add Recipe</Button>
        <Typography color="success.main">{message}</Typography>
      </Box>
    </Paper>
  );
}

export default AddRecipeForm;