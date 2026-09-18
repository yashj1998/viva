const mongoose = require('mongoose');
const AuditLog = require('../models/AuditLog');
const mockData = require('../seeds/mock-data');

async function logAuditAction(req, action, moduleName, details) {
  try {
    const userEmail = (req.session && req.session.adminUser) || 'admin@viva.com';
    const userRole = (req.session && req.session.adminRole) || 'admin';
    const ipAddress = req.ip || req.connection?.remoteAddress || '127.0.0.1';

    const logEntry = {
      userEmail,
      userRole,
      action: action.toUpperCase(),
      module: moduleName,
      details,
      ipAddress,
      createdAt: new Date()
    };

    if (mongoose.connection.readyState === 1) {
      await AuditLog.create(logEntry);
    } else {
      mockData.auditLogs.unshift({
        _id: 'log_' + Date.now(),
        ...logEntry
      });
    }
  } catch (err) {
    console.warn('Audit logger warning:', err.message);
  }
}

module.exports = logAuditAction;
