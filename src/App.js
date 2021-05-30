import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'reactstrap';
import { Products } from './Products';

function App() {
  return (
    <div className="App">
      <Container>
        <Products />
      </Container>
    </div>
  );
}

export default App;
