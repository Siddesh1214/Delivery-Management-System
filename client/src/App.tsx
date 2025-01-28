import { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';

import Loader from './common/Loader';
import PageTitle from './components/PageTitle';
import SignIn from './pages/Authentication/SignIn';
import SignUp from './pages/Authentication/SignUp';
import Chart from './pages/Chart';
import Settings from './pages/Settings';
import DefaultLayout from './layout/DefaultLayout';

// new my developed
import AddPartnerForm from './pages/Form/AddPartnerForm';
import AllPartners from './pages/Dashboard/AllPartners';
import UpdatePartnerForm from './pages/UpdatePartnerForm';
import CreateOrder from './pages/Form/CreateOrder';
import AllOrders from './pages/Dashboard/AllOrders';
import UpdateOrderForm from './pages/UpdateOrderForm';
import AllAssignments from './pages/Dashboard/AllAssignments';
import UpdateAssignmentForm from './pages/UpdateAssignmentForm';
import Instructions from './pages/Dashboard/Instructions';

function App() {
  const [loading, setLoading] = useState<boolean>(true);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <DefaultLayout>
      <Routes>
        <Route
          index
          element={
            <>
              <PageTitle title="Dashboard Instructions " />
              {/* <ECommerce /> */}
              <Instructions/>
              
            </>
          }
        />
        <Route
          path='/allPartners'
          element={
            <>
              <PageTitle title="All Partners" />
              <AllPartners />
            </>
          }
        />
        <Route
          path='/allOrders'
          element={
            <>
              <PageTitle title="All Orders" />
              <AllOrders />
            </>
          }
        />
        <Route
          path='/allAssignments'
          element={
            <>
              <PageTitle title="All Assignments" />
              <AllAssignments />
            </>
          }
        />
          {/* <Route path="/edit-partner/:partnerId" element={<UpdatePartnerForm />} /> */}

          <Route
            path='/edit-partner/:partnerId'
            element={
              <>
                <PageTitle title="Update Partner Form" />
                <UpdatePartnerForm />
              </>
            }
          />
          <Route
            path='/edit-order/:orderId'
            element={
              <>
                <PageTitle title="Update Order Form" />
                <UpdateOrderForm />
              </>
            }
          />
          <Route
            path='/edit-assignment/:assignmentId'
            element={
              <>
                <PageTitle title="Update Assignment Form" />
                <UpdateAssignmentForm />
              </>
            }
          />
        
        
        <Route
          path="/forms/addPartner"
          element={
            <>
              <PageTitle title="Add Partner" />
              {/* <FormElements /> */}
              <AddPartnerForm/>
            </>
          }
        />
        <Route
          path="/forms/createOrder"
          element={
            <>
              <PageTitle title="Create Order " />
              {/* <FormElements /> */}
              <CreateOrder/>
            </>
          }
        />
        
        
        <Route
          path="/settings"
          element={
            <>
              <PageTitle title="Settings" />
              <Settings />
            </>
          }
        />
        <Route
          path="/chart"
          element={
            <>
              <PageTitle title="Basic Chart" />
              <Chart />
            </>
          }
        />
        <Route
          path="/auth/signin"
          element={
            <>
              <PageTitle title="Signin" />
              <SignIn />
            </>
          }
        />
        <Route
          path="/auth/signup"
          element={
            <>
              <PageTitle title="Signup" />
              <SignUp />
            </>
          }
        />
      </Routes>
    </DefaultLayout>
  );
}

export default App;
