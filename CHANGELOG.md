# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.9.0] - 2022-06-18

### 🔥 Added

- offers module

## [2.8.0] - 2022-06-05

### 🔥 Added

- started offers module

## [2.7.0] - 2022-05-19

### 🔥 Added

- five new requirements

## [2.6.0] - 2022-05-17

### 🔥 Added

- user access restrictions

## [2.5.0] - 2022-05-11

### 🔥 Added

- RFQ's 2.0

## [2.4.0] - 2022-04-28

### 🔥 Added

- `rndTasks` everything

## [2.3.0] - 2022-04-20

### 🔥 Added

- `project` ClickUp integration
- `project` SharePoint integration

## [2.2.0] - 2022-03-27

### 🔥 Added

- `project` repo CRUD
- `project` controller & router REST API CRUD
- `partnumber` repo CRUD
- `partnumber` controller & router REST API CRUD

## [2.1.0] - 2022-03-24

### 🔥 Added

- `industry` repo CRUD
- `industry` controller & router REST API CRUD

## [2.0.0] - 2022-03-23

### 🔥 Added

- `project-client` repo CRUD
- `projectClient` controller & router REST API CRUD

## [2.0.0] - 2022-03-18

### 🔥 Added

- converted into Unisystem

## [1.8.0] - 2022-03-17

### 💪 Updated

- JWT based authentication

## [1.8.1] - 2021-08-17

### 👾 Fixed

- RfqRepo.find() returns empty string instead of null in extra_note

## [1.8.0] - 2021-08-16

### 🔥 Added

- add `extra_note` text field to `rfqs` table via **db schema migrations**
- add `extra_note` to the backend - updated `RfqRepo` class and `RFQ routes` (POST, PUT, GET) controllers logic

## [1.7.0] - 2021-08-05

### 🔥 Added

- change `eau` -> `eau min` (mandatory) + `eau max` (optional) via **db schema migrations**
- add requirements `order` feature via **db schema migrations**
- add `final solutions` notes textarea and `conclusions` notes textarea via **db schema migrations**
- add `samples expected` and `mp expected` text fields via **db schema migrations**
- change `eau` -> `eau min` (mandatory) + `eau max` (optional) - updated `RfqRepo` class and `RFQ routes` (POST, PUT, GET) controllers logic
- add requirements `order` feature - updated `RequirementRepo` class and `Requirement routes` (POST, PUT, GET) - controllers logic
- autogenerating links to **Riverdi RFQ App** and **Sharepoint** and put them into **Clickup** task description - updated `RFQ routes` - controllers logic
- add `final solutions` notes textarea and `conclusions` notes textarea - updated `RfqRepo` class and `RFQ routes` - (POST, PUT, GET) controllers logic
- `extra_note` field to add after `rfq_code` in clickup task - updated `RFQ routes` controllers logic
- add `samples expected` and `mp expected` text fields - updated `RfqRepo` class and `RFQ routes` (POST, PUT, GET) - controllers logic
- unit tests for the new features

## [1.6.0] - 2021-08-02

### 🔥 Added

- schema migrations for new features

## [1.5.0] - 2021-07-10

### 🔥 Added

- test coverage for critical features

## [1.4.0] - 2021-07-06

### 💪 Updated

- guarded clickup task not found case

## [1.3.0] - 2021-07-05

### 🔥 Added

- ClickUp integration (`findUserId`, `createTask`, `getTaskStatus`)

### 💪 Updated

- RfqRepo
- `new RFQ` route logic
- `show RFQ` route logic

## [1.2.0] - 2021-07-01

### 🔥 Added

- added SharePoint integration

## [1.1.0] - 2021-06-29

### 🔥 Added

- disable `login` feature for "deleted" users
- logic for updating user data on PUT `/api/v1/users/:id` route
- logic for updating user's password on PUT `/api/v1/users/:id/changepassword` route
- logic for listing ALL users (admins included) for management purposes on GET `/api/v1/usersandadmins` route
- logic for marking users as deleted on POST `/api/v1/users/disable` route
- logic for marking users as undeleted on POST `/api/v1/users/enable` route

## [1.0.0] - 2021-06-27

### 🔥 Added

- logic for different fields and confirm password validation in `creating user`

## [0.9.1] - 2021-06-25

### 👾 Fixed

- format of returned `role_id`

## [0.9.0] - 2021-06-24

### 💪 Updated

- return additional user data with rfq
- return requirements sorted by creation timestamp
- return only users marked as not deleted
- users CRUD should be only possible for admins

## [0.8.0] - 2021-06-19

### 🔥 Added

- logic for creating new distributor on POST `/api/v1/distributors` route
- logic for listing all distributors on GET `/api/v1/distributors` route
- logic for updating requirement on PUT `/api/v1/requirements/:id` route
- logic for updating rfq on PUT `/api/v1/rfqs/:id` route
- logic for updating distributor on PUT `/api/v1/distributors/:id` route
- logic for deleting requirement on DELETE `/api/v1/requirements/:id` route
- logic for deleting rfq on DELETE `/api/v1/rfqs/:id` route
- logic for deleting distributor on DELETE `/api/v1/distributors/:id` route

## [0.7.0] - 2021-06-18

### 🔥 Added

- customerRepo db handler (orm style)
- distributorRepo db handler (orm style)
- logic for listing customers on GET `/api/v1/customers` route
- logic for listing distributors on GET `/api/v1/distributors` route

## [0.6.0] - 2021-06-16

### 💪 Updated

- changed userRepo and route to return all necessary user fields, sort records by username and filter out admins

## [0.5.0] - 2021-06-15

### 🔥 Added

- logic for showing a RFQ on GET `/api/v1/rfq/:id` route
- logic for showing a RFQ's requirements on GET `/api/v1/rfq/:id/requirements` route
- tests for showing a RFQ on GET `/api/v1/rfq/:id` route
- tests for showing a RFQ's requirements on GET `/api/v1/rfq/:id/requirements` route

## [0.4.0] - 2021-06-12

### 🔥 Added

- requirementRepo db handler (orm style)
- logic for creating new requirement on POST `/api/v1/requirements` route
- tests for creating new requirement on POST `/api/v1/requirements` route

## [0.3.0] - 2021-06-11

### 🔥 Added

- logic for listing rfqs on GET `/api/v1/rfqs` route
- tests for listing rfqs on GET `/api/v1/rfqs` route

## [0.2.0] - 2021-06-10

### 🔥 Added

- db schema for the app
- schema migrations
- improved singup and login logic
- rfqRepo db handler (orm style)
- logic for creating new rfq on POST `/api/v1/rfqs` route
- tests for creating new rfq on POST `/api/v1/rfqs` route

## [0.0.1] - 2021-06-01

### 🔥 Added

- initial release
