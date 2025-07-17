import AuthProvider from "../contexts/AuthContext/AuthProvider";

const WithProvider = ({ children }) => {
    return (
        <AuthProvider>
            {children}
        </AuthProvider>
    );
};

export default WithProvider; 