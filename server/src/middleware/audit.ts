import { prisma } from '../config/prisma';
import { broadcastEvent } from '../sockets/socketHandler';

export const logAudit = async (
  adminEmail: string,
  action: string,
  entityType: string,
  entityId?: string,
  details?: string,
  ipAddress?: string
) => {
  try {
    const log = await prisma.auditLog.create({
      data: {
        adminEmail,
        action,
        entityType,
        entityId: entityId || null,
        details: details || null,
        ipAddress: ipAddress || null,
      },
    });

    // Broadcast audit event to any connected admin clients
    broadcastEvent('AUDIT_LOG_CREATED', log);
    return log;
  } catch (error) {
    console.error('Failed to write audit log:', error);
  }
};
