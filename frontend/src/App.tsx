import Pages from './routes/Pages';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  document.documentElement.classList.add('dark');
  return (
    <div>
      <Fragment>
        <BrowserRouter>
          <Pages />
        </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;
