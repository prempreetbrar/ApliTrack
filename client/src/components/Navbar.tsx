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
import { useNavigate } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import useAuthContext from "../hooks/useAuthContext";

export default function Navbar() {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState(null);

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
  }

  function handleSignupClick() {
    navigate("/auth/signup");
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
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
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ApliTrack
          </Typography>
          {user && (
            <Box display="flex" alignItems="center">
              <Typography component="div" sx={{ flexGrow: 1 }}>
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
            <>
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
            </>
          )}
        </Toolbar>
      </AppBar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => handleMenuItemClick("/applicants/profile")}>
          Profile
        </MenuItem>
        <MenuItem onClick={() => handleMenuItemClick("/applicants/interviews")}>
          Interviews
        </MenuItem>
        {/* Add more menu items as needed */}
      </Menu>
    </Box>
  );
}
