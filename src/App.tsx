import {
  CssBaseline,
  PaletteMode,
  Paper,
  Stack,
  ThemeProvider,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import { SnackbarUtilsConfigurator } from "./components/CustomToast";
import HeaderBar from "./components/HeaderBar";
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { darkTheme, lightTheme } from "./config/theme";
import NoticeScreen from "./screens/community/NoticeScreen";
import ListScreen from "./screens/ListScreen";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import MarketScreen from "./screens/MarketScreen";
import SettingScreen from "./screens/SettingScreen";
import { RootState } from "./store/reducer";

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const drawerWidth = 220;
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
        <Stack display={"flex"} flexDirection={"row"} flex={1}>
          <Stack width={isAuthorized ? drawerWidth : 0}>
            {isAuthorized && <NavBar drawerWidth={drawerWidth} />}
            {/* <Paper sx={{ width: drawerWidth }}>asd</Paper> */}
          </Stack>
          <Stack flex={1}>
            {isAuthorized && (
              <HeaderBar mode={mode} toggleColorMode={toggleColorMode} />
            )}
            <Stack flex={1}>
              <Routes>
                <Route
                  path="/login"
                  element={
                    !isAuthorized ? <LoginScreen /> : <Navigate to="/" />
                  }
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
                  path="/market"
                  element={
                    <ProtectedRoute>
                      <MarketScreen />
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
                  path="/notice"
                  element={
                    <ProtectedRoute>
                      <NoticeScreen />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/setting"
                  element={
                    <ProtectedRoute>
                      <SettingScreen />
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
        </Stack>
      </Router>
    </ThemeProvider>
  );
}

export default App;
