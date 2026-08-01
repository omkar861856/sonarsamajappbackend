import { Response } from 'express';
import { Family } from '../models/Family.js';
import { AuthRequest } from '../middleware/auth.js';

export const getFamilies = async (req: AuthRequest, res: Response) => {
  try {
    const families = await Family.find().sort({ createdAt: -1 });
    res.json(families);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching families' });
  }
};

export const createFamily = async (req: AuthRequest, res: Response) => {
  try {
    const { headName, city, memberCount, cast } = req.body;
    const newFamily = new Family({
      headName,
      city,
      memberCount,
      cast,
      createdBy: req.user.id
    });
    await newFamily.save();
    res.status(201).json(newFamily);
  } catch (error) {
    res.status(500).json({ message: 'Error creating family' });
  }
};
