import 'bulmaswatch/superhero/bulmaswatch.min.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './state';
// import CodeCell from './components/code-cell';
import TextEditor from './components/text-editor';

const appElement = document.getElementById('root');

if (!appElement) throw new Error('App element not found');

const root = createRoot(appElement);

const App = () => {

  return (
    <Provider store={store}>
      <div>
        <TextEditor />
        {/* <CodeCell /> */}
      </div>
    </Provider>
  );
};

root.render(<App />);
