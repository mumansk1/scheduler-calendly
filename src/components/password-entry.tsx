import React, { useState, useEffect, forwardRef } from 'react';

type PasswordEntryProps = {
  passwordText?: string;
  className?: string;
  error?: string | null;
  onPasswordChange?: (password: string) => void;
};

const PasswordEntry = forwardRef<HTMLInputElement, PasswordEntryProps>(
  ({ passwordText = '', className = '', error = null, onPasswordChange }, ref) => {
    const [password, setPassword] = useState(passwordText);
    const [showErrorPlaceholder, setShowErrorPlaceholder] = useState(false);

    useEffect(() => {
      setPassword(passwordText);
    }, [passwordText]);

    useEffect(() => {
      setShowErrorPlaceholder(!!error);
    }, [error]);

    return (
      <div className={className} style={{ position: 'relative' }}>
        <label htmlFor="password" className="sr-only">
          Password
        </label>

        <input
          id="password"
          name="password"
          type="password"
          placeholder={showErrorPlaceholder ? error || '' : 'Password'}
          autoComplete="current-password"
          spellCheck={false}
          value={showErrorPlaceholder ? '' : password}
          onChange={(e) => {
            setPassword(e.target.value);
            onPasswordChange?.(e.target.value);
          }}
          className={`w-full h-10 px-3 rounded-lg text-sm bg-[#1e2128] border ${
            error ? 'border-red-400 placeholder:text-red-400' : 'border-white/10 placeholder:text-gray-500'
          } outline-none text-white`}
          aria-invalid={!!error}
          aria-describedby={error ? 'password-error' : undefined}
          ref={ref}
        />
      </div>
    );
  }
);

PasswordEntry.displayName = 'PasswordEntry';

export default PasswordEntry;