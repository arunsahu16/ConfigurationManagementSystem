import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertConfigurationSchema, insertApplicationSchema, insertTestCaseSchema, insertTestRunSchema, insertConfigurationAllocationSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configuration routes
  app.get("/api/configurations", async (req, res) => {
    try {
      const { type, status, search } = req.query;
      const configurations = await storage.getConfigurations({
        type: type as string,
        status: status as string,
        search: search as string,
      });
      res.json(configurations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configurations" });
    }
  });

  app.get("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const configuration = await storage.getConfiguration(id);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch configuration" });
    }
  });

  app.post("/api/configurations", async (req, res) => {
    try {
      const data = insertConfigurationSchema.parse(req.body);
      const configuration = await storage.createConfiguration(data);
      res.status(201).json(configuration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid configuration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create configuration" });
    }
  });

  app.put("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertConfigurationSchema.partial().parse(req.body);
      const configuration = await storage.updateConfiguration(id, data);
      if (!configuration) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.json(configuration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid configuration data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update configuration" });
    }
  });

  app.delete("/api/configurations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteConfiguration(id);
      if (!deleted) {
        return res.status(404).json({ error: "Configuration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete configuration" });
    }
  });

  // Application routes
  app.get("/api/applications", async (req, res) => {
    try {
      const applications = await storage.getApplications();
      res.json(applications);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch applications" });
    }
  });

  app.post("/api/applications", async (req, res) => {
    try {
      const data = insertApplicationSchema.parse(req.body);
      const application = await storage.createApplication(data);
      res.status(201).json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create application" });
    }
  });

  app.put("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const data = insertApplicationSchema.partial().parse(req.body);
      const application = await storage.updateApplication(id, data);
      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.json(application);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid application data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to update application" });
    }
  });

  app.delete("/api/applications/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteApplication(id);
      if (!deleted) {
        return res.status(404).json({ error: "Application not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete application" });
    }
  });

  // Test Case routes
  app.get("/api/test-cases", async (req, res) => {
    try {
      const { category, status, search } = req.query;
      const testCases = await storage.getTestCases({
        category: category as string,
        status: status as string,
        search: search as string,
      });
      res.json(testCases);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test cases" });
    }
  });

  app.post("/api/test-cases", async (req, res) => {
    try {
      const data = insertTestCaseSchema.parse(req.body);
      const testCase = await storage.createTestCase(data);
      res.status(201).json(testCase);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid test case data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create test case" });
    }
  });

  // Test Run routes
  app.get("/api/test-runs", async (req, res) => {
    try {
      const { status, search } = req.query;
      const testRuns = await storage.getTestRuns({
        status: status as string,
        search: search as string,
      });
      res.json(testRuns);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch test runs" });
    }
  });

  app.post("/api/test-runs", async (req, res) => {
    try {
      const data = insertTestRunSchema.parse(req.body);
      const testRun = await storage.createTestRun(data);
      res.status(201).json(testRun);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid test run data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create test run" });
    }
  });

  // Allocation routes
  app.get("/api/allocations", async (req, res) => {
    try {
      const allocations = await storage.getAllocations();
      res.json(allocations);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch allocations" });
    }
  });

  app.post("/api/allocations", async (req, res) => {
    try {
      const data = insertConfigurationAllocationSchema.parse(req.body);
      const allocation = await storage.createAllocation(data);
      res.status(201).json(allocation);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid allocation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create allocation" });
    }
  });

  app.post("/api/allocations/bulk", async (req, res) => {
    try {
      const { allocations } = req.body;
      if (!Array.isArray(allocations)) {
        return res.status(400).json({ error: "Allocations must be an array" });
      }

      const results = [];
      for (const allocationData of allocations) {
        const data = insertConfigurationAllocationSchema.parse(allocationData);
        const allocation = await storage.createAllocation(data);
        results.push(allocation);
      }

      res.status(201).json(results);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid allocation data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create bulk allocations" });
    }
  });

  // Analytics routes
  app.get("/api/analytics/stats", async (req, res) => {
    try {
      const stats = await storage.getConfigurationStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  // Activity Log routes
  app.get("/api/activity", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 50;
      const activity = await storage.getActivityLog(limit);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch activity log" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
