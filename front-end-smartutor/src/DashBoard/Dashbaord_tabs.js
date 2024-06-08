import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Tabs, Tab, Button, Row, Col, Modal, Container, Alert, ButtonGroup, Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "./sidebar";
import DashBoardNavbar from "./DashBoardNavbar";
import DisscusionForum from "./DisscusionForum";
import { UserContext } from "../landing_page_component/UserContext";
import userService from "../landing_page_component/UserSerive";
import StudyPlanSettings from "./StudyPlanSettings";
import Footer from "../landing_page_component/footer";
// import { Link,useNavigate } from 'react-router-dom';
import { Editor } from "@tinymce/tinymce-react";
import SettingsIcon from '@mui/icons-material/Settings';
import ForumIcon from '@mui/icons-material/Forum';
import ArticleIcon from '@mui/icons-material/Article';
import AssignmentIcon from '@mui/icons-material/Assignment';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import ScheduleIcon from '@mui/icons-material/Schedule';

import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Navbar from "./DashBoardNavbar";
const drawerWidth = 240;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  backgroundColor: '#1f5692',
});
const CustomListItem = ({ text, open }) => {
	return (
	  <ListItem disablePadding sx={{ display: 'block' }}>
		<ListItemButton
		  sx={{
			minHeight: 48,
			justifyContent: open ? 'initial' : 'center',
			px: 2.5,
		  }}
		>
		  <ListItemIcon
			sx={{
			  minWidth: 0,
			  mr: open ? 3 : 'auto',
			  justifyContent: 'center',
			}}
		  >
			{text === 'Inbox' ? <InboxIcon /> : <MailIcon />}
		  </ListItemIcon>
		  <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
		</ListItemButton>
	  </ListItem>
	);
  };

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: '#1f5692',
  color: 'white',  // Set text color to white
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  backgroundColor: "white",
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    backgroundColor:'blue',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

