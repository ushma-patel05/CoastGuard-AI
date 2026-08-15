# CoastGuard-AI
AI-Driven Cyclone &amp; Coastal Disaster Early Warning System for Gujarat using Agentic AI, IBM Granite LLM and IBM Cloud.
# ⚓ CoastGuard AI

## AI-Driven Cyclone & Coastal Disaster Early Warning System

CoastGuard AI is an Agentic AI-based disaster management solution designed to support cyclone monitoring, fishermen safety, evacuation planning, relief coordination, and post-disaster damage assessment for Gujarat's coastal regions.

---

## 🌊 Problem Statement

Gujarat has a coastline of more than 1,600 km and is highly vulnerable to severe cyclones such as Tauktae and Biparjoy.

Coastal communities and fishermen may receive delayed or generalized warnings, increasing the risk of loss of life, boats, infrastructure, and property.

CoastGuard AI aims to provide a unified intelligent platform for:

- Hyperlocal cyclone risk monitoring
- Fishermen safety alerts
- Evacuation route planning
- Relief resource coordination
- Post-disaster damage assessment

---

## 🎯 Objective

The main objective of CoastGuard AI is to build an Agentic AI solution that can analyze disaster-related information and provide decision support for coastal districts.

The system focuses on:

1. Predicting and monitoring cyclone risk
2. Protecting fishermen and vessels
3. Supporting evacuation planning
4. Coordinating emergency resources
5. Assessing post-disaster damage

---

## 🤖 AI Agents

### 🌀 1. Cyclone Track & Intensity Prediction Agent

Analyzes cyclone-related information such as:

- Wind speed
- Atmospheric pressure
- Cyclone direction
- Intensity
- Landfall probability
- Affected coastal regions

Provides cyclone risk assessment and decision-support recommendations.

### ⚓ 2. Fishermen Safety Alert Agent

Supports fishermen safety by analyzing:

- Vessel location
- Danger zones
- Cyclone position
- Distance from safe areas
- Vessel risk

The agent can generate vessel-specific safety recommendations.

### 🏃 3. Evacuation Route Planning Agent

Supports evacuation planning using:

- Population information
- Shelters
- Roads
- Traffic conditions
- Risk zones
- Priority areas

The goal is to identify safer evacuation routes and suitable shelters.

### 📦 4. Relief Resource Coordination Agent

Helps coordinate emergency resources such as:

- Food
- Drinking water
- Medical supplies
- Rescue boats
- Shelters
- Emergency equipment

Resources can be prioritized according to affected areas and estimated requirements.

### 🏚️ 5. Post-Disaster Damage Assessment Agent

Supports assessment of disaster damage to:

- Buildings
- Roads
- Agriculture
- Infrastructure
- Coastal facilities

The agent can help identify damage severity and recovery priorities.

---

## 🏗️ System Architecture

```text
                    COASTGUARD AI
                          │
                          ▼
                  Data Collection Layer
                          │
             ┌────────────┼────────────┐
             │            │            │
          Weather      Vessel       Coastal
           Data         Data        Sensors
             │            │            │
             └────────────┼────────────┘
                          ▼
                    IBM Cloud Layer
                          │
                          ▼
                  Agentic AI Orchestrator
                          │
       ┌──────────────────┼──────────────────┐
       │         │        │        │         │
       ▼         ▼        ▼        ▼         ▼
    Cyclone   Fishermen Evacuation Relief   Damage
     Agent      Agent      Agent    Agent    Agent
       │         │        │        │         │
       └─────────┴────────┼────────┴─────────┘
                          ▼
                    IBM Granite LLM
                          │
                          ▼
                  Risk & Decision Support
                          │
                          ▼
                 CoastGuard AI Dashboard
                          │
             ┌────────────┼────────────┐
             ▼            ▼            ▼
           Alerts       Risk Map     Reports
