# Flyen Platform - Project Schema Specification

This document defines the properties and data types for projects loaded into `src/data/projects.json`.

---

## Standard JSON Schema

Each project object in `projects.json` must follow this structure:

| Field | Type | Description |
| :--- | :--- | :--- |
| **id** | `string` | Unique identifier (e.g. `proj-smart-home`). |
| **slug** | `string` | URL slug representation (e.g. `smart-home-automation-system`). |
| **title** | `string` | Display name of the engineering kit. |
| **description**| `string` | Short subtitle detail describing project objectives. |
| **price** | `number` | Numerical unit cost (in integer/decimal cents/rupees). |
| **currency** | `string` | Currency abbreviation, standard `INR`. |
| **projectLevel**| `string` | Target level: `School`, `Diploma`, or `Engineering`. |
| **difficulty** | `string` | Tiers: `beginner`, `intermediate`, or `advanced`. |
| **technology** | `string` | Microcontroller and main hardware components summary. |
| **category** | `string` | Main filter category (e.g. `automation`, `robotics`, `iot`). |
| **buildTime** | `string` | Estimated assembly hours duration (e.g. `6-8 Hours`). |
| **features** | `array` | Active deliverables array: `hardware`, `code`, `circuit`, `docs`, `video`, `support`. |
| **badge** | `string` | Tag labels: `best-seller`, `popular`, `new`, `student` or `""`. |
| **searchKeywords**| `array` | Array of search terms for matching and AI natural query parser. |
| **images** | `object` | Map referencing assets paths: `main`, `schematic`, `circuit`. |
| **videoUrl** | `string` | Embedded walk-through player URL. |
| **resources** | `array` | Objects mapping pdf/zip downloads: `name`, `type`, `size`, `status`. |
| **components** | `array` | Complete list of all components inside the package. |
| **specifications**| `object` | Key-value technical specifications details. |
| **reviews** | `array` | List of mock reviews: `name`, `rating`, `comment`, `institution`. |
| **relatedProjects**| `array` | IDs referencing related project kits. |
| **stockStatus** | `string` | Inventory state: `in-stock` or `out-of-stock`. |
| **featured** | `boolean` | Flag to pin items to top or landing grids. |
| **downloads** | `number` | Count tracking resource downloads. |
| **aiTrainingReferences**| `array`| Intent terms or tags matching AI model trainings. |
