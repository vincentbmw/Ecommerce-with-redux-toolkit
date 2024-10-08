    import { configureStore } from "@reduxjs/toolkit";
    import { useSelector, useDispatch } from "react-redux";
    import authReducer, { refreshAuthentication } from "./features/slices/authSlice";
    import productReducer from "./features/slices/productSlice";
    import adminReducer from "./features/slices/adminSlice";
    import sellerReducer from "./features/slices/sellerSlice";
    import { listenerMiddleware, startAppListening } from "./listenerMiddleware";

    const store = configureStore({
        reducer: {
            products: productReducer,
            auth: authReducer,
            admin: adminReducer,
            seller: sellerReducer
        },
        middleware: (getDefaultMiddleware) => {
            return getDefaultMiddleware()
                .prepend(listenerMiddleware.middleware);
        },
    });

    startAppListening({
        predicate: (action, currentState) => {
            return (
                currentState.auth.token === null &&
                currentState.auth.user === null &&
                sessionStorage.getItem("isAuthenticated") === "true"
            );
        },
        effect: async (_action, listenerApi) => {
            console.log("Needs update");
            listenerApi.dispatch(refreshAuthentication());
            await listenerApi.delay(800);
        },
    });

    startAppListening({
        predicate: (action) => action.type === "auth/logout",
        effect: async (_action) => {
            sessionStorage.removeItem("isAuthenticated");
            sessionStorage.removeItem("user");
            console.log("Forced logout due to token expiration");
        },
    });

    export type RootState = ReturnType<typeof store.getState>;
    export type AppDispatch = typeof store.dispatch;
    export const useAppSelector = useSelector as <TSelected>(selector: (state: RootState) => TSelected) => TSelected;
    export const useAppDispatch = () => useDispatch<AppDispatch>();
    export default store;
