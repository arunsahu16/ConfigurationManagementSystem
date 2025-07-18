import { 
  users, applications, configurations, testCases, testRuns, 
  configurationAllocations, testResults, activityLog,
  type User, type InsertUser, type Application, type InsertApplication,
  type Configuration, type InsertConfiguration, type TestCase, type InsertTestCase,
  type TestRun, type InsertTestRun, type ConfigurationAllocation, type InsertConfigurationAllocation,
  type TestResult, type InsertTestResult, type ActivityLog, type InsertActivityLog
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Applications
  getApplications(): Promise<Application[]>;
  getApplication(id: number): Promise<Application | undefined>;
  createApplication(application: InsertApplication): Promise<Application>;
  updateApplication(id: number, application: Partial<InsertApplication>): Promise<Application | undefined>;
  deleteApplication(id: number): Promise<boolean>;

  // Configurations
  getConfigurations(filters?: { type?: string; status?: string; search?: string }): Promise<Configuration[]>;
  getConfiguration(id: number): Promise<Configuration | undefined>;
  createConfiguration(configuration: InsertConfiguration): Promise<Configuration>;
  updateConfiguration(id: number, configuration: Partial<InsertConfiguration>): Promise<Configuration | undefined>;
  deleteConfiguration(id: number): Promise<boolean>;
  getConfigurationsByIds(ids: number[]): Promise<Configuration[]>;

  // Test Cases
  getTestCases(filters?: { category?: string; status?: string; search?: string }): Promise<TestCase[]>;
  getTestCase(id: number): Promise<TestCase | undefined>;
  createTestCase(testCase: InsertTestCase): Promise<TestCase>;
  updateTestCase(id: number, testCase: Partial<InsertTestCase>): Promise<TestCase | undefined>;
  deleteTestCase(id: number): Promise<boolean>;

  // Test Runs
  getTestRuns(filters?: { status?: string; search?: string }): Promise<TestRun[]>;
  getTestRun(id: number): Promise<TestRun | undefined>;
  createTestRun(testRun: InsertTestRun): Promise<TestRun>;
  updateTestRun(id: number, testRun: Partial<InsertTestRun>): Promise<TestRun | undefined>;
  deleteTestRun(id: number): Promise<boolean>;

  // Configuration Allocations
  getAllocations(): Promise<ConfigurationAllocation[]>;
  createAllocation(allocation: InsertConfigurationAllocation): Promise<ConfigurationAllocation>;
  deleteAllocation(id: number): Promise<boolean>;
  getAllocationsByTestCase(testCaseId: number): Promise<ConfigurationAllocation[]>;
  getAllocationsByTestRun(testRunId: number): Promise<ConfigurationAllocation[]>;
  getAllocationsByConfiguration(configurationId: number): Promise<ConfigurationAllocation[]>;

  // Test Results
  getTestResults(testRunId?: number): Promise<TestResult[]>;
  createTestResult(result: InsertTestResult): Promise<TestResult>;

  // Activity Log
  getActivityLog(limit?: number): Promise<ActivityLog[]>;
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;

  // Analytics
  getConfigurationStats(): Promise<{
    totalConfigurations: number;
    activeTestRuns: number;
    successRate: number;
    totalApplications: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User> = new Map();
  private applications: Map<number, Application> = new Map();
  private configurations: Map<number, Configuration> = new Map();
  private testCases: Map<number, TestCase> = new Map();
  private testRuns: Map<number, TestRun> = new Map();
  private configurationAllocations: Map<number, ConfigurationAllocation> = new Map();
  private testResults: Map<number, TestResult> = new Map();
  private activityLogs: Map<number, ActivityLog> = new Map();
  
  private currentId = {
    users: 1,
    applications: 1,
    configurations: 1,
    testCases: 1,
    testRuns: 1,
    configurationAllocations: 1,
    testResults: 1,
    activityLogs: 1,
  };

  constructor() {
    this.seedData();
  }

  private seedData() {
    // Seed a default user
    const defaultUser: User = {
      id: this.currentId.users++,
      username: 'admin',
      password: 'admin123',
      email: 'admin@kaneai.com',
      name: 'Administrator',
      role: 'admin',
      createdAt: new Date(),
    };
    this.users.set(defaultUser.id, defaultUser);

    // Seed some applications
    const apps = [
      { name: 'Banking App', version: '2.1.0', platform: 'iOS', packageName: 'com.bank.mobile' },
      { name: 'E-commerce App', version: '1.5.2', platform: 'Android', packageName: 'com.shop.app' },
      { name: 'Social Media App', version: '3.0.1', platform: 'iOS', packageName: 'com.social.app' },
    ];
    
    apps.forEach(app => {
      const application: Application = {
        id: this.currentId.applications++,
        name: app.name,
        version: app.version,
        description: `${app.name} for testing`,
        platform: app.platform,
        packageName: app.packageName,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.applications.set(application.id, application);
    });

    // Seed some configurations
    const configs: Partial<Configuration>[] = [
      {
        name: 'Chrome Windows 11',
        type: 'desktop' as const,
        os: 'Windows 11',
        osVersion: null,
        browser: 'Chrome',
        browserVersion: '118.0',
        resolution: '1920x1080',
        manufacturer: null,
        deviceName: null,
        cloudType: null,
        applicationId: null,
      },
      {
        name: 'iPhone 14 Pro',
        type: 'real_device' as const,
        manufacturer: 'Apple',
        deviceName: 'iPhone 14 Pro',
        os: 'iOS',
        osVersion: '17.1',
        cloudType: 'public' as const,
        applicationId: 1,
        browser: null,
        browserVersion: null,
        resolution: null,
      },
      {
        name: 'Android Emulator',
        type: 'virtual_device' as const,
        manufacturer: 'Google',
        deviceName: 'Pixel 7',
        os: 'Android',
        osVersion: '13',
        browser: 'Chrome Mobile',
        browserVersion: null,
        resolution: null,
        cloudType: null,
        applicationId: null,
      },
    ];

    configs.forEach(config => {
      const configuration: Configuration = {
        id: this.currentId.configurations++,
        name: config.name!,
        type: config.type!,
        status: 'active',
        description: `${config.name} configuration`,
        os: config.os || null,
        osVersion: config.osVersion || null,
        browser: config.browser || null,
        browserVersion: config.browserVersion || null,
        resolution: config.resolution || null,
        manufacturer: config.manufacturer || null,
        deviceName: config.deviceName || null,
        cloudType: config.cloudType || null,
        applicationId: config.applicationId || null,
        tags: [],
        isTemplate: false,
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.configurations.set(configuration.id, configuration);
    });

    // Seed some test cases
    const testCaseData = [
      { name: 'Login Test', category: 'KaneAI', priority: 'high' },
      { name: 'Payment Flow', category: 'Test Manager', priority: 'high' },
      { name: 'Navigation Test', category: 'KaneAI', priority: 'medium' },
    ];

    testCaseData.forEach(tc => {
      const testCase: TestCase = {
        id: this.currentId.testCases++,
        name: tc.name,
        description: `${tc.name} description`,
        category: tc.category,
        steps: [],
        expectedResults: 'Test should pass',
        priority: tc.priority,
        status: 'active',
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      this.testCases.set(testCase.id, testCase);
    });

    // Add some activity logs
    const activities = [
      { action: 'created', resourceType: 'configuration', resourceId: 1, resourceName: 'Chrome Windows 11' },
      { action: 'updated', resourceType: 'application', resourceId: 1, resourceName: 'Banking App' },
      { action: 'allocated', resourceType: 'configuration', resourceId: 2, resourceName: 'iPhone 14 Pro' },
    ];

    activities.forEach(activity => {
      const log: ActivityLog = {
        id: this.currentId.activityLogs++,
        userId: 1,
        action: activity.action,
        resourceType: activity.resourceType,
        resourceId: activity.resourceId,
        resourceName: activity.resourceName,
        metadata: {},
        createdAt: new Date(),
      };
      this.activityLogs.set(log.id, log);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user: User = {
      ...insertUser,
      role: insertUser.role || 'user',
      id: this.currentId.users++,
      createdAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  // Applications
  async getApplications(): Promise<Application[]> {
    return Array.from(this.applications.values());
  }

  async getApplication(id: number): Promise<Application | undefined> {
    return this.applications.get(id);
  }

  async createApplication(insertApplication: InsertApplication): Promise<Application> {
    const application: Application = {
      ...insertApplication,
      description: insertApplication.description || null,
      packageName: insertApplication.packageName || null,
      id: this.currentId.applications++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.applications.set(application.id, application);
    
    await this.createActivityLog({
      userId: 1,
      action: 'created',
      resourceType: 'application',
      resourceId: application.id,
      resourceName: application.name,
      metadata: {},
    });
    
    return application;
  }

  async updateApplication(id: number, updates: Partial<InsertApplication>): Promise<Application | undefined> {
    const existing = this.applications.get(id);
    if (!existing) return undefined;
    
    const updated: Application = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.applications.set(id, updated);
    
    await this.createActivityLog({
      userId: 1,
      action: 'updated',
      resourceType: 'application',
      resourceId: id,
      resourceName: updated.name,
      metadata: {},
    });
    
    return updated;
  }

  async deleteApplication(id: number): Promise<boolean> {
    const app = this.applications.get(id);
    if (!app) return false;
    
    this.applications.delete(id);
    
    await this.createActivityLog({
      userId: 1,
      action: 'deleted',
      resourceType: 'application',
      resourceId: id,
      resourceName: app.name,
      metadata: {},
    });
    
    return true;
  }

  // Configurations
  async getConfigurations(filters?: { type?: string; status?: string; search?: string }): Promise<Configuration[]> {
    let configs = Array.from(this.configurations.values());
    
    if (filters?.type) {
      configs = configs.filter(config => config.type === filters.type);
    }
    
    if (filters?.status) {
      configs = configs.filter(config => config.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      configs = configs.filter(config => 
        config.name.toLowerCase().includes(search) ||
        config.description?.toLowerCase().includes(search)
      );
    }
    
    return configs.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getConfiguration(id: number): Promise<Configuration | undefined> {
    return this.configurations.get(id);
  }

  async createConfiguration(insertConfiguration: InsertConfiguration): Promise<Configuration> {
    const configuration: Configuration = {
      name: insertConfiguration.name,
      type: insertConfiguration.type,
      status: insertConfiguration.status || 'active',
      description: insertConfiguration.description || null,
      os: insertConfiguration.os || null,
      osVersion: insertConfiguration.osVersion || null,
      browser: insertConfiguration.browser || null,
      browserVersion: insertConfiguration.browserVersion || null,
      resolution: insertConfiguration.resolution || null,
      manufacturer: insertConfiguration.manufacturer || null,
      deviceName: insertConfiguration.deviceName || null,
      cloudType: insertConfiguration.cloudType || null,
      applicationId: insertConfiguration.applicationId || null,
      tags: insertConfiguration.tags || [],
      isTemplate: insertConfiguration.isTemplate || false,
      createdBy: insertConfiguration.createdBy || null,
      id: this.currentId.configurations++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.configurations.set(configuration.id, configuration);
    
    await this.createActivityLog({
      userId: configuration.createdBy || 1,
      action: 'created',
      resourceType: 'configuration',
      resourceId: configuration.id,
      resourceName: configuration.name,
      metadata: { type: configuration.type },
    });
    
    return configuration;
  }

  async updateConfiguration(id: number, updates: Partial<InsertConfiguration>): Promise<Configuration | undefined> {
    const existing = this.configurations.get(id);
    if (!existing) return undefined;
    
    const updated: Configuration = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.configurations.set(id, updated);
    
    await this.createActivityLog({
      userId: 1,
      action: 'updated',
      resourceType: 'configuration',
      resourceId: id,
      resourceName: updated.name,
      metadata: {},
    });
    
    return updated;
  }

  async deleteConfiguration(id: number): Promise<boolean> {
    const config = this.configurations.get(id);
    if (!config) return false;
    
    this.configurations.delete(id);
    
    await this.createActivityLog({
      userId: 1,
      action: 'deleted',
      resourceType: 'configuration',
      resourceId: id,
      resourceName: config.name,
      metadata: {},
    });
    
    return true;
  }

  async getConfigurationsByIds(ids: number[]): Promise<Configuration[]> {
    return ids.map(id => this.configurations.get(id)).filter(Boolean) as Configuration[];
  }

  // Test Cases
  async getTestCases(filters?: { category?: string; status?: string; search?: string }): Promise<TestCase[]> {
    let testCases = Array.from(this.testCases.values());
    
    if (filters?.category) {
      testCases = testCases.filter(tc => tc.category === filters.category);
    }
    
    if (filters?.status) {
      testCases = testCases.filter(tc => tc.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      testCases = testCases.filter(tc => 
        tc.name.toLowerCase().includes(search) ||
        tc.description?.toLowerCase().includes(search)
      );
    }
    
    return testCases.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getTestCase(id: number): Promise<TestCase | undefined> {
    return this.testCases.get(id);
  }

  async createTestCase(insertTestCase: InsertTestCase): Promise<TestCase> {
    const testCase: TestCase = {
      name: insertTestCase.name,
      status: insertTestCase.status || 'active',
      description: insertTestCase.description || null,
      createdBy: insertTestCase.createdBy || null,
      category: insertTestCase.category,
      steps: insertTestCase.steps || {},
      expectedResults: insertTestCase.expectedResults || null,
      priority: insertTestCase.priority || 'medium',
      id: this.currentId.testCases++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.testCases.set(testCase.id, testCase);
    
    await this.createActivityLog({
      userId: testCase.createdBy || 1,
      action: 'created',
      resourceType: 'test_case',
      resourceId: testCase.id,
      resourceName: testCase.name,
      metadata: { category: testCase.category },
    });
    
    return testCase;
  }

  async updateTestCase(id: number, updates: Partial<InsertTestCase>): Promise<TestCase | undefined> {
    const existing = this.testCases.get(id);
    if (!existing) return undefined;
    
    const updated: TestCase = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.testCases.set(id, updated);
    
    return updated;
  }

  async deleteTestCase(id: number): Promise<boolean> {
    return this.testCases.delete(id);
  }

  // Test Runs
  async getTestRuns(filters?: { status?: string; search?: string }): Promise<TestRun[]> {
    let testRuns = Array.from(this.testRuns.values());
    
    if (filters?.status) {
      testRuns = testRuns.filter(tr => tr.status === filters.status);
    }
    
    if (filters?.search) {
      const search = filters.search.toLowerCase();
      testRuns = testRuns.filter(tr => 
        tr.name.toLowerCase().includes(search) ||
        tr.description?.toLowerCase().includes(search)
      );
    }
    
    return testRuns.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async getTestRun(id: number): Promise<TestRun | undefined> {
    return this.testRuns.get(id);
  }

  async createTestRun(insertTestRun: InsertTestRun): Promise<TestRun> {
    const testRun: TestRun = {
      name: insertTestRun.name,
      status: insertTestRun.status || 'pending',
      description: insertTestRun.description || null,
      createdBy: insertTestRun.createdBy || null,
      startTime: insertTestRun.startTime || null,
      endTime: insertTestRun.endTime || null,
      id: this.currentId.testRuns++,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.testRuns.set(testRun.id, testRun);
    
    await this.createActivityLog({
      userId: testRun.createdBy || 1,
      action: 'created',
      resourceType: 'test_run',
      resourceId: testRun.id,
      resourceName: testRun.name,
      metadata: {},
    });
    
    return testRun;
  }

  async updateTestRun(id: number, updates: Partial<InsertTestRun>): Promise<TestRun | undefined> {
    const existing = this.testRuns.get(id);
    if (!existing) return undefined;
    
    const updated: TestRun = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    this.testRuns.set(id, updated);
    
    return updated;
  }

  async deleteTestRun(id: number): Promise<boolean> {
    return this.testRuns.delete(id);
  }

  // Configuration Allocations
  async getAllocations(): Promise<ConfigurationAllocation[]> {
    return Array.from(this.configurationAllocations.values());
  }

  async createAllocation(insertAllocation: InsertConfigurationAllocation): Promise<ConfigurationAllocation> {
    const allocation: ConfigurationAllocation = {
      configurationId: insertAllocation.configurationId,
      testCaseId: insertAllocation.testCaseId || null,
      testRunId: insertAllocation.testRunId || null,
      id: this.currentId.configurationAllocations++,
      createdAt: new Date(),
    };
    this.configurationAllocations.set(allocation.id, allocation);
    
    const config = await this.getConfiguration(allocation.configurationId);
    await this.createActivityLog({
      userId: 1,
      action: 'allocated',
      resourceType: 'configuration',
      resourceId: allocation.configurationId,
      resourceName: config?.name || 'Configuration',
      metadata: { testCaseId: allocation.testCaseId, testRunId: allocation.testRunId },
    });
    
    return allocation;
  }

  async deleteAllocation(id: number): Promise<boolean> {
    return this.configurationAllocations.delete(id);
  }

  async getAllocationsByTestCase(testCaseId: number): Promise<ConfigurationAllocation[]> {
    return Array.from(this.configurationAllocations.values())
      .filter(allocation => allocation.testCaseId === testCaseId);
  }

  async getAllocationsByTestRun(testRunId: number): Promise<ConfigurationAllocation[]> {
    return Array.from(this.configurationAllocations.values())
      .filter(allocation => allocation.testRunId === testRunId);
  }

  async getAllocationsByConfiguration(configurationId: number): Promise<ConfigurationAllocation[]> {
    return Array.from(this.configurationAllocations.values())
      .filter(allocation => allocation.configurationId === configurationId);
  }

  // Test Results
  async getTestResults(testRunId?: number): Promise<TestResult[]> {
    let results = Array.from(this.testResults.values());
    
    if (testRunId) {
      results = results.filter(result => result.testRunId === testRunId);
    }
    
    return results.sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
  }

  async createTestResult(insertResult: InsertTestResult): Promise<TestResult> {
    const result: TestResult = {
      status: insertResult.status,
      configurationId: insertResult.configurationId,
      testCaseId: insertResult.testCaseId,
      testRunId: insertResult.testRunId,
      errorMessage: insertResult.errorMessage || null,
      logs: insertResult.logs || null,
      duration: insertResult.duration || null,
      id: this.currentId.testResults++,
      createdAt: new Date(),
    };
    this.testResults.set(result.id, result);
    return result;
  }

  // Activity Log
  async getActivityLog(limit: number = 50): Promise<ActivityLog[]> {
    const logs = Array.from(this.activityLogs.values())
      .sort((a, b) => b.createdAt!.getTime() - a.createdAt!.getTime());
    
    return logs.slice(0, limit);
  }

  async createActivityLog(insertLog: InsertActivityLog): Promise<ActivityLog> {
    const log: ActivityLog = {
      userId: insertLog.userId,
      action: insertLog.action,
      resourceType: insertLog.resourceType,
      resourceId: insertLog.resourceId,
      resourceName: insertLog.resourceName,
      metadata: insertLog.metadata || {},
      id: this.currentId.activityLogs++,
      createdAt: new Date(),
    };
    this.activityLogs.set(log.id, log);
    return log;
  }

  // Analytics
  async getConfigurationStats(): Promise<{
    totalConfigurations: number;
    activeTestRuns: number;
    successRate: number;
    totalApplications: number;
  }> {
    const totalConfigurations = this.configurations.size;
    const activeTestRuns = Array.from(this.testRuns.values())
      .filter(tr => tr.status === 'running').length;
    
    const completedResults = Array.from(this.testResults.values())
      .filter(tr => tr.status === 'completed' || tr.status === 'failed');
    const successfulResults = completedResults.filter(tr => tr.status === 'completed');
    const successRate = completedResults.length > 0 ? 
      (successfulResults.length / completedResults.length) * 100 : 0;
    
    const totalApplications = this.applications.size;
    
    return {
      totalConfigurations,
      activeTestRuns,
      successRate: Math.round(successRate * 10) / 10,
      totalApplications,
    };
  }
}

export const storage = new MemStorage();
