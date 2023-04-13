import {BrowserRouter, Routes, Route,} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Delivery from './Components/Delivery'
import Shipping from './Components/Shipping'
import PackageStatus from './Components/PackageStatus'
import ShippingHomePage from './Components/ShippingHomePage'
import Update from './Components/Update'

function App() {
  return (
    <BrowserRouter>
    <Routes>
          <Route path="/" element={<ShippingHomePage />} />
          <Route path="/packagestatus" element={<PackageStatus />} />
          <Route path="/shipping" element={<Shipping />} />
          <Route path="/delivery" element={<Delivery />} />
          <Route path="/update" element={<Update />} />
      </Routes>
  </BrowserRouter>
  );
}

export default App;
