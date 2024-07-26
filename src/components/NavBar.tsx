import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../store/reducer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";

interface Props {
  drawerWidth: number;
}

type MenuType = {
  title: string;
  link: string;
  image: string;
};

const MenuList: MenuType[] = [
  { title: "홈", link: "/", image: "Dashboard" },
  { title: "SuB", link: "/sub", image: "Mail" },
  { title: "LIST", link: "/list", image: "List" },
];

const getMenuImage = (menu: MenuType) => {
  if (menu.image === "Dashboard") {
    return <DashboardIcon />;
  } else if (menu.image === "Mail") {
    return <AccessTimeIcon />;
  } else if (menu.image === "List") {
    return <ListIcon />;
  }
  return <></>;
};

const NavBar = ({ drawerWidth }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { id, name } = useSelector((state: RootState) => state.userReducer);

  const onClickMenu = (path: string) => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    navigate(path);
  };

  const onClickLogout = () => {
    dispatch(userSlice.actions.setUserLogout());
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        // flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
      PaperProps={{
        sx: {
          backgroundColor: theme.palette.background.paper,
          borderWidth: 0,
          p: 2,
        },
      }}
    >
      <Box
        sx={{
          overflow: "auto",
          // backgroundColor: theme.palette.background.default,
        }}
      >
        <Stack
          // variant="outlined"
          sx={{
            p: 2,
          }}
          gap={2}
        >
          <Stack flexDirection={"row"} justifyContent={"space-evenly"} gap={1}>
            <Box
              sx={
                {
                  // backgroundColor: "red",
                }
              }
            >
              <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                {id.substring(0, 2)}
              </Avatar>
            </Box>
            <Box alignContent={"center"} sx={{}}>
              {name}
            </Box>
          </Stack>
          <Stack>
            <Button variant="outlined" onClick={onClickLogout}>
              <Typography variant="h4">로그아웃</Typography>
            </Button>
          </Stack>
        </Stack>
        <Divider
          sx={{
            mt: 1,
            mb: 1,
          }}
        />
        <List
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
          }}
        >
          {MenuList.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => onClickMenu(item.link)}
                sx={{
                  backgroundColor:
                    location.pathname === item.link
                      ? theme.palette.primary.main
                      : theme.palette.background.paper,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  // marginTop:1,
                  marginBottom: 1,
                }}
              >
                <ListItemIcon>{getMenuImage(item)}</ListItemIcon>
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider
          sx={{
            mt: 1,
            mb: 1,
          }}
        />
      </Box>
    </Drawer>
  );
};

export default NavBar;
