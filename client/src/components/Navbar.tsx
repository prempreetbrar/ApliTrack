import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useNavigate, useLocation } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import useAuthContext from "../hooks/useAuthContext";

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [currentPage, setCurrentPage] = React.useState("");

  React.useEffect(() => {
    setCurrentPage(location.pathname.split("/").pop().toUpperCase());
  }, [location]);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (path) => {
    navigate(path);
    handleMenuClose();
  };

  function handleLogoutClick() {
    logout();
  }

  function handleLoginClick() {
    navigate("/auth/login");
    setCurrentPage("");
  }

  function handleSignupClick() {
    navigate("/auth/signup");
    setCurrentPage("");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ display: "flex" }}>
          <Box display="flex" alignItems="center" flex="1" marginRight="auto">
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={handleMenuClick}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h2"
              component="div"
              sx={{
                fontSize: "1.5rem",
                fontWeight: "500",
                display: { xs: "none", sm: "block" },
              }}
            >
              ApliTrack
            </Typography>
          </Box>

          <Typography
            variant="h1"
            sx={{
              fontSize: "1.5rem",
              fontWeight: "500",
              display: "flex",
              flex: "1",
              justifyContent: "center",
            }}
          >
            {currentPage}
          </Typography>
          {user && (
            <Box
              display="flex"
              alignItems="center"
              flex="1"
              marginLeft="auto"
              justifyContent="flex-end"
            >
              <Typography
                sx={{ display: { xs: "none", md: "block" } }}
                component="div"
              >
                {user.data.user.Username}
              </Typography>
              <Button
                color="primary"
                onClick={handleLogoutClick}
                variant="contained"
                disableElevation
              >
                Logout
              </Button>
            </Box>
          )}
          {!user && (
            <Box
              display="flex"
              flex="1"
              marginLeft="auto"
              justifyContent="flex-end"
            >
              <Button
                color="primary"
                onClick={handleLoginClick}
                variant="contained"
                disableElevation
              >
                Login
              </Button>
              <Button
                color="primary"
                onClick={handleSignupClick}
                variant="contained"
                disableElevation
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {user && (
          <MenuItem onClick={() => handleMenuItemClick("/applicants/profile")}>
            Profile
          </MenuItem>
        )}
        {user && (
          <MenuItem
            onClick={() => handleMenuItemClick("/applicants/interviews")}
          >
            Interviews
          </MenuItem>
        )}
        <MenuItem onClick={() => handleMenuItemClick("/contacts")}>
          Contacts
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/companies")}>
          Companies
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/applications")}>
          Applications
        </MenuItem>
      </Menu>
    </Box>
  );
}
