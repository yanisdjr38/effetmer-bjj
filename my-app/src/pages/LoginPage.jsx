import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./LoginPage.scss";

/**
 * LoginPage - Magic link authentication
 * Step 1: Enter email
 * Step 2: Check email for magic link and verify token
 */
export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { requestLogin, verifyLogin, error: authError, isLoading } = useAuth();

  const [authMode, setAuthMode] = useState("login"); // 'login' | 'register'
  const [step, setStep] = useState("email"); // 'email' or 'verify'
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Auto-detect magic link callback parameters
   */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");
    const urlEmail = params.get("email");

    if (urlToken && urlEmail && !isSubmitting) {
      setEmail(urlEmail);
      setToken(urlToken);
      setStep("verify");

      const autoVerify = async () => {
        try {
          setIsSubmitting(true);
          await verifyLogin(urlEmail, urlToken);
          setSuccess("Authentification réussie ! Redirection...");
          setTimeout(() => {
            navigate("/");
          }, 500);
        } catch (err) {
          setError(err.response?.data?.message || "Code invalide ou expiré");
        } finally {
          setIsSubmitting(false);
        }
      };

      autoVerify();
    }
  }, [location.search, navigate, verifyLogin]);

  /**
   * Handle email submission - request magic link
   */
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email.trim()) {
      setError("Veuillez entrer votre email");
      return;
    }

    setIsSubmitting(true);
    try {
      await requestLogin(email);
      setSuccess(`Lien de connexion envoyé à ${email}`);
      setStep("verify");
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'envoi du lien");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle token verification
   */
  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!token.trim()) {
      setError("Veuillez entrer le code du lien");
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyLogin(email, token);
      setSuccess("Authentification réussie ! Redirection...");
      // Navigate based on profile completeness will be handled by App.js
      setTimeout(() => {
        navigate("/");
      }, 500);
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide ou expiré");
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle back to email step
   */
  const handleBackToEmail = () => {
    setStep("email");
    setToken("");
    setError("");
    setSuccess("");
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Logo / Header */}
        <div className="login-header">
          <div className="brand-mark">🥋</div>
          <h1>EFFETMER</h1>
          <p>Système de suivi BJJ premium</p>
        </div>

        {/* Main Content */}
        <div className="login-card">
          <div
            className="auth-mode-switch"
            role="tablist"
            aria-label="Mode d'authentification"
          >
            <button
              type="button"
              className={
                authMode === "login" ? "auth-mode-btn active" : "auth-mode-btn"
              }
              onClick={() => setAuthMode("login")}
            >
              Se connecter
            </button>
            <button
              type="button"
              className={
                authMode === "register"
                  ? "auth-mode-btn active"
                  : "auth-mode-btn"
              }
              onClick={() => setAuthMode("register")}
            >
              Créer un compte
            </button>
          </div>

          {step === "email" ? (
            <>
              <h2>{authMode === "login" ? "Connexion" : "Créer un compte"}</h2>
              <p className="login-subtitle">
                {authMode === "login"
                  ? "Entrez votre email pour recevoir un lien de connexion"
                  : "Créez votre compte avec un lien magique envoyé par email"}
              </p>

              <form onSubmit={handleEmailSubmit}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="votre@email.com"
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>

                {error && <div className="error-message">{error}</div>}
                {authError && <div className="error-message">{authError}</div>}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Envoi en cours..." : "Envoyer le lien"}
                </button>
              </form>

              <div className="login-info">
                <p className="info-text">
                  🔐 Aucun mot de passe requis. Vous recevrez un lien sécurisé
                  par email.
                </p>
              </div>
            </>
          ) : (
            <>
              <h2>Vérifier votre email</h2>
              <p className="login-subtitle">
                Consultez votre email et cliquez sur le lien reçu pour continuer
              </p>

              <form onSubmit={handleVerifySubmit}>
                <div className="form-group">
                  <label htmlFor="token">Code de vérification</label>
                  <input
                    id="token"
                    type="text"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Collez le token du lien"
                    disabled={isSubmitting}
                    autoFocus
                  />
                  <small className="form-hint">
                    Le token se trouve à la fin du lien dans votre email
                  </small>
                </div>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message">{success}</div>}

                <button
                  type="submit"
                  className="btn-primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Vérification..." : "Vérifier"}
                </button>

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={handleBackToEmail}
                  disabled={isSubmitting}
                >
                  ← Retour
                </button>
              </form>

              <div className="login-info">
                <p className="info-text">
                  ⏱️ Le lien expire dans 15 minutes. Vérifiez votre dossier spam
                  si vous ne le voyez pas.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="login-footer">
          <p>Application de gestion d'entraînement BJJ</p>
        </div>
      </div>
    </div>
  );
}
