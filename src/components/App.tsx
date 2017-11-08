import * as React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import Toggle from 'material-ui/Toggle';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import MenuItem from 'material-ui/MenuItem';

interface AppProps {
  children: React.Component[];
}

const App = (props: AppProps): any => {
  const { children } = props;
  return (
    <div>
      <AppBar
        title="Can Nahum"
        iconElementLeft={<IconButton></IconButton>}
        iconElementRight={<Menu />}
        iconStyleRight={styles.iconRight}
        style={styles.appBar}
      />
      <div style={styles.appContainer}>
        {...children}
      </div>
    </div>
  );
}

const Menu = (): any => {
  return (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon /></IconButton>
      }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <MenuItem primaryText="Github Page" />
      <MenuItem primaryText="Profile Presentation" />
      <MenuItem primaryText="LinkedIn" />
    </IconMenu>
  );
}

const styles: any = {
  appBar: {
    backgroundColor: 'black'
  },
  iconRight: {
    color: 'white'
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: '10px',
    background: 'beige',
    width: '100%',
    height: '100%',
  }
}

export default App;