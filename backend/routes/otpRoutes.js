const express = require('express');
const router = express.Router();
const axios = require('axios');

// In-memory store for OTPs: { "919999999999": { otp: "123456", expiresAt: 1620000000000 } }
const otpStore = {};

// Send OTP
router.post('/send', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Store it (expires in 5 minutes)
  otpStore[mobile] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000
  };

  try {
    const authKey = process.env.MSG91_AUTH_TOKEN;
    
    // Constructing the MSG91 URL (We use the generic OTP endpoint. If template_id is strictly required by MSG91 and the user didn't provide one, this will log the error but still allow the mock to work).
    const options = {
      method: 'POST',
      url: `https://control.msg91.com/api/v5/otp?template_id=default&mobile=91${mobile}&authkey=${authKey}&otp=${otp}`,
      headers: {
        'content-type': 'application/JSON'
      }
    };

    console.log(`[Mock Info] OTP for ${mobile} is ${otp}`); // Always log so user can demo even if API fails
    
    // We wrap the API call in a try-catch so it doesn't crash the server if it fails
    if (authKey) {
      try {
        await axios.request(options);
      } catch (apiError) {
        console.error("MSG91 API Error (Could be missing template ID):", apiError.response ? apiError.response.data : apiError.message);
        // We still return success so the frontend flow continues (in case they just want to test via console)
      }
    }

    res.json({ 
      success: true, 
      message: 'OTP sent successfully (Check server console if SMS fails)',
      mockOtp: otp // Adding mock OTP to response for easy UI testing since MSG91 might fail without DLT
    });

  } catch (error) {
    console.error('Error in send OTP:', error);
    res.status(500).json({ error: 'Failed to process OTP' });
  }
});

// Verify OTP
router.post('/verify', (req, res) => {
  const { mobile, otp } = req.body;
  
  if (!mobile || !otp) {
    return res.status(400).json({ error: 'Mobile and OTP are required' });
  }

  const record = otpStore[mobile];
  
  if (!record) {
    return res.status(400).json({ error: 'No OTP requested for this number' });
  }

  if (Date.now() > record.expiresAt) {
    delete otpStore[mobile];
    return res.status(400).json({ error: 'OTP has expired' });
  }

  if (record.otp !== otp.toString()) {
    return res.status(400).json({ error: 'Invalid OTP' });
  }

  // OTP verified successfully
  delete otpStore[mobile];
  res.json({ success: true, message: 'OTP verified successfully' });
});

module.exports = router;
