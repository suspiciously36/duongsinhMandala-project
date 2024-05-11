const Transformer = require("../../core/transformer");

module.exports = class extends Transformer {
  response(instance) {
    return {
      UID: instance.id,
      fullname: instance.name,
      email: instance.email,
      status: instance.status,
      providerId: instance.provider_id,
      createdAt: instance.created_at,
      updatedAt: instance.updated_at,
    };
  }
};
