import { User } from "lucide-react";

interface HeaderProps {
  isSignedIn?: boolean;
}

const Header = ({ isSignedIn = false }: HeaderProps) => {
  return (
    <header className="w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-white">TicketExplore</h1>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <button
                className="flex items-center px-4 py-2 border border-purple-500 text-purple-400 bg-transparent hover:bg-purple-500 hover:text-white transition-all duration-300 rounded"
              >
                <User className="w-4 h-4 mr-2" />
                Dashboard
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  className="px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300 rounded"
                >
                  Sign In
                </button>
                <button
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 rounded"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
