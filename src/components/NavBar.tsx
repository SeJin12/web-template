import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GroupsIcon from "@mui/icons-material/Groups";
import HistoryIcon from "@mui/icons-material/History";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import userSlice from "../slices/user";
import { useAppDispatch } from "../store";
import { RootState } from "../store/reducer";
import SettingsIcon from "@mui/icons-material/Settings";
import { grey } from "@mui/material/colors";

interface Props {
  drawerWidth: number | string;
}

type MenuType = {
  title: string;
  link: string;
  image: string;
};

const MenuList: MenuType[] = [
  { title: "Dashboard", link: "/", image: "Dashboard" },
  { title: "시장", link: "/market", image: "Mail" },
  { title: "주문 내역", link: "/list", image: "List" },
  { title: "설정", link: "/setting", image: "Setting" },
];

const getMenuImage = (menu: MenuType) => {
  if (menu.image === "Dashboard") {
    return <DashboardIcon />;
  } else if (menu.image === "Mail") {
    return <StoreOutlinedIcon />;
  } else if (menu.image === "List") {
    return <HistoryIcon />;
  } else if (menu.image === "Setting") {
    return <SettingsIcon />;
  }
  return <></>;
};

const NavBar = ({ drawerWidth }: Props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const [type, setType] = useState<"permanent" | "persistent" | "temporary">(
    "permanent"
  );
  const [openAdmin, setOpenAdmin] = useState(false);
  const [openCommunity, setOpenCommunity] = useState(false);

  const handleClick = (type: "admin" | "community") => {
    if (type === "admin") {
      setOpenAdmin(!openAdmin);
    } else if (type === "community") {
      setOpenCommunity(!openCommunity);
    }
  };

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
      variant={type}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
      }}
      PaperProps={{
        sx: {
          backgroundColor:
            theme.palette.mode === "light" ? "#f4f3f8" : "#24292e",
          borderWidth: 0,
          borderRightWidth: 3,
          borderRightColor:
            theme.palette.mode === "light" ? "#e4e4e5" : "#1f2428",
          // p: 2,
        },
      }}
    >
      <Box>
        <Stack
          // justifyContent={"center"}
          alignItems={"center"}
          height={65}
          flexDirection={"row"}
          gap={1}
          p={2}
        >
          <Typography variant="h3">Ats</Typography>
        </Stack>
        <List
          sx={{
            // paddingTop: 0,
            // paddingBottom: 0,
            pl: 2,
          }}
        >
          {MenuList.map((item, index) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                onClick={() => onClickMenu(item.link)}
                sx={{
                  borderRight: location.pathname === item.link ? 3 : 0,
                  borderRightColor:
                    location.pathname === item.link
                      ? theme.palette.primary.main
                      : theme.palette.text.secondary,
                  marginBottom: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === item.link
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  {getMenuImage(item)}
                </ListItemIcon>
                <ListItemText
                  primary={item.title}
                  sx={{
                    color:
                      location.pathname === item.link
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <List
          sx={{
            pl: 2,
          }}
        >
          <ListItemButton onClick={() => handleClick("community")}>
            <ListItemIcon>
              <GroupsIcon />
            </ListItemIcon>
            <ListItemText primary="커뮤니티" />
            {openCommunity ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openCommunity} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton
                sx={{
                  pl: 4,
                  borderRight: location.pathname === "/notice" ? 3 : 0,
                  marginBottom: 1,
                }}
                onClick={() => onClickMenu("/notice")}
              >
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === "/notice"
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  <NotificationsOutlinedIcon />
                </ListItemIcon>
                <ListItemText
                  primary="공지사항"
                  sx={{
                    color:
                      location.pathname === "/notice"
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                />
              </ListItemButton>
            </List>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon
                  sx={{
                    color:
                      location.pathname === "/board"
                        ? theme.palette.primary.main
                        : theme.palette.text.secondary,
                  }}
                >
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText
                  primary="게시판"
                  sx={{
                    color:
                      location.pathname === "/board"
                        ? theme.palette.text.primary
                        : theme.palette.text.secondary,
                  }}
                />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <List
          sx={{
            pl: 2,
          }}
        >
          <ListItemButton onClick={() => handleClick("admin")}>
            <ListItemIcon>
              <SupervisorAccountIcon />
            </ListItemIcon>
            <ListItemText primary="관리자" />
            {openAdmin ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>
          <Collapse in={openAdmin} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <CodeIcon />
                </ListItemIcon>
                <ListItemText primary="코드 관리" />
              </ListItemButton>
            </List>
            <List component="div" disablePadding>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemIcon>
                  <GppGoodIcon />
                </ListItemIcon>
                <ListItemText primary="권한 관리" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default NavBar;
