/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_TRIVO_API_URL: string
    readonly VITE_TRIVO_TOKEN: string
    // Add other env variables here
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }