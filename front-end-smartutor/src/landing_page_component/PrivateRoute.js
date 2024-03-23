import { Route, redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) =>
      localStorage.getItem('user') ? (
        <Component {...props} />
      ) : (
        <redirect to="/landingpage" /> // Redirect to the login page if the user is not found in localStorage
      )
    }
  />
);

export default PrivateRoute;
