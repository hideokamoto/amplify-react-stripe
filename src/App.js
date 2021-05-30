import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, Container, Navbar, NavbarBrand } from 'reactstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";
import { Products } from './Products';

function Thanks() {
  return (
    <>
      <p>購入ありがとう！</p>
      <Products />
    </>
  )
}

function App() {
  return (
    <div className="App">
      <Navbar expand color="light">
        <Container>
          <NavbarBrand href="/">Stripe Example app</NavbarBrand>
        </Container>
      </Navbar>
      <Container>
        <Alert color="primary">
          <p>
            Stripeはテストモードです。注文時に利用するクレジットカード番号は、テスト用のものをお使いください。<br/>
            セキュリティコードは<b>任意の3桁の数字</b>、有効期限は<b>任意の将来の年月日</b>を入力します。
          </p>
          <ul>
            <li>4242 4242 4242 4242</li>
            <li>5555 5555 5555 4444</li>
          </ul>
          <p><a href="https://stripe.com/docs/testing#cards">More</a></p>
        </Alert>
        <Router>
          <Switch>
            <Redirect from ="/cancel" to="/" />
            <Route path="/success" component={Thanks} />
            <Route path="/" exact component={Products} />
          </Switch>
        </Router>
      </Container>
    </div>
  );
}

export default App;
