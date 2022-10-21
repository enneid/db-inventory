
import "reflect-metadata";
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'app-stylesheets/index.scss'
import { container } from "tsyringe";
import { Registry } from "./registry";
import { ChakraProvider } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
 
  <React.StrictMode>
    <ChakraProvider>
      <Registry.Provider value={container}> 
        <App />
      </Registry.Provider>
    </ChakraProvider>
  </React.StrictMode>

)
