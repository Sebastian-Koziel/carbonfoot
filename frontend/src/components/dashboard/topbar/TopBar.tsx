import { AppBar, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';

interface Props {
  handleDrawerToggle: () => void;
}

const TopBar = (props: Props) => {

  const handleDrawerToggle = props.handleDrawerToggle;

  return (
    <AppBar position="fixed" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1}}>
      <Toolbar>
      <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
      </IconButton>
        <Typography variant="h6" noWrap>
          Nazwa Dashboardu
        </Typography>
      </Toolbar>
    </AppBar>
  )
}

export default TopBar