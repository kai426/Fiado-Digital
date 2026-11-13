declare global {
  namespace Express {
    interface Request {
      auth: {
        userId: string
        storeId: string
      }
    }
  }
}

export {}
