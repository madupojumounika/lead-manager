import Lead from '../models/Lead.js';

export const getLeads = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      status = '',
      source = '',
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const filter = {};

    // Filter by status if specified and not 'All'
    if (status && status !== 'All') {
      filter.status = status;
    }

    // Filter by source if specified and not 'All'
    if (source && source !== 'All') {
      filter.source = source;
    }

    // Search by name, email, or company
    if (search && search.trim() !== '') {
      const escaped = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(escaped, 'i');
      filter.$or = [
        { name: regex },
        { email: regex },
        { company: regex }
      ];
    }

    const pageNumber = Math.max(1, parseInt(page, 10) || 1);
    const pageSize = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
    const skip = (pageNumber - 1) * pageSize;

    const sortOptions = {
      [sortBy]: sortOrder === 'asc' ? 1 : -1
    };

    const [total, leads] = await Promise.all([
      Lead.countDocuments(filter),
      Lead.find(filter)
        .sort(sortOptions)
        .skip(skip)
        .limit(pageSize)
        .lean()
    ]);

    const totalPages = Math.ceil(total / pageSize) || 1;

    res.status(200).json({
      success: true,
      count: leads.length,
      pagination: {
        total,
        page: pageNumber,
        limit: pageSize,
        totalPages,
        hasNextPage: pageNumber < totalPages,
        hasPrevPage: pageNumber > 1
      },
      data: leads
    });
  } catch (error) {
    next(error);
  }
};

export const getLeadById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, company, source, status } = req.body;

    const normalizedEmail = email.toLowerCase().trim();
    const existingLead = await Lead.findOne({ email: normalizedEmail });

    if (existingLead) {
      return res.status(409).json({
        success: false,
        message: 'A lead with this email address already exists',
        errors: [{ field: 'email', message: 'Email address is already in use' }]
      });
    }

    const lead = await Lead.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: phone.trim(),
      company: company.trim(),
      source,
      status: status || 'New'
    });

    res.status(201).json({
      success: true,
      message: 'Lead created successfully',
      data: lead
    });
  } catch (error) {
    next(error);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatePayload = { ...req.body };

    if (updatePayload.email) {
      updatePayload.email = updatePayload.email.toLowerCase().trim();
      const conflict = await Lead.findOne({
        email: updatePayload.email,
        _id: { $ne: id }
      });

      if (conflict) {
        return res.status(409).json({
          success: false,
          message: 'Another lead is already registered with this email address',
          errors: [{ field: 'email', message: 'Email is already used by another lead' }]
        });
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: updatePayload },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

export const updateLeadStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const updatedLead = await Lead.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true, runValidators: true }
    );

    if (!updatedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: updatedLead
    });
  } catch (error) {
    next(error);
  }
};

export const deleteLead = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedLead = await Lead.findByIdAndDelete(id);

    if (!deletedLead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

