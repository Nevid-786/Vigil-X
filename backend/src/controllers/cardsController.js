import { CardMapping } from '../models/CardMapping.js';
import { normalizeUid } from '../utils/normalizeUid.js';

/**
 * GET /api/cards
 */
export const getCards = async (req, res) => {
  try {
    const { search } = req.query;
    const query = {};

    if (search) {
      const regex = new RegExp(search, 'i');
      query.$or = [{ name: regex }, { rawUid: regex }, { normalizedUid: regex }];
    }

    const cards = await CardMapping.find(query).sort({ createdAt: -1 });
    return res.json(cards);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * POST /api/cards
 */
export const createCard = async (req, res) => {
  try {
    const { rawUid, name } = req.body;

    if (!rawUid || !name) {
      return res.status(400).json({
        error: { message: 'rawUid and name are required.' },
      });
    }

    const normalizedUid = normalizeUid(rawUid);
    if (!normalizedUid) {
      return res.status(400).json({
        error: { message: 'Invalid UID format.' },
      });
    }

    const existing = await CardMapping.findOne({ normalizedUid });
    if (existing) {
      return res.status(409).json({
        error: { message: `Card with UID (${normalizedUid}) already exists for "${existing.name}".` },
      });
    }

    const card = await CardMapping.create({
      rawUid,
      normalizedUid,
      name,
      createdBy: req.user ? req.user.id : null,
    });

    return res.status(201).json(card);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * PUT /api/cards/:id
 */
export const updateCard = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, rawUid } = req.body;

    const updateFields = {};
    if (name) updateFields.name = name;
    if (rawUid) {
      updateFields.rawUid = rawUid;
      updateFields.normalizedUid = normalizeUid(rawUid);
    }

    const card = await CardMapping.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    if (!card) {
      return res.status(404).json({ error: { message: 'Card mapping not found.' } });
    }

    return res.json(card);
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};

/**
 * DELETE /api/cards/:id
 */
export const deleteCard = async (req, res) => {
  try {
    const { id } = req.params;
    const card = await CardMapping.findByIdAndDelete(id);

    if (!card) {
      return res.status(404).json({ error: { message: 'Card mapping not found.' } });
    }

    return res.status(204).send();
  } catch (err) {
    return res.status(500).json({ error: { message: err.message } });
  }
};
