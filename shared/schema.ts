import { pgTable, text, serial, integer, boolean, timestamp, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Enums
export const configurationTypeEnum = pgEnum('configuration_type', ['desktop', 'real_device', 'virtual_device']);
export const cloudTypeEnum = pgEnum('cloud_type', ['public', 'private']);
export const statusEnum = pgEnum('status', ['active', 'inactive', 'testing']);
export const testStatusEnum = pgEnum('test_status', ['pending', 'running', 'completed', 'failed']);

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  role: text("role").notNull().default('qa_engineer'),
  createdAt: timestamp("created_at").defaultNow(),
});

// Applications table
export const applications = pgTable("applications", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  version: text("version").notNull(),
  description: text("description"),
  platform: text("platform").notNull(), // iOS, Android, Web
  packageName: text("package_name"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Configurations table
export const configurations = pgTable("configurations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: configurationTypeEnum("type").notNull(),
  status: statusEnum("status").notNull().default('active'),
  
  // Desktop configuration fields
  os: text("os"),
  osVersion: text("os_version"),
  browser: text("browser"),
  browserVersion: text("browser_version"),
  resolution: text("resolution"),
  
  // Device configuration fields
  manufacturer: text("manufacturer"),
  deviceName: text("device_name"),
  cloudType: cloudTypeEnum("cloud_type"),
  applicationId: integer("application_id").references(() => applications.id),
  
  // Additional metadata
  tags: text("tags").array(),
  description: text("description"),
  isTemplate: boolean("is_template").default(false),
  
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Test Cases table
export const testCases = pgTable("test_cases", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(), // KaneAI, Test Manager
  steps: jsonb("steps"), // Array of test steps
  expectedResults: text("expected_results"),
  priority: text("priority").notNull().default('medium'), // low, medium, high
  status: statusEnum("status").notNull().default('active'),
  
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Test Runs table
export const testRuns = pgTable("test_runs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  status: testStatusEnum("status").notNull().default('pending'),
  startTime: timestamp("start_time"),
  endTime: timestamp("end_time"),
  
  createdBy: integer("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Configuration Allocations (Many-to-Many between configurations and test cases)
export const configurationAllocations = pgTable("configuration_allocations", {
  id: serial("id").primaryKey(),
  configurationId: integer("configuration_id").notNull().references(() => configurations.id),
  testCaseId: integer("test_case_id").references(() => testCases.id),
  testRunId: integer("test_run_id").references(() => testRuns.id),
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Test Results table
export const testResults = pgTable("test_results", {
  id: serial("id").primaryKey(),
  testRunId: integer("test_run_id").notNull().references(() => testRuns.id),
  testCaseId: integer("test_case_id").notNull().references(() => testCases.id),
  configurationId: integer("configuration_id").notNull().references(() => configurations.id),
  status: testStatusEnum("status").notNull(),
  errorMessage: text("error_message"),
  logs: text("logs"),
  duration: integer("duration"), // in milliseconds
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Activity Log table
export const activityLog = pgTable("activity_log", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  action: text("action").notNull(), // created, updated, deleted, allocated, etc.
  resourceType: text("resource_type").notNull(), // configuration, test_case, test_run, etc.
  resourceId: integer("resource_id").notNull(),
  resourceName: text("resource_name").notNull(),
  metadata: jsonb("metadata"), // Additional action-specific data
  
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  configurations: many(configurations),
  testCases: many(testCases),
  testRuns: many(testRuns),
  activityLog: many(activityLog),
}));

export const applicationsRelations = relations(applications, ({ many }) => ({
  configurations: many(configurations),
}));

export const configurationsRelations = relations(configurations, ({ one, many }) => ({
  application: one(applications, {
    fields: [configurations.applicationId],
    references: [applications.id],
  }),
  createdBy: one(users, {
    fields: [configurations.createdBy],
    references: [users.id],
  }),
  allocations: many(configurationAllocations),
  testResults: many(testResults),
}));

export const testCasesRelations = relations(testCases, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [testCases.createdBy],
    references: [users.id],
  }),
  allocations: many(configurationAllocations),
  testResults: many(testResults),
}));

export const testRunsRelations = relations(testRuns, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [testRuns.createdBy],
    references: [users.id],
  }),
  allocations: many(configurationAllocations),
  testResults: many(testResults),
}));

export const configurationAllocationsRelations = relations(configurationAllocations, ({ one }) => ({
  configuration: one(configurations, {
    fields: [configurationAllocations.configurationId],
    references: [configurations.id],
  }),
  testCase: one(testCases, {
    fields: [configurationAllocations.testCaseId],
    references: [testCases.id],
  }),
  testRun: one(testRuns, {
    fields: [configurationAllocations.testRunId],
    references: [testRuns.id],
  }),
}));

export const testResultsRelations = relations(testResults, ({ one }) => ({
  testRun: one(testRuns, {
    fields: [testResults.testRunId],
    references: [testRuns.id],
  }),
  testCase: one(testCases, {
    fields: [testResults.testCaseId],
    references: [testCases.id],
  }),
  configuration: one(configurations, {
    fields: [testResults.configurationId],
    references: [configurations.id],
  }),
}));

export const activityLogRelations = relations(activityLog, ({ one }) => ({
  user: one(users, {
    fields: [activityLog.userId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertApplicationSchema = createInsertSchema(applications).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConfigurationSchema = createInsertSchema(configurations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestCaseSchema = createInsertSchema(testCases).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTestRunSchema = createInsertSchema(testRuns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertConfigurationAllocationSchema = createInsertSchema(configurationAllocations).omit({
  id: true,
  createdAt: true,
});

export const insertTestResultSchema = createInsertSchema(testResults).omit({
  id: true,
  createdAt: true,
});

export const insertActivityLogSchema = createInsertSchema(activityLog).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Application = typeof applications.$inferSelect;
export type InsertApplication = z.infer<typeof insertApplicationSchema>;

export type Configuration = typeof configurations.$inferSelect;
export type InsertConfiguration = z.infer<typeof insertConfigurationSchema>;

export type TestCase = typeof testCases.$inferSelect;
export type InsertTestCase = z.infer<typeof insertTestCaseSchema>;

export type TestRun = typeof testRuns.$inferSelect;
export type InsertTestRun = z.infer<typeof insertTestRunSchema>;

export type ConfigurationAllocation = typeof configurationAllocations.$inferSelect;
export type InsertConfigurationAllocation = z.infer<typeof insertConfigurationAllocationSchema>;

export type TestResult = typeof testResults.$inferSelect;
export type InsertTestResult = z.infer<typeof insertTestResultSchema>;

export type ActivityLog = typeof activityLog.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;
