import { BrowserRouter } from 'react-router-dom';
import { Fragment } from 'react';
import NavContainer from './components/Layout/NavContainer';
import Pages from './routes/Pages';

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
          <NavContainer>
            <Pages />
          </NavContainer>
        </BrowserRouter>
      </Fragment>
    </div>
  );
}

export default App;
