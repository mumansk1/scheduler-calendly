import React, { useState, useEffect, forwardRef } from 'react';

type EmailEntryProps = {
  emailText?: string;
  className?: string;
  error?: string | null;
  onEmailChange?: (email: string) => void;
};

const EmailEntry = forwardRef<HTMLInputElement, EmailEntryProps>(
  ({ emailText = '', className = '', error = null, onEmailChange }, ref) => {
    const [email, setEmail] = useState(emailText);
    const [showErrorPlaceholder, setShowErrorPlaceholder] = useState(false);

    useEffect(() => {
      setEmail(emailText);
    }, [emailText]);

    useEffect(() => {
      // Show error message inside input as placeholder only if error exists
      setShowErrorPlaceholder(!!error);
    }, [error]);

    return (
      <div className={className} style={{ position: 'relative' }}>
        <label htmlFor="email" className="sr-only">
          Email address
        </label>

        <input
          id="email"
          name="email"
          type="email"
          inputMode="email"
          placeholder={showErrorPlaceholder ? error || '' : 'Email address'}
          autoComplete="off"
          spellCheck={false}
          value={showErrorPlaceholder ? '' : email}
          onChange={(e) => {
            setEmail(e.target.value);
            onEmailChange?.(e.target.value);
          }}

          className={`w-full h-10 px-3 rounded-lg text-sm bg-[#1e2128] border ${
                error ? 'border-red-400 placeholder:text-red-400' : 'border-white/10 placeholder:text-gray-500'
            } outline-none text-white`}
          aria-invalid={!!error}
          aria-describedby={error ? 'email-error' : undefined}
          ref={ref}
        />
      </div>
    );
  }
);

EmailEntry.displayName = 'EmailEntry';

export default EmailEntry;