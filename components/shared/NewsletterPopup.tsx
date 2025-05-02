import { useState } from 'react';
import { FiX, FiMail, FiExternalLink } from 'react-icons/fi';
import Button from './Button';

interface NewsletterPopupProps {
  onClose: () => void;
}

// Direct Mailchimp URL from the form
const MAILCHIMP_URL = "https://maiar.us20.list-manage.com/subscribe/post?u=67e841fc441e7b5962cb3ccb7&id=bbea3985f8&f_id=00bd0aeaf0";

export default function NewsletterPopup({ onClose }: NewsletterPopupProps) {
  const [email, setEmail] = useState('');
  const [consent, setConsent] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Clear any previous errors
    setValidationError('');
    
    // Validate email and consent
    if (!email) {
      setValidationError('Please enter a valid email address.');
      return;
    }
    
    if (!consent) {
      setValidationError('Please consent to data sharing.');
      return;
    }
    
    // Instead of AJAX, open a new window with the form pre-filled
    // This matches the behavior of the original form (target="_blank")
    const mailchimpUrl = new URL(MAILCHIMP_URL);
    mailchimpUrl.searchParams.set('EMAIL', email);
    
    // Open in a new window
    window.open(mailchimpUrl.toString(), '_blank');
    
    // Show success message and close popup after delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div
        className="bg-secondary dark:bg-secondary-dark rounded-xl shadow-xl p-6 md:p-8 max-w-md w-full border border-theme-border/30 dark:border-theme-border-dark/30 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-theme-text dark:text-theme-text-dark hover:text-primary dark:hover:text-primary-dark"
          aria-label="Close modal"
        >
          <FiX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <FiMail className="w-12 h-12 text-primary dark:text-primary-dark mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-theme-title dark:text-theme-title-dark">
            Subscribe to our Newsletter
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Stay updated with the latest MultiversX developer news.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mce-EMAIL" className="block font-medium text-sm text-theme-text dark:text-theme-text-dark mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="EMAIL"
              id="mce-EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="bg-white dark:bg-gray-800 block w-full focus:outline-none text-theme-text dark:text-theme-text-dark border border-theme-border dark:border-theme-border-dark focus-within:ring-1 focus-within:ring-primary focus-within:border-primary dark:focus-within:ring-primary-dark dark:focus-within:border-primary-dark font-medium text-sm rounded-md px-3 py-2"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex items-start">
            <input
              id="consent-checkbox"
              type="checkbox"
              checked={consent}
              onChange={(e) => setConsent(e.target.checked)}
              className="h-4 w-4 text-primary dark:text-primary-dark focus:ring-primary border-gray-300 dark:border-gray-600 rounded mt-0.5"
            />
            <label htmlFor="consent-checkbox" className="ml-2 block text-xs text-gray-500 dark:text-gray-400">
              I consent to sharing my email address with Mailchimp for newsletter purposes. <span className="text-red-500">*</span>
            </label>
          </div>

          {validationError && (
            <div className="text-sm p-2 rounded text-center bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300">
              {validationError}
            </div>
          )}

          <Button
            label="Subscribe"
            icon={FiExternalLink}
            class="w-full justify-center"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 text-center mt-2">
            You'll be redirected to complete your subscription
          </p>
        </form>
      </div>
    </div>
  );
} 