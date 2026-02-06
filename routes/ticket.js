import express from 'express';
import {
  createTicket,
  getAllTickets,
  getTicketById,
  getTicketByPlace,
  updateTicket,
  deleteTicket
} from '../controllers/ticket.controller.js';
import validateId from '../middlewares/validateId.js';

const router = express.Router();

router.post('/', createTicket);
router.get('/', getAllTickets);
router.get('/:id',validateId, getTicketById);
router.get('/place/:placeId',validateId, getTicketByPlace);
router.put('/:id',validateId, updateTicket);
router.delete('/:id',validateId, deleteTicket);

export default router;

