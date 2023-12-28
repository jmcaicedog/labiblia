import * as React from "react";
import Box from "@mui/material/Box";
import { createTheme, ThemeProvider, styled } from "@mui/material/styles";

const darkTheme = createTheme({ palette: { mode: "dark" } });
const lightTheme = createTheme({ palette: { mode: "light" } });

export default function Book(props) {
  return (
    <ThemeProvider theme={props.theme ? props.theme : darkTheme}>
      <Box
        sx={{
          p: 2,
          bgcolor: "background.default",
          display: "grid",
          gridTemplateColumns: { md: "1fr 3fr" },
          gap: 2,
        }}
      >
        {props.name ? props.name : "default"}
      </Box>
    </ThemeProvider>
  );
}
