import { useState } from "react"
import { useUser } from "./context"
import { useNavigate } from "react-router-dom"

export default function Login() {

    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const { setUser } = useUser();
    const navigate = useNavigate()

    const handleSubmit = (e) => {
        e.preventDefault()

        // eslint-disable-next-line
        switch (name) {
            case "user":
                // eslint-disable-next-line
                if (password == "userpass") {
                    setUser("user")
                    navigate("/")
                }
                else {
                    setUser(null)
                    navigate("/")
                }
                break;
            case "admin":
                // eslint-disable-next-line
                if (password == "adminpass") {
                    setUser("admin")
                    navigate("/")
                }
                else {
                    setUser(null)
                    navigate("/")
                }
                break;
        }
    }

    return (
        <>
            <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Giriş Yap
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Kullanıcı Adı
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Şifre
                                </label>
                            </div>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                                Giriş Yap
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}
