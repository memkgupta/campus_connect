import * as React from 'react';

interface EmailTemplateProps {
  otp: string;
}

const EmailTemplate = ({
  otp,
}:{otp:string}) => (
  <div>
    <h1>Verification OTP, {otp}!</h1>
  </div>
);
export default EmailTemplate