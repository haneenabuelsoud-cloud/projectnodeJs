import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function AuthPage({ mode, setUser }) {
  const isSignup = mode === "signup";
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const endpoint = isSignup
        ? "/user/signup"
        : "/user/login";

      const body = isSignup
        ? { name, email, password }
        : { email, password };

      const res = await api.post(endpoint, body);

      const token = res.data.token;
      const user = res.data.data;

      if (!token || !user) {
        throw new Error("Invalid server response");
      }

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      setUser(user);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h1>{isSignup ? "Create Account" : "Login"}</h1>

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            minLength={3}
            maxLength={30}
            required
          />
        )}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          minLength={8}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading
            ? "Please wait..."
            : isSignup
              ? "Sign Up"
              : "Login"}
        </button>
      </form>

      {isSignup ? (
        <p>
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      ) : (
        <p>
          Don't have an account?{" "}
          <Link to="/signup">Sign Up</Link>
        </p>
      )}
    </div>
  );
}

export default AuthPage;