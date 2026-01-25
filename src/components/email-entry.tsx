'use client';
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

    useEffect(() => {
      setEmail(emailText);
    }, [emailText]);

    // Show the error message as placeholder only when the field is empty.
    const placeholderText = !email && error ? error : 'Email address';

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
          placeholder={placeholderText}
          autoComplete="email"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          value={email}
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