import { AuthError } from '@/core';

export interface OTPRepository {
  generateOTP(email: string): Promise<void>;
  verifyOTP(email: string, code: string): Promise<boolean>;
}

export class LocalStorageOTPRepository implements OTPRepository {
  private readonly EXPIRATION_TIME_MS = 5 * 60 * 1000;

  private generateCode(): string {
    const chars = '0123456789';
    return Array.from(
      { length: 6 },
      () => chars[Math.floor(Math.random() * chars.length)]
    ).join('');
  }

  async generateOTP(email: string): Promise<void> {
    const otp = this.generateCode();
    const payload = {
      code: otp,
      timestamp: Date.now(),
    };

    localStorage.setItem(email, JSON.stringify(payload));

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your access code is ready</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            line-height: 1.6;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            overflow: hidden;
        }
        .header {
            padding: 30px 40px;
            background-color: #ffffff;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #e5e5e5;
        }
        .logo {
            height: 40px;
        }
        .login-btn {
            padding: 10px 24px;
            border: none;
            border-radius: 6px;
            background-color: #0052CC;
            color: #ffffff;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s ease;
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
        }
        .login-btn:hover {
            background-color: #003d99;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        .content {
            padding: 40px;
        }
        .greeting {
            font-size: 20px;
            color: #1a1a1a;
            margin-bottom: 20px;
            font-weight: 600;
        }
        .message {
            font-size: 16px;
            color: #4a4a4a;
            margin-bottom: 30px;
            line-height: 1.7;
        }
        .code-container {
            background-color: #f8f9fa;
            border: 1px solid #e5e5e5;
            border-radius: 8px;
            padding: 30px;
            text-align: center;
            margin-bottom: 25px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        }
        .code-label {
            font-size: 14px;
            color: #666;
            margin-bottom: 10px;
        }
        .code {
            font-size: 42px;
            font-weight: 700;
            color: #0052CC;
            letter-spacing: 4px;
            font-family: 'Courier New', monospace;
        }
        .warning {
            text-align: center;
            font-size: 14px;
            color: #666;
            margin-bottom: 20px;
        }
        .note {
            text-align: center;
            font-size: 15px;
            color: #4a4a4a;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .note strong {
            font-weight: 700;
            color: #1a1a1a;
        }
        .signature {
            font-size: 16px;
            color: #4a4a4a;
            margin-top: 30px;
            line-height: 1.6;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e5e5e5;
        }
        .footer-logo {
            height: 35px;
            margin-bottom: 20px;
        }
        .footer-text {
            font-size: 13px;
            color: #999;
            margin-bottom: 20px;
            line-height: 1.5;
        }
        .social-links {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin-bottom: 20px;
        }
        .social-icon {
            width: 36px;
            height: 36px;
            background-color: #e5e5e5;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            text-decoration: none;
            transition: background-color 0.3s ease;
        }
        .social-icon:hover {
            background-color: #d0d0d0;
        }
        .social-icon svg {
            width: 18px;
            height: 18px;
            fill: #666;
        }
        .footer-links {
            font-size: 13px;
            margin-bottom: 15px;
        }
        .footer-links a {
            color: #666;
            text-decoration: none;
            margin: 0 10px;
        }
        .footer-links a:hover {
            text-decoration: underline;
        }
        .copyright {
            font-size: 12px;
            color: #999;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <img src="https://via.placeholder.com/180x40/0052CC/FFFFFF?text=TAMERDigital" alt="TAMERDigital" class="logo">
            <a href="#" class="login-btn">Log in</a>
        </div>
        
        <div class="content">
            <div class="greeting">Hi there 👋</div>
            
            <div class="message">
                Looks like you're trying to log in to your TAMERDigital account (nice move! 🔐).
                <br><br>
                To confirm it's really you, please enter this code in the app:
            </div>
            
            <div class="code-container">
                <div class="code">${otp}</div>
            </div>
            
            <div class="note">
                <strong>Note:</strong> This code expires in 10 minutes, so don't waste time looking for coffee.
            </div>
            
            <div class="signature">
                We're happy to see you back,<br>
                The TAMERDigital Team ✨
            </div>
        </div>
        
        <div class="footer">
            <img src="https://via.placeholder.com/180x35/0052CC/FFFFFF?text=TAMERDigital" alt="TAMERDigital" class="footer-logo">
            
            <div class="footer-text">
                You have received this email because you are registered at TAMERDigital, to ensure the<br>
                implementation of our Terms of Service and (or) for other legitimate matters.
            </div>
            
            <div class="social-links">
                <a href="https://www.linkedin.com/company/107227539" class="social-icon" title="LinkedIn">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                </a>
                <a href="https://www.facebook.com/TAMERDigit4l" class="social-icon" title="Facebook">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                    </svg>
                </a>
                <a href="https://www.instagram.com/digitaltamer" class="social-icon" title="Instagram">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                </a>
                <a href="https://www.youtube.com/@jraydelsanchz" class="social-icon" title="YouTube">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
                    </svg>
                </a>
            </div>
            
            <div class="footer-links">
                <a href="#">Privacy policy</a>
            </div>
            
            <div class="copyright">
                © 2022-2025 TAMERDigital
            </div>
        </div>
    </div>
</body>
</html>`;

    const response = await fetch('/api/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: email,
        subject: 'Second Factor Authentication Code',
        html: html,
      }),
    });

    const data = await response.json();
    if (!response.ok)
      throw Error('Error sending second factor verification email', data);
  }

  async verifyOTP(email: string, code: string): Promise<boolean> {
    const storedData = localStorage.getItem(email);
    if (!storedData) return false;

    const { code: storedCode, timestamp } = JSON.parse(storedData);

    const now = Date.now();
    const expired = now - timestamp > this.EXPIRATION_TIME_MS;

    if (expired) {
      localStorage.removeItem(email);
      console.warn('OTP expirado para', email);
      return false;
    }

    if (storedCode === code) {
      localStorage.removeItem(email);
      return true;
    }

    return false;
  }
}
