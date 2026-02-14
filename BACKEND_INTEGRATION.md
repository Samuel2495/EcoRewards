# EcoRewards Backend Implementation Guide

This document provides a roadmap for migrating the EcoRewards platform from a client-side (LocalStorage) architecture to a dedicated backend (Express.js or Next.js API).

## Current Architecture
- **Frontend**: React (Vite)
- **State Management**: React Context (`AuthContext`, `DataContext`)
- **Storage**: Browser LocalStorage
- **Auth**: Mock authentication validated against LocalStorage data

## Current Data Models (LocalStorage Keys)
- `users`: Array of all registered users.
- `currentUser`: The currently logged-in user object.
- `tasks`: Array of available eco-tasks.
- `rewards`: Array of available rewards.
- `tasks_{userId}`: Verification history for a specific user.
- `pickupRequests`: Global list of bulk recycle requests.
- `checkins_{userId}`: Hub check-in history for a specific user.

## Proposed Database Schema

### 1. User
| Field | Type | Description |
|---|---|---|
| id | UUID | Unique identifier |
| username | String | Unique username |
| password | String | Hashed password |
| fullName | String | User's display name |
| email | String | User's email |
| role | Enum | 'user' or 'admin' |
| hubCode | String | (Optional) Associated hub code for hub admins |
| points | Integer | Total points (default 0) |
| credits | Integer | Total credits (default 0) |

### 2. Hub
| Field | Type | Description |
|---|---|---|
| id | Integer/UUID | Unique identifier |
| code | String | Unique hub code (e.g., VYT-HUB) |
| name | String | Hub name |
| address | Text | Full address |
| coordinator | String | Name of the person in charge |
| lat / lng | Float | Geolocation coordinates |

## API Requirements

### Auth
- `POST /api/auth/login`: Returns JWT and user object.
- `POST /api/auth/signup`: Validates uniqueness and creates user.

### Data
- `GET /api/hubs`: Returns all hubs.
- `GET /api/tasks`: Returns available tasks.
- `POST /api/pickup/request`: Saves a new bulk pickup request.
- `GET /api/pickup/hub/:hubId`: Returns requests assigned to a specific hub.

## Integration Roadmap
1. **API First**: Implement the endpoints for Login and Signup first.
2. **Context Migration**: Update `AuthContext` to hit the API instead of LocalStorage.
3. **Data Sync**: Implement `GET /api/hubs` and `GET /api/tasks` to replace hardcoded initial data.
4. **Action Persistence**: Migrate `requestPickup` and `checkInToHub` to POST requests.
