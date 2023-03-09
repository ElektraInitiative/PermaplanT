import Pages from './routes/Pages';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <div className="text-white ">
      <Fragment>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;
