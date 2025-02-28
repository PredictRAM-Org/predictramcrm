/* eslint-disable perfectionist/sort-imports */
import 'src/global.css';

import { useScrollToTop } from 'src/hooks/use-scroll-to-top';

import Router from 'src/routes/sections';
import ThemeProvider from 'src/theme';
import { useSelector } from 'react-redux';
import MainLoader from './components/loader/main-loader';

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();
  const loading = useSelector((state) => state.user.loading);

  return <ThemeProvider>{loading ? <MainLoader /> : <Router />}</ThemeProvider>;
}
