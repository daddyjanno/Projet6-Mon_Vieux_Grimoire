declare namespace NodeJS {
    interface ProcessEnv {
        DB_PASSWORD: string
        NODE_ENV?: 'development' | 'production' | 'test'
        PORT?: string
    }
}
