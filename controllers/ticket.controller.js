import Ticket from '../models/ticket.model.js';
import Place from '../models/place.model.js';

/* =========================
   CREATE Ticket
========================= */
export const createTicket = async (req, res) => {
  try {
    const { place, type, prices } = req.body;

    // Check if place exists
    const placeExists = await Place.findById(place);
    if (!placeExists) {
      return res.status(404).json({ message: 'Place not found' });
    }

    // Check if ticket already exists for this place
    const existingTicket = await Ticket.findOne({ place });
    if (existingTicket) {
      return res.status(400).json({ message: 'Ticket already exists for this place' });
    }

    const ticket = await Ticket.create({ place, type, prices });

    res.status(201).json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET all Tickets
========================= */
export const getAllTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate('place'); // populate place details

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET Ticket by ID
========================= */
export const getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('place');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   GET Ticket by Place ID
========================= */
export const getTicketByPlace = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ place: req.params.placeId })
      .populate('place');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found for this place' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   UPDATE Ticket
========================= */
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('place');

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json(ticket);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* =========================
   DELETE Ticket
========================= */
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: 'Ticket not found' });
    }

    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};