import { AppProvider, useApp } from './AppContext.jsx';
import Login from './components/Login.jsx';
import Shell from './components/Shell.jsx';
import ToastRegion from './components/ToastRegion.jsx';

function Root() {
  const { booted, me } = useApp();
  return (
    <>
      {booted && (me ? <Shell /> : <Login />)}
      <ToastRegion />
    </>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
