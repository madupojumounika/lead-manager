import express from 'express';
import {
  getLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead
} from '../controllers/leadController.js';
import { validate } from '../middleware/validateRequest.js';
import {
  createLeadSchema,
  updateLeadSchema,
  updateStatusSchema,
  queryLeadsSchema
} from '../validators/leadValidator.js';

const router = express.Router();

router.route('/')
  .get(validate(queryLeadsSchema, 'query'), getLeads)
  .post(validate(createLeadSchema, 'body'), createLead);

router.route('/:id')
  .get(getLeadById)
  .put(validate(updateLeadSchema, 'body'), updateLead)
  .delete(deleteLead);

router.patch('/:id/status', validate(updateStatusSchema, 'body'), updateLeadStatus);

export default router;
