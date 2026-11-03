import express from 'express';
import {
  createTicket,
  getTicketStatus,
  listFaqs,
} from './support.controller.js';

const router = express.Router();

router.post('/tickets', createTicket);
router.get('/tickets/:ticketId', getTicketStatus);
router.get('/faqs', listFaqs);

export default router;
