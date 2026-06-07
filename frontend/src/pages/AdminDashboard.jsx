import { useAuth } from '../context/AuthContext'

export default function AdminDashboard() {
  const { user, isAuthenticated, login, logout } = useAuth()

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-black">
        <div className="w-full max-w-md p-8 space-y-6">
          <h1 className="text-3xl font-black text-center">Admin Login</h1>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              const form = new FormData(e.currentTarget)
              login(form.get('email'), form.get('password'))
            }}
            className="space-y-4"
          >
            <input
              name="email"
              type="email"
              placeholder="Email"
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <input
              name="password"
              type="password"
              placeholder="Password"
              required
              className="w-full px-4 py-3 rounded-xl border"
            />
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-bold rounded-xl"
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="px-6 py-2 bg-red-500 text-white rounded-xl font-bold"
          >
            Logout
          </button>
        </div>
        <p className="text-gray-500">Welcome back, {user?.email}</p>
      </div>
    </div>
  )
}
