import React from "react";

import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Link,
  Avatar,
} from "@mui/material";

export default function Contacts() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      sx={{
        height: "100vh",
        padding: "2rem",
        backgroundColor: "rgb(249, 250, 251)",
      }}
    >
      <Contact />
      <Contact />
    </Box>
  );
}

function Contact() {
  return (
    <Paper
      sx={{
        display: "flex",
        padding: "2rem",
        marginBottom: "2rem",
        backgroundColor: "white",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "center" },
      }}
    >
      <Avatar
        src="/broken-image.jpg"
        sx={{
          width: 100,
          height: 100,
          marginRight: { xs: 0, sm: "2rem" },
          marginBottom: { xs: "2rem", sm: 0 },
          alignSelf: { xs: "center", sm: "flex-start" },
        }}
      />
      <Box
        display="flex"
        sx={{ alignItems: { xs: "center", sm: "flex-start" } }}
        flexDirection="column"
        justifyContent="space-between"
      >
        <Typography fontWeight="bold">FirstName LastName</Typography>
        <Link href="#">http://linkedin.com/prempreetbrar</Link>

        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Contact Info
        </Typography>
        <Box display="flex">
          <Box padding="0.5rem" marginRight="2rem">
            <Typography sx={{ textDecoration: "underline" }}>
              Phone Number(s):
            </Typography>
            <Typography>(587) 917 - 4521</Typography>
            <Typography>(587) 917 - 4521</Typography>
            <Typography>(587) 917 - 4521</Typography>
          </Box>
          <Box padding="0.5rem">
            <Typography sx={{ textDecoration: "underline" }}>
              Email(s):
            </Typography>
            <Typography>(587) 917 - 4521</Typography>
            <Typography>(587) 917 - 4521</Typography>
            <Typography>(587) 917 - 4521</Typography>
          </Box>
        </Box>
        <Typography sx={{ paddingTop: "2rem" }} fontWeight="bold">
          Employed At
        </Typography>
        <Box padding="0.5rem">
          <Typography sx={{ textDecoration: "underline" }}>
            Email(s):
          </Typography>
          <Typography>(587) 917 - 4521, Role - Cashier</Typography>
          <Typography>(587) 917 - 4521, Role - Supervisor</Typography>
          <Typography>(587) 917 - 4521, Role - Manager</Typography>
        </Box>
      </Box>
    </Paper>
  );
}
