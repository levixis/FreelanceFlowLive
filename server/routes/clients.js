import express from 'express';
import Client from '../models/Client.js';
import Project from '../models/Project.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all clients for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const clients = await Client.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(clients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new client
router.post('/', protect, async (req, res) => {
  try {
    const client = new Client({
      ...req.body,
      userId: req.user._id
    });
    const savedClient = await client.save();
    res.status(201).json(savedClient);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE client
router.delete('/:id', protect, async (req, res) => {
  try {
    const client = await Client.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!client) return res.status(404).json({ message: 'Client not found' });
    
    // Cascade delete projects
    await Project.deleteMany({ clientId: req.params.id, userId: req.user._id });
    
    res.json({ message: 'Client deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;