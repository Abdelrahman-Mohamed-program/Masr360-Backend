import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  getTicketByPlace,
  updateTicket,
  deleteTicket
} from '../controllers/ticket.controller.js';

const router = express.Router();

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id', getTicketById);
router.get('/place/:placeId', getTicketByPlace);
router.put('/:id', updateTicket);
router.delete('/:id', deleteTicket);

export default router;