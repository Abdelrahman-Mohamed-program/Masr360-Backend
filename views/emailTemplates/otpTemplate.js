const otpTemplate = (otp, message) => {
  return `
<html>
  <body style="margin:0;padding:0;font-family:Arial,sans-serif;background:#f4f6f8;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px; background-color:#f4f6f8;">
      <tr>
        <td>
          <!-- Main card -->
          <table width="500" align="center" cellpadding="0" cellspacing="0" style="background:white;border-radius:12px;padding:30px;text-align:center; ">
            
            <!-- Logo -->
            <tr>
              <td>
                <img src="https://res.cloudinary.com/dwh6drlr9/image/upload/v1770823913/mini_logo_black_bg_ftpvut.jpg" width="150" alt="Masr360 Logo" style="display:block;margin:auto; border-radius:50%;"/>
              </td>
            </tr>

            <!-- Greeting -->
            <tr>
              <td style="padding-top:20px;">
                <h2 style="color:#0B0B0B;margin-bottom:10px;">Welcome to Masr360</h2>
                <p style="color:#0B0B0B;font-size:16px;line-height:1.5;">
                  ${message}
                </p>
              </td>
            </tr>

            <!-- OTP Box -->
            <tr>
              <td style="padding-top:20px;padding-bottom:20px;">
                <table align="center" cellpadding="15" cellspacing="0" style="background:#F3AE1C;border-radius:10px;">
                  <tr>
                    <td style="font-size:32px;font-weight:bold;color:white;letter-spacing:6px;">
                      ${otp}
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Expiry info -->
            <tr>
              <td style="color:#0B0B0B;font-size:14px;line-height:1.5;">
                This code expires in 20 minutes
              </td>
            </tr>

            <!-- Footer accent -->
            <tr>
              <td style="padding-top:30px;">
                <hr style="border:none;border-top:2px solid #EFCF9E;width:50%;margin:auto;">
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`
};
module.exports = otpTemplate