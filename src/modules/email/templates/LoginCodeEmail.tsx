import {
  Body,
  Container,
  Head,
  Html,
  Img,
  Link,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface LoginCodeEmailProps {
  code: string;
}

export const LoginCodeEmail = ({ code }: LoginCodeEmailProps) => {
  return (
    <Html lang="en">
      <Head />
      <Body style={bodyStyle}>
        <Container style={containerStyle}>
          {/* Header */}
          <Section style={headerStyle}>
            <Img
              src="https://via.placeholder.com/180x40/0052CC/FFFFFF?text=TAMERDigital"
              alt="TAMERDigital"
              style={logoStyle}
            />
            <Link href="#" style={loginBtnStyle}>
              Log in
            </Link>
          </Section>

          {/* Content */}
          <Section style={contentStyle}>
            <Text style={greetingStyle}>Hi there 👋</Text>

            <Text style={messageStyle}>
              Looks like you're trying to log in to your TAMERDigital account
              (nice move! 🔐).
              <br />
              <br />
              To confirm it's really you, please enter this code in the app:
            </Text>

            <Section style={codeContainerStyle}>
              <Text style={codeStyle}>{code}</Text>
            </Section>

            <Text style={noteStyle}>
              <strong style={strongStyle}>Note:</strong> This code expires in 10
              minutes, so don't waste time looking for coffee.
            </Text>

            <Text style={signatureStyle}>
              We're happy to see you back,
              <br />
              The TAMERDigital Team ✨
            </Text>
          </Section>

          {/* Footer */}
          <Section style={footerStyle}>
            <Img
              src="https://via.placeholder.com/180x35/0052CC/FFFFFF?text=TAMERDigital"
              alt="TAMERDigital"
              style={footerLogoStyle}
            />

            <Text style={footerTextStyle}>
              You have received this email because you are registered at
              TAMERDigital, to ensure the
              <br />
              implementation of our Terms of Service and (or) for other
              legitimate matters.
            </Text>

            <Section style={socialLinksStyle}>
              <Link
                href="https://www.linkedin.com/company/107227539"
                style={socialIconStyle}
                title="LinkedIn"
              >
                <Img
                  src="data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z'/%3E%3C/svg%3E"
                  alt="LinkedIn"
                  width="18"
                  height="18"
                />
              </Link>
              <Link
                href="https://www.facebook.com/TAMERDigit4l"
                style={socialIconStyle}
                title="Facebook"
              >
                <Img
                  src="data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z'/%3E%3C/svg%3E"
                  alt="Facebook"
                  width="18"
                  height="18"
                />
              </Link>
              <Link
                href="https://www.instagram.com/digitaltamer"
                style={socialIconStyle}
                title="Instagram"
              >
                <Img
                  src="data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z'/%3E%3C/svg%3E"
                  alt="Instagram"
                  width="18"
                  height="18"
                />
              </Link>
              <Link
                href="https://www.youtube.com/@jraydelsanchz"
                style={socialIconStyle}
                title="YouTube"
              >
                <Img
                  src="data:image/svg+xml,%3Csvg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23666' d='M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z'/%3E%3C/svg%3E"
                  alt="YouTube"
                  width="18"
                  height="18"
                />
              </Link>
            </Section>

            <Text style={footerLinksStyle}>
              <Link href="#" style={footerLinkStyle}>
                Privacy policy
              </Link>
            </Text>

            <Text style={copyrightStyle}>© 2022-2025 TAMERDigital</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export default LoginCodeEmail;

// Styles
const bodyStyle: React.CSSProperties = {
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  backgroundColor: "#f5f5f5",
  padding: "20px",
  lineHeight: "1.6",
};

const containerStyle: React.CSSProperties = {
  maxWidth: "600px",
  margin: "0 auto",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
};

const headerStyle: React.CSSProperties = {
  padding: "30px 40px",
  backgroundColor: "#ffffff",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  borderBottom: "1px solid #e5e5e5",
};

const logoStyle: React.CSSProperties = {
  height: "40px",
};

const loginBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#0052CC",
  color: "#ffffff",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
  display: "inline-block",
};

const contentStyle: React.CSSProperties = {
  padding: "40px",
};

const greetingStyle: React.CSSProperties = {
  fontSize: "20px",
  color: "#1a1a1a",
  marginBottom: "20px",
  fontWeight: "600",
  margin: "0 0 20px 0",
};

const messageStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#4a4a4a",
  marginBottom: "30px",
  lineHeight: "1.7",
  margin: "0 0 30px 0",
};

const codeContainerStyle: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  border: "1px solid #e5e5e5",
  borderRadius: "8px",
  padding: "30px",
  textAlign: "center",
  marginBottom: "25px",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
};

const codeStyle: React.CSSProperties = {
  fontSize: "42px",
  fontWeight: "700",
  color: "#0052CC",
  letterSpacing: "4px",
  fontFamily: "'Courier New', monospace",
  margin: "0",
};

const noteStyle: React.CSSProperties = {
  textAlign: "center",
  fontSize: "15px",
  color: "#4a4a4a",
  marginBottom: "30px",
  lineHeight: "1.6",
  margin: "0 0 30px 0",
};

const strongStyle: React.CSSProperties = {
  fontWeight: "700",
  color: "#1a1a1a",
};

const signatureStyle: React.CSSProperties = {
  fontSize: "16px",
  color: "#4a4a4a",
  marginTop: "30px",
  lineHeight: "1.6",
  margin: "30px 0 0 0",
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#f8f9fa",
  padding: "30px 40px",
  textAlign: "center",
  borderTop: "1px solid #e5e5e5",
};

const footerLogoStyle: React.CSSProperties = {
  height: "35px",
  marginBottom: "20px",
};

const footerTextStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#999",
  marginBottom: "20px",
  lineHeight: "1.5",
  margin: "0 0 20px 0",
};

const socialLinksStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  gap: "15px",
  marginBottom: "20px",
};

const socialIconStyle: React.CSSProperties = {
  width: "36px",
  height: "36px",
  backgroundColor: "#e5e5e5",
  borderRadius: "50%",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  textDecoration: "none",
};

const footerLinksStyle: React.CSSProperties = {
  fontSize: "13px",
  marginBottom: "15px",
  margin: "0 0 15px 0",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#666",
  textDecoration: "none",
  margin: "0 10px",
};

const copyrightStyle: React.CSSProperties = {
  fontSize: "12px",
  color: "#999",
  margin: "0",
};
