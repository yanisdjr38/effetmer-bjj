import { useCallback, useState } from "react";
import TrainingScheduleManager from "../components/TrainingScheduleManager";
import { useApp } from "../context/AppContext";
import styles from "./SettingsPage.module.scss";

/**
 * SettingsPage - User preferences, notifications, and app settings
 */
function SettingsPage() {
  const { settings, updateSettings } = useApp();
  const [saveStatus, setSaveStatus] = useState("");

  const handleToggle = useCallback(
    (key) => {
      updateSettings({
        ...settings,
        [key]: !settings[key],
      });
      setSaveStatus("Settings saved!");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    [settings, updateSettings],
  );

  const handleThemeChange = useCallback(
    (theme) => {
      updateSettings({ ...settings, theme });
      document.documentElement.setAttribute("data-theme", theme);
      setSaveStatus("Theme updated!");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    [settings, updateSettings],
  );

  const handleLanguageChange = useCallback(
    (language) => {
      updateSettings({ ...settings, language });
      setSaveStatus("Language updated!");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    [settings, updateSettings],
  );

  return (
    <section className={styles.settingsPage} role="main">
      {/* Header */}
      <div className={styles.header}>
        <h1>Paramètres</h1>
        <p>Configurez votre expérience d'entraînement</p>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={styles.successNotification}>✓ {saveStatus}</div>
      )}

      {/* Preferences Section */}
      <div className={styles.settingsSection}>
        <h2>⚡ Préférences</h2>

        <div className={styles.settingGroup}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <label htmlFor="theme-toggle">Mode sombre</label>
              <p className={styles.settingDescription}>
                Afficher l'application en thème sombre pour réduire la fatigue
                oculaire
              </p>
            </div>
            <div className={styles.settingControl}>
              <button
                className={`${styles.toggleButton} ${settings.theme === "dark" ? styles.active : ""}`}
                onClick={() =>
                  handleThemeChange(
                    settings.theme === "dark" ? "light" : "dark",
                  )
                }
                aria-label="Toggle dark mode"
              >
                {settings.theme === "dark" ? "●" : "○"}
              </button>
            </div>
          </div>

          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <label htmlFor="language-select">Langue</label>
              <p className={styles.settingDescription}>
                Choisissez votre langue préférée
              </p>
            </div>
            <div className={styles.settingControl}>
              <select
                id="language-select"
                className={styles.select}
                value={settings.language}
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="pt">Português</option>
                <option value="es">Español</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className={styles.settingsSection}>
        <h2>🔔 Notifications</h2>

        <div className={styles.settingGroup}>
          <div className={styles.settingItem}>
            <div className={styles.settingLabel}>
              <label htmlFor="notifications-toggle">
                Activer les notifications
              </label>
              <p className={styles.settingDescription}>
                Recevez des rappels pour les sessions à venir et les
                accomplissements
              </p>
            </div>
            <div className={styles.settingControl}>
              <button
                className={`${styles.toggleButton} ${settings.notifications ? styles.active : ""}`}
                onClick={() => handleToggle("notifications")}
                aria-label="Toggle notifications"
              >
                {settings.notifications ? "●" : "○"}
              </button>
            </div>
          </div>

          <div className={styles.notificationTypes}>
            <h3>Types de notification</h3>
            <label
              className={styles.checkboxItem}
              style={{ opacity: settings.notifications ? 1 : 0.5 }}
            >
              <input
                type="checkbox"
                defaultChecked
                disabled={!settings.notifications}
              />
              <span>Rappels d'entraînement</span>
            </label>
            <label
              className={styles.checkboxItem}
              style={{ opacity: settings.notifications ? 1 : 0.5 }}
            >
              <input
                type="checkbox"
                defaultChecked
                disabled={!settings.notifications}
              />
              <span>Accomplissement débloqué</span>
            </label>
            {/* 'Activité d'amis' removed — local app, no community features */}
            <label
              className={styles.checkboxItem}
              style={{ opacity: settings.notifications ? 1 : 0.5 }}
            >
              <input type="checkbox" disabled={!settings.notifications} />
              <span>Défis mensuels</span>
            </label>
          </div>
        </div>
      </div>

      {/* Training Schedule Manager */}
      <TrainingScheduleManager />

      {/* Offline-First Notice */}
      <div className={styles.settingsSection}>
        <h2>🔌 Mode local</h2>
        <div className={styles.settingGroup}>
          <p className={styles.settingDescription}>
            EFFETMER fonctionne entièrement localement sur votre appareil.
            Aucune donnée n'est envoyée à des serveurs externes. Vos données
            d'entraînement restent privées et sous votre contrôle.
          </p>
        </div>
      </div>

      {/* Backup & Restore Section */}
      <div className={styles.settingsSection}>
        <h2>💾 Sauvegarde et restauration</h2>

        <div className={styles.settingGroup}>
          <div className={styles.backupActions}>
            <button className={styles.primaryButton}>
              📁 Exporter les données
            </button>
            <p className={styles.buttonDescription}>
              Téléchargez toutes vos données d'entraînement en fichier JSON
            </p>
          </div>

          <div className={styles.backupActions}>
            <button className={styles.secondaryButton}>
              📄 Importer les données
            </button>
            <p className={styles.buttonDescription}>
              Restaurez les données d'un fichier précédemment exporté
            </p>
          </div>

          <div className={styles.backupActions}>
            <button className={styles.dangerButton}>
              🗑️ Supprimer toutes les données
            </button>
            <p className={styles.buttonDescription}>
              Supprimer toutes les données locales (ceci ne peut pas être
              annulé)
            </p>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className={styles.settingsSection}>
        <h2>ℹ️ À propos</h2>

        <div className={styles.aboutContent}>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Nom de l'application</span>
            <span className={styles.aboutValue}>EFFETMER</span>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Description</span>
            <span className={styles.aboutValue}>Personal BJJ Tracker</span>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Version</span>
            <span className={styles.aboutValue}>2.0.0</span>
          </div>
          <div className={styles.aboutItem}>
            <span className={styles.aboutLabel}>Design</span>
            <span className={styles.aboutValue}>Zenith Flow</span>
          </div>
        </div>

        <div className={styles.aboutLinks}>
          <a href="#privacy">Politique de confidentialité</a>
          <a href="#terms">Conditions d'utilisation</a>
          <a href="#help">Aide et support</a>
          <a href="#feedback">Envoyer des commentaires</a>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.settingsFooter}>
        <p>
          Créé avec ⚡ pour les athètes BJJ. Version {new Date().getFullYear()}
        </p>
      </div>
    </section>
  );
}

export default SettingsPage;
