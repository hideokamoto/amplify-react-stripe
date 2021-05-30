import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'reactstrap';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
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
      <Container>
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
