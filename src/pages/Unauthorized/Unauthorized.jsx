import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
            <h2 className="text-3xl font-bold text-red-600">Unauthorized Access!</h2>
            <p className="text-gray-600">You don't have permission to access this page.</p>
            <Link to="/" className="px-4 py-2 bg-[#2C5F95] text-white rounded hover:bg-[#13436F]">
                Go Home
            </Link>
        </div>
    );
};

export default Unauthorized; 