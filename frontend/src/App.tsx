import Pages from './routes/Pages';
import { Fragment } from 'react';
import { BrowserRouter } from 'react-router-dom';

function App() {
  if (localStorage.getItem('darkMode') === 'true') {
    localStorage.setItem('darkMode', 'false');
    document.documentElement.classList.remove('dark');
  } else {
    localStorage.setItem('darkMode', 'true');
    document.documentElement.classList.add('dark');
  }

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
