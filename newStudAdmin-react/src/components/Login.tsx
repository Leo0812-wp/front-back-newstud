import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/api";
import logo from "../assets/newstud-test 2.png";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);

  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    let active = true;
    authService
      .me()
      .then(() => {
        if (active) navigate("/vouchers", { replace: true });
      })
      .catch(() => {
        if (active) setCheckingSession(false);
      });
    return () => {
      active = false;
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await authService.login({ username, password, rememberMe });
      navigate("/vouchers", { replace: true });
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Identifiants invalides ou erreur serveur.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  if (checkingSession) {
    return <div className="min-h-screen flex items-center justify-center text-gray-600">Chargement...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-4">

      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden flex flex-col md:flex-row animate-[slideUp_0.6s_ease-out]">
        
        {/* LEFT SIDE */}
        <div className="flex-1 bg-gradient-to-br from-[#D73738] to-[#b82829] text-white p-10 flex flex-col justify-center items-center relative overflow-hidden">

          <div className="absolute w-72 h-72 bg-white/10 rounded-full -top-20 -right-20"></div>
          <div className="absolute w-52 h-52 bg-white/10 rounded-full -bottom-10 -left-10"></div>

          <div className="text-center z-10">
             <img 
                src={logo}
                alt="NewStud Logo"
                className="w-40 mx-auto mb-6 drop-shadow-lg"
             />
            <p className="text-lg opacity-90 mb-10">Interface d'administration</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 p-10 flex flex-col justify-center">

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Connexion</h2>
            <p className="text-gray-600 text-sm">Saisissez vos identifiants pour accéder à l'interface admin.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-md animate-[shake_0.3s]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
  
  {/* USERNAME */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Identifiant
    </label>
    <input
      type="text"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      required
      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition"
      placeholder="Votre identifiant"
    />
  </div>

  {/* PASSWORD */}
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      Mot de passe
    </label>

    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 text-gray-800 text-sm focus:outline-none focus:ring-4 focus:ring-red-200 focus:border-red-500 transition"
        placeholder="Votre mot de passe"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-red-500 transition text-xl"
      >
        {showPassword ? "🙈" : "👁️"}
      </button>
    </div>
  </div>

  {/* REMEMBER ME */}
  <div className="flex items-center mt-1">
    <input
      type="checkbox"
      checked={rememberMe}
      onChange={() => setRememberMe(!rememberMe)}
      className="w-4 h-4 accent-red-600 mr-2"
    />
    <label className="text-sm text-gray-700">Se souvenir de moi</label>
  </div>

  {/* SUBMIT BUTTON */}
  <button
    type="submit"
    disabled={loading}
    className="w-full py-3 rounded-xl bg-[#D73738] text-white font-semibold text-lg shadow-lg hover:bg-[#b82829] hover:shadow-xl transition disabled:opacity-60"
  >
    {loading ? "Connexion…" : "Se connecter"}
  </button>
</form>
        </div>
      </div>
    </div>
  );
};

export default Login;
