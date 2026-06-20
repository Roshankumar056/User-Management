import { UserProvider } from './context/UserContext';
import { Dashboard } from './pages/Dashboard';

/**
 * App — root component.
 * Wraps the entire application in UserProvider so all pages
 * have access to shared user state and CRUD operations.
 */
function App() {
  return (
    <UserProvider>
      <Dashboard />
    </UserProvider>
  );
}

export default App;
