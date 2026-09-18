const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  userEmail: {
    type: String,
    required: true,
    default: 'admin@viva.com'
  },
  userRole: {
    type: String,
    default: 'admin'
  },
  action: {
    type: String,
    required: true
  },
  module: {
    type: String,
    required: true
  },
  details: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  }
}, { timestamps: true });

module.exports = mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
