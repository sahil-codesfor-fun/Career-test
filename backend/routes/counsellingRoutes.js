const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// POST /api/counselling
router.post('/', async (req, res) => {
  try {
    const { name, email, mobile } = req.body;
    
    if (!name || !email || !mobile) {
      return res.status(400).json({ error: 'Name, email, and mobile are required' });
    }

    const request = await prisma.counsellingRequest.create({
      data: { name, email, mobile }
    });
    
    res.status(201).json(request);
  } catch (error) {
    console.error('Error saving counselling request:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
});

// GET /api/counselling
router.get('/', async (req, res) => {
  try {
    const requests = await prisma.counsellingRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(requests);
  } catch (error) {
    console.error('Error fetching counselling requests:', error);
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

module.exports = router;
