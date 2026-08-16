import { describe, it, expect, vi, beforeEach } from "vitest";
import { getOpenings, getProfiles } from "../../../../src/controllers/hiringManagerController";
import { getOpenings as getVendorOpenings, getOpeningDetails as getVendorOpeningDetails } from "../../../../src/controllers/vendorController";
import * as hmService from "../../../../src/services/hiringManagerService";
import * as vendorService from "../../../../src/services/vendorService";
import type { Request, Response } from "express";

vi.mock("../../../../src/services/hiringManagerService");
vi.mock("../../../../src/services/vendorService");
vi.mock("../../../../src/utils/logger/index", () => ({
  logger: { info: vi.fn(), error: vi.fn() }
}));

describe("Tenant Leakage & Unauthorized Access Tests", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = vi.fn();
    statusMock = vi.fn().mockReturnValue({ json: jsonMock });
    res = {
      json: jsonMock,
      status: statusMock,
    };
    vi.clearAllMocks();
  });

  describe("Hiring Manager Persona", () => {
    it("should prevent HM from accessing another HM's opening", async () => {
      req = {
        user: { id: "hm-123", tenant: { tenantId: "tenant-a" } },
        params: { id: "opening-456" }
      };

      // Mock service to return null (simulating finding opening but it doesn't belong to this HM)
      vi.mocked(hmService.getHMProfilesService).mockResolvedValue(null);

      await getProfiles(req as Request, res as Response);

      expect(hmService.getHMProfilesService).toHaveBeenCalledWith("tenant-a", "hm-123", "opening-456");
      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Access Denied: Not your opening" });
    });
  });

  describe("IT Vendor Persona", () => {
    it("should filter openings strictly by tenantId (Tenant Leakage Prevention)", async () => {
      req = {
        user: { id: "vendor-123", tenant: { tenantId: "tenant-b" } },
        query: { page: "1", limit: "10" }
      };

      vi.mocked(vendorService.getVendorOpeningsService).mockResolvedValue({
        openings: [{ id: "opening-1" } as any],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
      });

      await getVendorOpenings(req as Request, res as Response);

      // Verify the tenantId is passed securely from the token (req.user), NOT from client input
      expect(vendorService.getVendorOpeningsService).toHaveBeenCalledWith("tenant-b", 1, 10);
      expect(jsonMock).toHaveBeenCalledWith({
        openings: [{ id: "opening-1" }],
        pagination: { total: 1, page: 1, limit: 10, totalPages: 1 }
      });
    });

    it("should deny access to opening details outside vendor's tenant", async () => {
      req = {
        user: { id: "vendor-123", tenant: { tenantId: "tenant-b" } },
        params: { id: "opening-alien" }
      };

      // Mock service to return null when opening is not found for THIS tenant
      vi.mocked(vendorService.getVendorOpeningDetailsService).mockResolvedValue(null);

      await getVendorOpeningDetails(req as Request, res as Response);

      expect(vendorService.getVendorOpeningDetailsService).toHaveBeenCalledWith("tenant-b", "opening-alien", "vendor-123");
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({ message: "Opening not found" });
    });
  });
});
