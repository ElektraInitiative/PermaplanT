import { BrowserRouter } from 'react-router-dom';
import { Fragment } from 'react';
import Pages from './routes/Pages';

function App() {
  return (
    <Fragment>
      <BrowserRouter>
        <Pages />
      </BrowserRouter>
    </Fragment>
  );
}

export default App;
