import { configureStore } from '@reduxjs/toolkit'

export const store = configureStore({
    reducer: {}
  })
}

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<store['getState']>
export type AppDispatch = AppStore['dispatch']
