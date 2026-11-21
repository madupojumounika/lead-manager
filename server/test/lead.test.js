import { describe, it, beforeAll, afterAll, beforeEach, expect } from 'vitest';
import request from 'supertest';
import mongoose from 'mongoose';
import fs from 'fs';
import { MongoMemoryServer } from 'mongodb-memory-server';
import app from '../src/app.js';
import Lead from '../src/models/Lead.js';

// Use local MongoDB binary if available to avoid any network downloads
const localBinary = 'C:\\Program Files\\MongoDB\\Server\\8.2\\bin\\mongod.exe';
if (fs.existsSync(localBinary)) {
  process.env.MONGOMS_SYSTEM_BINARY = localBinary;
}

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Lead.deleteMany({});
});

describe('Lead Manager API Tests', () => {
  describe('GET /api/health', () => {
    it('should return health status ok with uptime', async () => {
      const res = await request(app).get('/api/health');
      expect(res.status).toBe(200);
      expect(res.body.status).toBe('ok');
      expect(typeof res.body.uptime).toBe('number');
      expect(res.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/leads', () => {
    const validLead = {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 555-0199',
      company: 'Acme Corp',
      source: 'LinkedIn',
      status: 'New'
    };

    it('should successfully create a valid lead', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send(validLead);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('John Doe');
      expect(res.body.data.email).toBe('john.doe@example.com');
      expect(res.body.data.status).toBe('New');
      expect(res.body.data.id).toBeDefined();

      const inDb = await Lead.findById(res.body.data.id);
      expect(inDb).not.toBeNull();
      expect(inDb.name).toBe('John Doe');
    });

    it('should reject invalid email format', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          ...validLead,
          email: 'invalid-email-format'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/valid email/i);
    });

    it('should reject missing required fields', async () => {
      const res = await request(app)
        .post('/api/leads')
        .send({
          email: 'missing@example.com'
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBeDefined();
    });

    it('should reject duplicate email with 409 Conflict', async () => {
      await Lead.create(validLead);

      const res = await request(app)
        .post('/api/leads')
        .send({
          ...validLead,
          name: 'Jane Doe',
          email: 'JOHN.DOE@EXAMPLE.COM' // case-insensitive duplicate
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already exists/i);
    });
  });

  describe('GET /api/leads', () => {
    beforeEach(async () => {
      await Lead.create([
        {
          name: 'Alice Johnson',
          email: 'alice@alpha.com',
          phone: '+1 555-1111',
          company: 'Alpha Inc',
          source: 'Website',
          status: 'New'
        },
        {
          name: 'Bob Smith',
          email: 'bob@beta.com',
          phone: '+1 555-2222',
          company: 'Beta LLC',
          source: 'Referral',
          status: 'Contacted'
        },
        {
          name: 'Charlie Brown',
          email: 'charlie@charlie.com',
          phone: '+1 555-3333',
          company: 'Gamma Group',
          source: 'LinkedIn',
          status: 'Qualified'
        }
      ]);
    });

    it('should return paginated list of leads', async () => {
      const res = await request(app).get('/api/leads');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(3);
      expect(res.body.pagination.total).toBe(3);
      expect(res.body.pagination.page).toBe(1);
    });

    it('should filter leads by status', async () => {
      const res = await request(app).get('/api/leads?status=Contacted');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('Bob Smith');
    });

    it('should filter leads by source', async () => {
      const res = await request(app).get('/api/leads?source=LinkedIn');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('Charlie Brown');
    });

    it('should search leads by name, email, or company', async () => {
      const res = await request(app).get('/api/leads?search=alpha');
      expect(res.status).toBe(200);
      expect(res.body.count).toBe(1);
      expect(res.body.data[0].name).toBe('Alice Johnson');
    });

    it('should support pagination limit and page', async () => {
      const res = await request(app).get('/api/leads?limit=2&page=1');
      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(2);
      expect(res.body.pagination.totalPages).toBe(2);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });
  });

  describe('GET /api/leads/:id', () => {
    it('should retrieve a single lead by valid ID', async () => {
      const created = await Lead.create({
        name: 'David Miller',
        email: 'david@delta.com',
        phone: '+1 555-4444',
        company: 'Delta Co',
        source: 'Website',
        status: 'New'
      });

      const res = await request(app).get(`/api/leads/${created._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('David Miller');
    });

    it('should reject invalid MongoDB ObjectId format with 400', async () => {
      const res = await request(app).get('/api/leads/not-a-valid-object-id');
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/invalid id format/i);
    });

    it('should return 404 for non-existent lead ID', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/leads/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/leads/:id', () => {
    it('should update lead details successfully', async () => {
      const lead = await Lead.create({
        name: 'Elena Rostova',
        email: 'elena@example.com',
        phone: '+1 555-5555',
        company: 'Echo Corp',
        source: 'Website',
        status: 'New'
      });

      const res = await request(app)
        .put(`/api/leads/${lead._id}`)
        .send({
          name: 'Elena Rostova Updated',
          company: 'Echo Global Corp'
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('Elena Rostova Updated');
      expect(res.body.data.company).toBe('Echo Global Corp');
    });

    it('should reject updating to an email that is already used by another lead', async () => {
      await Lead.create({
        name: 'User One',
        email: 'user1@example.com',
        phone: '+1 555-1111',
        company: 'One Inc',
        source: 'Website',
        status: 'New'
      });

      const lead2 = await Lead.create({
        name: 'User Two',
        email: 'user2@example.com',
        phone: '+1 555-2222',
        company: 'Two Inc',
        source: 'Website',
        status: 'New'
      });

      const res = await request(app)
        .put(`/api/leads/${lead2._id}`)
        .send({ email: 'user1@example.com' });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/already registered/i);
    });
  });

  describe('PATCH /api/leads/:id/status', () => {
    it('should update lead status', async () => {
      const lead = await Lead.create({
        name: 'Felix Vance',
        email: 'felix@example.com',
        phone: '+1 555-6666',
        company: 'Fox Media',
        source: 'Advertisement',
        status: 'New'
      });

      const res = await request(app)
        .patch(`/api/leads/${lead._id}/status`)
        .send({ status: 'Qualified' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('Qualified');

      const updated = await Lead.findById(lead._id);
      expect(updated.status).toBe('Qualified');
    });

    it('should reject invalid status value', async () => {
      const lead = await Lead.create({
        name: 'Grace Hopper',
        email: 'grace@example.com',
        phone: '+1 555-7777',
        company: 'Naval Labs',
        source: 'Other',
        status: 'New'
      });

      const res = await request(app)
        .patch(`/api/leads/${lead._id}/status`)
        .send({ status: 'InvalidStatus' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/leads/:id', () => {
    it('should delete a lead and return 200', async () => {
      const lead = await Lead.create({
        name: 'Henry Ford',
        email: 'henry@ford.com',
        phone: '+1 555-8888',
        company: 'Ford Motors',
        source: 'Website',
        status: 'Contacted'
      });

      const res = await request(app).delete(`/api/leads/${lead._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toMatch(/deleted successfully/i);

      const deleted = await Lead.findById(lead._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 when deleting non-existent lead', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/leads/${nonExistentId}`);
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/dashboard/stats', () => {
    it('should calculate accurate counts from database', async () => {
      await Lead.create([
        { name: 'Lead One', email: 'lead1@example.com', phone: '+1 555-0101', company: 'Company A', source: 'Website', status: 'New' },
        { name: 'Lead Two', email: 'lead2@example.com', phone: '+1 555-0102', company: 'Company B', source: 'Website', status: 'New' },
        { name: 'Lead Three', email: 'lead3@example.com', phone: '+1 555-0103', company: 'Company C', source: 'Website', status: 'Contacted' },
        { name: 'Lead Four', email: 'lead4@example.com', phone: '+1 555-0104', company: 'Company D', source: 'Website', status: 'Qualified' },
        { name: 'Lead Five', email: 'lead5@example.com', phone: '+1 555-0105', company: 'Company E', source: 'Website', status: 'Lost' }
      ]);

      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.total).toBe(5);
      expect(res.body.data.new).toBe(2);
      expect(res.body.data.contacted).toBe(1);
      expect(res.body.data.qualified).toBe(1);
      expect(res.body.data.lost).toBe(1);
    });

    it('should return zeros when database is empty', async () => {
      const res = await request(app).get('/api/dashboard/stats');
      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(0);
      expect(res.body.data.new).toBe(0);
      expect(res.body.data.contacted).toBe(0);
      expect(res.body.data.qualified).toBe(0);
      expect(res.body.data.lost).toBe(0);
    });
  });
});

