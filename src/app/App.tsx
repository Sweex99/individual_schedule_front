import './App.css';
import * as AppContainer from './ui/AppContainer.styles'
import { NotificationContainer } from './Components/notification/Notification.styled';
import { Outlet } from 'react-router';
import { UserProvider } from './Context/useAuth';
import { AccountLayout } from './ui/Layouts/Account/AccountLayout';

function App() {
  return (
    <UserProvider>
      <AppContainer.Root>
        <NotificationContainer />
        <AccountLayout />
      </AppContainer.Root>
    </UserProvider>
  );
}

export default App;
