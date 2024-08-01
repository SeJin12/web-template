import {
  CssBaseline,
  PaletteMode,
  Stack,
  ThemeProvider,
  useTheme,
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
import NavBar from "./components/NavBar";
import ProtectedRoute from "./components/ProtectedRoute";
import { darkTheme, lightTheme } from "./config/theme";
import ListScreen from "./screens/ListScreen";
import LoginScreen from "./screens/LoginScreen";
import MainScreen from "./screens/MainScreen";
import MarketScreen from "./screens/MarketScreen";
import { RootState } from "./store/reducer";
import NoticeScreen from "./screens/community/NoticeScreen";
import HeaderBar from "./components/HeaderBar";

function App() {
  const [mode, setMode] = useState<PaletteMode>("light");
  const theme = useTheme();
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
        <Stack>
          <Stack>{isAuthorized && <HeaderBar />}</Stack>
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {isAuthorized && <NavBar drawerWidth={drawerWidth} />}
            <Stack
              flex={1}
              height={isAuthorized ? "" : "100vh"}
              width={"88vw"}
              p={isAuthorized ? 2 : 0}
            >
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