export default function MiniDrawer({ studyPlan, activeButton }) {
  console.log("activeButton", activeButton); //activeButton="tab3"
  activeButton="tab4"
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };
  const [selectedItem, setSelectedItem] = useState(null);

	const navigate = useNavigate();

	const handleClick = (tab, path) => {
		navigate(path, {
			state: {
				studyPlan,
			},
		});
	};
  const { userData } = useContext(UserContext);
	// const navigate = useNavigate();
	const handleTabChange = (tab) => {
		navigate(tab);
	};
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userData");
		console.log("token removed : ", localStorage);
	};

  const items = ['Inbox', 'Starred', 'Send email', 'Drafts', 'All mail', 'Trash', 'Spam'];
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="black"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
			 
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
           {/* Welcome to DashBoard! */}
          </Typography>
          <Dropdown className="me-3"  style={{ marginLeft:'70%' }} >
          {	userData &&	<Dropdown.Toggle variant="light" id="dropdown-basic" style={{color:'black'}}>
						<img
							src="data:image/png;base64,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"
							height="25"
							alt=""
							loading="lazy"
							style={{ borderRadius: "50%", marginRight: "5px" }}
						/>
						{userData.name}
					</Dropdown.Toggle>
}

					<Dropdown.Menu>
						<Link
							className="dropdown-item"
							to="/my-courses"
							onClick={() => handleTabChange("my-courses")}
						>
							Back to Homepage
						</Link>
		
						<div className="dropdown-divider"></div>
						<Link to="/" onClick={handleLogout} className="dropdown-item">
							Logout
						</Link>
					</Dropdown.Menu>
				</Dropdown>
		  {/* <Navbar /> */}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open} style={{backgroundColor:'blue'}}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <b>
		<List style={{color:'white'}}>
        {/* {items.map((text, index) => ( */}
          <ListItem key={"Quiz Generation"} disablePadding sx={{ display: 'block' }} onClick={() => handleClick("tab2", "/dashboard-quiz-generation")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
               <QuestionAnswerIcon style={{ color: 'white' }}  />
              </ListItemIcon>
              <ListItemText primary={"Quiz Generation"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Study Schedule"} disablePadding sx={{ display: 'block' }} onClick={() => handleClick("tab1", "/dashboard")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
             <ScheduleIcon style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={"Study Schedule"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Summary Generation"} disablePadding sx={{ display: 'block' }} onClick={() => handleClick("tab3", "/dashboard-summary-generation")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
               <ArticleIcon style={{ color: 'white' }}  />
              </ListItemIcon>
              <ListItemText primary={"Summary Generation"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"Disscusion Forum"} disablePadding sx={{ display: 'block' }} onClick={() => handleClick("tab4", "/dashboard-discussion-forum")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <ForumIcon  style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={"Disscusion Forum"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          <ListItem key={"create Study plan"} disablePadding sx={{ display: 'block' }} onClick={() => handleClick("tab5", "/dashboard-settings")}>
            <ListItemButton
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
               <SettingsIcon  style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary={"Settings"} sx={{ opacity: open ? 1 : 0 }} />
            </ListItemButton>
          </ListItem>
          
        {/* ))} */}
      </List>
      </b>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
       
        <Typography paragraph>
          {selectedItem === 'Inbox' && 'Inbox content'}
          {selectedItem === 'Starred' && 'Starred content'}
          {selectedItem === 'Send email' && 'Send email content'}
          {selectedItem === 'Drafts' && 'Drafts content'}
          {selectedItem === 'All mail' && 'All mail content'}
          {selectedItem === 'Trash' && 'Trash content'}
          {selectedItem === 'Spam' && 'Spam content'}
        </Typography>
      </Box>
      </Drawer>

     {activeButton === "tab3" && <Sidebar/>}

    </Box>
  );
}

























// const DashBoardTabs = ({ studyPlan, activeButton }) => {
// 	const navigate = useNavigate();

// 	const handleClick = (tab, path) => {
// 		navigate(path, {
// 			state: {
// 				studyPlan,
// 			},
// 		});
// 	};
// 	return (
// 		<>
// 			<style>
// 				{`
//       body {
//         background-color: #e1efff; /* Set the background color to blue */
//         margin: 0; /* Reset margin for the body */
//         padding: 0; /* Reset padding for the body */
//       }
//     `}
// 			</style>

// 			<div style={{ marginTop: "80px" }}>
// 				<div aria-label="Basic example" style={{ marginLeft: "20%", marginBottom: "3%" }}>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab1" ? "#1f5692" : "white",
// 							color: activeButton === "tab1" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab1" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab1", "/dashboard")}
// 					>
// 						Study Schedule
// 					</Button>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab2" ? "#1f5692" : "white",
// 							color: activeButton === "tab2" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab2" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab2", "/dashboard-quiz-generation")}
// 					>
// 						Quiz Generation
// 					</Button>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab3" ? "#1f5692" : "white",
// 							color: activeButton === "tab3" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab3" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab3", "/dashboard-summary-generation")}
// 					>
// 						Summary Generation
// 					</Button>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab4" ? "#1f5692" : "white",
// 							color: activeButton === "tab4" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab4" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab4", "/dashboard-discussion-forum")}
// 					>
// 						Discussion Forum
// 					</Button>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab6" ? "#1f5692" : "white",
// 							color: activeButton === "tab6" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab6" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab6", "/dashboard-quiz-room")}
// 					>
// 						Quiz Room
// 					</Button>
// 					<Button
// 						style={{
// 							marginLeft: "15px",
// 							backgroundColor: activeButton === "tab5" ? "#1f5692" : "white",
// 							color: activeButton === "tab5" ? "white" : "#1f5692",
// 							borderColor: "white",
// 							fontStyle: "italic",
// 							borderRadius: "10px",
// 						}}
// 						variant={activeButton === "tab5" ? "primary" : "secondary"}
// 						onClick={() => handleClick("tab5", "/dashboard-settings")}
// 					>
// 						Settings
// 					</Button>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default DashBoardTabs;
