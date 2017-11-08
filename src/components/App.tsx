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
    <div style={styles.container}>
      <AppBar
        title="Can Nahum"
        iconElementLeft={<IconButton><img src="/profile.png" height="40" width="30" /></IconButton>}
        iconStyleLeft={styles.profile}
        iconElementRight={<Menu />}
        style={styles.appBar}
        onLeftIconButtonTouchTap={(e) => handleLink(e, 'https://prezi.com/view/YudSEJ2E9dSpBAnHwPHm/')}
      />
      <div style={styles.appContainer}>
        {...children}
      </div>
    </div>
  );
}

const Menu = (): any => {
  const options: any[] = [
    {
      key: 'github',
      url: 'https://github.com/cannahum',
      label: 'Github'
    },
    {
      key: 'linkedin',
      url: 'https://www.linkedin.com/in/cannahum/',
      label: 'LinkedIn'
    },
    {
      key: 'profile',
      url: 'https://prezi.com/view/YudSEJ2E9dSpBAnHwPHm/',
      label: 'Resume Presentation'
    }
  ]
  return (
    <IconMenu
      iconButtonElement={
        <IconButton><MoreVertIcon color="white" /></IconButton>
      }
      targetOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      {
        options.map((link: { key: string, url: string, label: string }) => (
          <MenuItem primaryText={link.label} key={link.key} onTouchTap={(e) => handleLink(e, link.url)} />
        ))
      }
    </IconMenu>
  );
}

const handleLink = (e: __MaterialUI.TouchTapEvent, url: string) => {
  window.open(url, '__blank');
}

const styles: any = {
  appBar: {
    backgroundColor: 'black'
  },
  container: {
    display: 'flow-root'
  },
  appContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    paddingTop: '10px',
    background: 'beige',
    width: '100%',
    height: '100%'
  },
  profile: {
    marginTop: 0
  }
}

export default App;