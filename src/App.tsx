import {
  Box,
  CssBaseline,
  PaletteMode,
  Stack,
  ThemeProvider,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import NavBar from "./components/NavBar";
import { darkTheme, lightTheme } from "./config/theme";
import MainScreen from "./screens/MainScreen";
import SubScreen from "./screens/SubScreen";
import ListScreen from "./screens/ListScreen";
import LoginScreen from "./screens/LoginScreen";
import { useSelector } from "react-redux";
import { RootState } from "./store/reducer";
import ProtectedRoute from "./components/ProtectedRoute";
import { SnackbarUtilsConfigurator } from "./components/CustomToast";

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const theme = useTheme();
  const drawerWidth = 250;
  const { id } = useSelector((state: RootState) => state.userReducer);
  const isAuthorized = id !== "";

  const toggleColorMode = () => {
    setMode((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <CssBaseline />
      <SnackbarUtilsConfigurator />
      <Router>
        <Stack
          sx={{
            display: "flex",
            flexDirection: "row",
          }}
        >
          {isAuthorized && <NavBar drawerWidth={drawerWidth} />}
          <Stack
            flex={1}
            height={"100vh"}
            p={isAuthorized ? 2 : 0}
            sx={
              {
                // backgroundColor:theme.palette.background.paper
              }
            }
          >
            <Routes>
              <Route
                path="/login"
                element={!isAuthorized ? <LoginScreen /> : <Navigate to="/" />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <MainScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sub"
                element={
                  <ProtectedRoute>
                    <SubScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/list"
                element={
                  <ProtectedRoute>
                    <ListScreen />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={<Navigate to={isAuthorized ? "/" : "/login"} />}
              />
            </Routes>
          </Stack>
        </Stack>
      </Router>
    </ThemeProvider>
  );
}

export default App;
