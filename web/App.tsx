
import 'app-stylesheets/App.scss'
import { injectable } from 'tsyringe';
import { ConfigService } from './services/config-service';
import { BaseComponent,  state } from './components/base-component';
import { BrowserRouter, Link, Outlet, Route, Router, Routes } from 'react-router-dom';
import { Departments } from './pages/admin/departments';
import { Resources } from './pages/resources';
import { LandingPage } from './pages/landing-page';
import { Users } from './pages/admin/users';
import { Layout } from './pages/layout';
import { NoPage } from './pages/no-page';
import { Registry } from './registry';



export default class App extends BaseComponent{

  draw(){ 
    return (
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout/> }>
              <Route index element={<LandingPage />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/admin">
                  <Route path='departments' element={< Departments />}></Route>
                  <Route path='users' element={< Users />}></Route>
              </Route>
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
    );
  }
}

