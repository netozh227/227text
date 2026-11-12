import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AppProvider } from './context/AppProvider';
import { Layout } from './components/Layout';
import { HomePage } from './pages/HomePage';
import { SchoolPage } from './pages/SchoolPage';
import { ClassPage } from './pages/ClassPage';
import { PhotoPage } from './pages/PhotoPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UploadPage } from './pages/UploadPage';
import { MyClassesPage } from './pages/MyClassesPage';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="schools/:schoolId" element={<SchoolPage />} />
            <Route path="classes/:classId" element={<ClassPage />} />
            <Route path="classes/:classId/upload" element={<UploadPage />} />
            <Route path="photos/:photoId" element={<PhotoPage />} />
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
            <Route path="my" element={<MyClassesPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
