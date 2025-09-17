import { useAuth } from "../context/AuthContext";

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button
      onClick={logout}
      className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
    >
      Logout
    </button>
  );
}

export default LogoutButton;
