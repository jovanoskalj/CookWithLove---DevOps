import React from "react";
import { Container, Typography, Box, Button } from "@mui/material";
import { Link } from "react-router-dom";

function Home({ user }) {
  return (
    <Container maxWidth="md" sx={{ mt: 6 }}>
      <Box textAlign="center">
        <Typography variant="h3" gutterBottom>
          Welcome to CookWithLove!
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Your favorite place to share, discover, and cook new recipes.
        </Typography>
        <Box mt={4}>
          <Button
            component={Link}
            to="/recipes"
            variant="contained"
            color="primary"
            size="large"
            sx={{ mr: 2 }}
          >
            Browse Recipes
          </Button>
          {!user && (
            <>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="secondary"
                size="large"
              >
                Get Started
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default Home;