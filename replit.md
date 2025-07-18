# Configuration Management System for KaneAI & Test Manager

## Overview

This is a full-stack Configuration Management system designed for KaneAI & Test Manager that allows users to manage test configurations across different environments and devices. The system provides a modern, responsive interface for creating, managing, and allocating configurations to test cases and test runs.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with custom shadcn/ui components
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Neon serverless
- **ORM**: Drizzle ORM for type-safe database operations
- **API Pattern**: RESTful API with resource-based endpoints
- **Validation**: Zod schemas shared between frontend and backend

## Key Components

### Database Schema
The system uses a comprehensive schema with the following main entities:
- **Users**: Authentication and user management
- **Configurations**: Core configuration management with support for desktop, real device, and virtual device types
- **Applications**: Application metadata for mobile testing
- **Test Cases**: Test case management with category and priority support
- **Test Runs**: Test execution tracking with status and timing
- **Configuration Allocations**: Many-to-many relationships between configurations and test cases/runs
- **Activity Log**: Audit trail for all system actions

### Configuration Types
1. **Desktop**: OS, OS Version, Browser, Browser Version, Resolution
2. **Real Device**: OS, Manufacturer, Device Name, OS Version, Application (with public/private cloud support)
3. **Virtual Device**: OS, Browser, Manufacturer, Device Name, OS Version

### Core Features
- **Configuration Wizard**: Multi-step form for creating configurations
- **Allocation System**: Drag-and-drop interface for assigning configurations to test cases/runs
- **Template System**: Save configurations as reusable templates
- **Filtering & Search**: Advanced filtering across all entities
- **Activity Tracking**: Comprehensive audit logging
- **Analytics Dashboard**: Real-time statistics and insights

## Data Flow

1. **Configuration Creation**: Users create configurations through a wizard interface that validates input and stores configuration data
2. **Allocation Process**: Configurations are allocated to test cases or test runs through a visual interface
3. **Test Execution**: Test runs consume allocated configurations for execution
4. **Activity Logging**: All actions are automatically logged for audit purposes
5. **Analytics**: Dashboard aggregates data for insights and reporting

## External Dependencies

### Database
- **Neon PostgreSQL**: Serverless PostgreSQL database
- **Connection Pooling**: Built-in connection management

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Date-fns**: Date manipulation utilities

### Development Tools
- **Vite**: Fast build tool with HMR
- **TypeScript**: Type safety across the stack
- **ESBuild**: Fast bundling for production
- **Replit Integration**: Development environment support

## Deployment Strategy

### Development
- **Dev Server**: Vite dev server with Express API proxy
- **Hot Reload**: Full stack hot reloading support
- **Database**: Development database with Drizzle migrations

### Production
- **Build Process**: Vite builds frontend, ESBuild bundles backend
- **Deployment**: Single Node.js process serving static files and API
- **Database**: Production PostgreSQL with connection pooling
- **Environment**: Environment-based configuration management

### Key Architectural Decisions

1. **Shared Schema**: Zod schemas are shared between frontend and backend for consistent validation
2. **Type Safety**: Full TypeScript coverage ensures runtime safety
3. **Serverless Ready**: Neon PostgreSQL enables serverless deployment
4. **Component Architecture**: Modular React components with clear separation of concerns
5. **Query Management**: TanStack Query handles caching, synchronization, and optimistic updates
6. **Responsive Design**: Mobile-first approach with adaptive layouts
7. **Accessibility**: Radix UI ensures WCAG compliance out of the box