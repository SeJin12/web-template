import DashboardIcon from "@mui/icons-material/Dashboard";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ListIcon from "@mui/icons-material/List";
import {
  Avatar,
  Box,
  Button,
  Collapse,
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
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "../store/reducer";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../store";
import userSlice from "../slices/user";
import ListAltOutlinedIcon from "@mui/icons-material/ListAltOutlined";
import { useState } from "react";
import { ExpandLess, ExpandMore, StarBorder } from "@mui/icons-material";
import CodeIcon from "@mui/icons-material/Code";
import GppGoodIcon from "@mui/icons-material/GppGood";
import GroupsIcon from "@mui/icons-material/Groups";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";

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
];

const getMenuImage = (menu: MenuType) => {
  if (menu.image === "Dashboard") {
    return <DashboardIcon />;
  } else if (menu.image === "Mail") {
    return <AccessTimeIcon />;
  } else if (menu.image === "List") {
    return <ListAltOutlinedIcon />;
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
          backgroundColor: theme.palette.background.paper,
          borderWidth: 0,
          // p: 2,
        },
      }}
    >
      <Box>
        <Stack justifyContent={"center"} alignItems={"center"} height={65}>
          <Typography variant="h3">LOGO</Typography>
        </Stack>
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
                  // backgroundColor:
                  //   location.pathname === item.link
                  //     ? theme.palette.primary.main
                  //     : theme.palette.background.paper,
                  borderTopRightRadius: 10,
                  borderBottomRightRadius: 10,
                  // marginTop:1,
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
            paddingTop: 0,
            paddingBottom: 0,
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
                sx={{ pl: 4 }}
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
                <ListItemIcon>
                  <QuestionAnswerIcon />
                </ListItemIcon>
                <ListItemText primary="게시판" />
              </ListItemButton>
            </List>
          </Collapse>
        </List>
        <List
          sx={{
            paddingTop: 0,
            paddingBottom: 0,
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
