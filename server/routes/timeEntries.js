import express from 'express';
import TimeEntry from '../models/TimeEntry.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// GET all time entries for logged in user
router.get('/', protect, async (req, res) => {
  try {
    const entries = await TimeEntry.find({ userId: req.user._id }).sort({ startTime: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new time entry
router.post('/', protect, async (req, res) => {
  try {
    const entry = new TimeEntry({
      ...req.body,
      userId: req.user._id
    });
    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update time entry
router.put('/:id', protect, async (req, res) => {
  try {
    const updatedEntry = await TimeEntry.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updatedEntry) return res.status(404).json({ message: 'Entry not found' });
    res.json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE time entry
router.delete('/:id', protect, async (req, res) => {
  try {
    const entry = await TimeEntry.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!entry) return res.status(404).json({ message: 'Entry not found' });
    res.json({ message: 'Entry deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;